"use client";
import { useState, useEffect } from "react";
import { Star, Trash2, MessageSquarePlus, X } from "lucide-react";
import { useParams, useLocation } from "react-router-dom";
import API from "../../api/axios";
import avatarDefault from "../../assets/avatar.jpg";

export default function FeedBack() {
    const { id } = useParams();
    const location = useLocation();
    const doctorFromState = location.state?.doctor || null;

    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState("");
    const [doctor, setDoctor] = useState(doctorFromState);
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    // ✅ Lấy thông tin user hiện tại từ localStorage (để xác định người gửi feedback)
    const currentUser = JSON.parse(localStorage.getItem("user"));
    const currentUserId = currentUser?.id || localStorage.getItem("user_id") || null;

    // ✅ Lấy ảnh bác sĩ
    const getDoctorAvatar = (doc) => {
        const baseURL =
            import.meta.env.VITE_API_URL?.replace("/api", "") ||
            "http://localhost:8000";
        const avatar =
            doc?.user?.avatar ||
            doc?.avatar ||
            doc?.avatar_url ||
            avatarDefault;

        if (avatar.startsWith("http")) return avatar;
        return `${baseURL}/storage/${avatar}`;
    };

    // ✅ Lấy dữ liệu bác sĩ + feedback
    useEffect(() => {
        const fetchData = async () => {
            try {
                let doc = doctorFromState;

                if (!doc) {
                    const res = await API.get(`/doctors/${id}`);
                    doc = res.data.data || res.data.doctor || res.data;
                }

                const formattedDoctor = {
                    id: doc.id,
                    name: doc.name || doc.user?.name || "Chưa rõ tên",
                    avatar: getDoctorAvatar(doc),
                    specialization:
                        doc.specialization?.name || "Chưa có chuyên khoa",
                    email: doc.user?.email || doc.email || "",
                    experience: doc.experience || "Chưa có kinh nghiệm",
                };

                setDoctor(formattedDoctor);

                // ✅ lấy danh sách feedbacks
                const feedbackRes = await API.get(`/feedbacks/${id}`);
                setFeedbacks(feedbackRes.data.data || feedbackRes.data || []);
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    // ✅ Gửi feedback mới — cập nhật real-time
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!comment.trim() || rating === 0) {
            alert("Vui lòng nhập đầy đủ nội dung và đánh giá sao!");
            return;
        }

        try {
            const res = await API.post(`/feedbacks`, {
                doctor_id: id,
                user_id: currentUserId,
                rating,
                comment,
            });

            const newFeedback = res.data.data || res.data;
            const formattedFeedback = {
                id: newFeedback.id,
                user: newFeedback.user || { name: currentUser?.name || "Người dùng ẩn danh" },
                rating: newFeedback.rating,
                comment: newFeedback.comment,
                created_at: newFeedback.created_at || new Date().toISOString(),
            };

            // ✅ Thêm mới ngay vào đầu danh sách feedback
            setFeedbacks((prev) => [formattedFeedback, ...prev]);

            setComment("");
            setRating(0);
            setShowForm(false);
            alert("Cảm ơn bạn đã gửi feedback!");
        } catch (error) {
            console.error("❌ Lỗi gửi feedback:", error);
            alert("Gửi feedback thất bại!");
        }
    };

    // ✅ Xóa feedback
    const handleDelete = async (feedbackId) => {
        if (!window.confirm("Bạn có chắc muốn xóa feedback này không?")) return;
        try {
            await API.delete(`/feedbacks/${feedbackId}`);
            setFeedbacks((prev) => prev.filter((fb) => fb.id !== feedbackId));
            alert("Đã xóa feedback thành công!");
        } catch (error) {
            console.error("❌ Lỗi khi xóa:", error);
            alert("Không thể xóa feedback!");
        }
    };

    if (loading) {
        return (
            <div className="p-6 text-center text-gray-500">
                Đang tải dữ liệu...
            </div>
        );
    }

    return (
        <div className="relative max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-md mt-8">
            {/* ✅ Thông tin bác sĩ */}
            {doctor && doctor.name && (
                <div className="mb-5 flex items-center gap-3 border-b pb-3">
                    <img
                        src={doctor.avatar || avatarDefault}
                        alt={doctor.name}
                        className="w-14 h-14 rounded-full object-cover border"
                    />
                    <div>
                        <h2 className="text-xl font-bold text-blue-600">
                            {doctor.name}
                        </h2>
                        <p className="text-gray-500 text-sm">
                            {doctor.specialization}
                        </p>
                        {doctor.email && (
                            <p className="text-gray-400 text-xs mt-1">
                                {doctor.email}
                            </p>
                        )}
                        <p className="text-gray-400 text-xs mt-1 italic">
                            Kinh nghiệm: {doctor.experience}
                        </p>
                    </div>
                </div>
            )}

            {/* ✅ Nút mở form feedback */}
            <button
                onClick={() => setShowForm(!showForm)}
                className="fixed bottom-24 right-8 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition flex items-center justify-center"
                title="Viết Feedback"
            >
                {showForm ? <X size={22} /> : <MessageSquarePlus size={22} />}
            </button>

            {/* ✅ Form viết feedback */}
            {showForm && (
                <div className="fixed bottom-36 right-8 bg-white border shadow-xl rounded-xl p-5 w-96 animate-slide-up z-50">
                    <h2 className="text-xl font-bold text-blue-600 mb-1">
                        Đánh giá và Bình luận
                    </h2>
                    <p className="text-gray-500 mb-4 text-sm">
                        Chia sẻ trải nghiệm của bạn về dịch vụ khám chữa bệnh.
                    </p>
                    <h3 className="font-semibold mb-2 text-blue-600 text-lg">
                        Viết Feedback của bạn
                    </h3>

                    <div className="flex items-center mb-3">
                        <span className="mr-3 text-sm text-gray-700">
                            Mức độ hài lòng:
                        </span>
                        {[1, 2, 3, 4, 5].map((index) => (
                            <Star
                                key={index}
                                size={22}
                                className={`cursor-pointer transition-colors ${
                                    index <= (hover || rating)
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-gray-300"
                                }`}
                                onClick={() => setRating(index)}
                                onMouseEnter={() => setHover(index)}
                                onMouseLeave={() => setHover(0)}
                            />
                        ))}
                    </div>

                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Nhập bình luận của bạn..."
                        className="w-full border border-gray-300 rounded-md p-2 mb-4 focus:ring-2 focus:ring-blue-400 outline-none"
                        rows="3"
                    />

                    <button
                        onClick={handleSubmit}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition w-full"
                    >
                        Gửi Feedback
                    </button>
                </div>
            )}

            {/* ✅ Danh sách Feedback */}
            <div className="mt-6 border-t pt-4">
                <h3 className="font-semibold text-gray-700 mb-3">
                    Các Feedback gần đây
                </h3>

                {feedbacks.length === 0 ? (
                    <p className="text-gray-500 text-sm">
                        Chưa có feedback nào.
                    </p>
                ) : (
                    feedbacks.map((fb, idx) => (
                        <div
                            key={idx}
                            className="bg-gray-50 p-4 rounded-lg shadow-sm mb-3 border border-gray-200 relative"
                        >
                            {/* ✅ Chỉ hiển thị nút xóa nếu là người viết */}
                            {currentUserId == fb.user?.id && (
                                <button
                                    onClick={() => handleDelete(fb.id)}
                                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition"
                                >
                                    <Trash2 size={16} />
                                </button>
                            )}

                            <div className="flex justify-between items-center mb-1">
                                <div>
                                    <p className="font-semibold text-gray-800">
                                        {fb.user?.name || "Người dùng ẩn danh"}
                                    </p>
                                    <p className="text-sm text-gray-400">
                                        {fb.created_at
                                            ? new Date(
                                                  fb.created_at
                                              ).toLocaleDateString("vi-VN")
                                            : "Chưa xác định"}
                                    </p>
                                </div>
                                <div className="flex items-center gap-1">
                                    {Array.from({ length: 5 }, (_, i) => (
                                        <Star
                                            key={i}
                                            size={16}
                                            className={
                                                i < Math.round(fb.rating)
                                                    ? "fill-yellow-400 text-yellow-400"
                                                    : "text-gray-300"
                                            }
                                        />
                                    ))}
                                    <span className="text-sm font-medium text-gray-600 ml-1">
                                        {fb.rating}/5
                                    </span>
                                </div>
                            </div>
                            <p className="text-gray-600 text-sm">{fb.comment}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}