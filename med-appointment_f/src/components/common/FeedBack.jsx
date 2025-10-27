"use client";
import { useState, useEffect } from "react";
import {
    Star,
    Trash2,
    MessageSquarePlus,
    X,
    CheckCircle,
    AlertTriangle,
    Mail,
    Award,
    Briefcase,
    User2,
} from "lucide-react";
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
    const [doctor, setDoctor] = useState(null);
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [toast, setToast] = useState(null);

    const currentUser = JSON.parse(localStorage.getItem("user"));
    const currentUserId = currentUser?.id || localStorage.getItem("user_id") || null;

    const showToast = (type, message) => {
        setToast({ type, message });
        setTimeout(() => setToast(null), 3000);
    };

    const getDoctorAvatar = (doc) => {
        const baseURL =
            import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:8000";
        const avatar = doc?.user?.avatar || doc?.avatar || doc?.avatar_url || avatarDefault;
        if (avatar.startsWith("http")) return avatar;
        return `${baseURL}/storage/${avatar}`;
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setNotFound(false); // ✅ reset trước khi fetch
            try {
                let doc = doctorFromState;
                if (!doc) {
                    const res = await API.get(`/doctors/${id}`);
                    doc = res.data.data || res.data.doctor || res.data;
                }

                if (doc && doc.id) {
                    const formattedDoctor = {
                        id: doc.id,
                        name: doc.name || doc.user?.name || "Chưa rõ tên",
                        avatar: getDoctorAvatar(doc),
                        specialization: doc.specialization?.name || "Chưa có chuyên khoa",
                        email: doc.user?.email || doc.email || "",
                        experience: doc.experience || "Chưa có kinh nghiệm",
                    };
                    setDoctor(formattedDoctor);
                    setNotFound(false); // ✅ đảm bảo reset lại khi có doctor

                    const feedbackRes = await API.get(`/feedbacks/${id}`);
                    setFeedbacks(feedbackRes.data.data || feedbackRes.data || []);
                } else {
                    setDoctor(null);
                    setNotFound(true);
                }
            } catch (error) {
                console.error("❌ Lỗi khi lấy dữ liệu:", error);
                setDoctor(null);
                setNotFound(true);
            } finally {
                // ✅ Tránh render "not found" sớm
                setTimeout(() => setLoading(false), 100);
            }
        };
        fetchData();

        // ✅ reset an toàn khi rời khỏi component
        return () => {
            setNotFound(false);
        };
    }, [id, doctorFromState]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!comment.trim() || rating === 0) {
            showToast("error", "⚠️ Vui lòng nhập đầy đủ nội dung và đánh giá sao!");
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
                user: newFeedback.user || {
                    id: currentUserId,
                    name: currentUser?.name || "Người dùng ẩn danh",
                },
                rating: newFeedback.rating,
                comment: newFeedback.comment,
                created_at: newFeedback.created_at || new Date().toISOString(),
            };

            setFeedbacks((prev) => [formattedFeedback, ...prev]);
            setComment("");
            setRating(0);
            setShowForm(false);
            showToast("success", "🎉 Gửi feedback thành công!");
        } catch (error) {
            console.error("❌ Lỗi gửi feedback:", error);
            showToast("error", "Gửi feedback thất bại, vui lòng thử lại!");
        }
    };

    const handleDelete = async (feedbackId) => {
        if (!window.confirm("Bạn có chắc muốn xóa feedback này không?")) return;
        try {
            await API.delete(`/feedbacks/${feedbackId}`);
            setFeedbacks((prev) => prev.filter((fb) => fb.id !== feedbackId));
            showToast("success", "🗑️ Đã xóa feedback thành công!");
        } catch (error) {
            console.error("❌ Lỗi khi xóa:", error);
            showToast("error", "Không thể xóa feedback!");
        }
    };

    // 🌀 Loading state
    if (loading) {
        return (
            <div className="p-10 text-center text-gray-500 animate-pulse">
                Đang tải dữ liệu bác sĩ...
            </div>
        );
    }

    // ✅ Chỉ hiển thị "Không tìm thấy bác sĩ" khi chắc chắn không có dữ liệu thật
    if (!loading && (!doctor || !doctor.id) && notFound) {
        return (
            <div className="flex flex-col items-center justify-center p-10 text-center text-gray-600">
                <AlertTriangle className="text-blue-600 w-10 h-10 mb-3" />
                <p className="text-lg font-semibold">Không tìm thấy bác sĩ phù hợp</p>
                <p className="text-sm text-gray-500 mt-1">
                    Có thể bác sĩ đã bị xóa hoặc không tồn tại.
                </p>
            </div>
        );
    }

    // ✅ Normal display when doctor exists
    return (
        <div className="max-w-5xl mx-auto mt-12 p-6 bg-gradient-to-b from-white to-blue-50 rounded-3xl shadow-xl border border-gray-100">
            {/* Doctor profile */}
            <div className="flex flex-col md:flex-row items-center gap-8 mb-8 p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition">
                <img
                    src={doctor.avatar}
                    alt={doctor.name}
                    className="w-40 h-40 rounded-2xl object-cover border-4 border-blue-500 shadow-md"
                />
                <div className="text-center md:text-left">
                    <h2 className="text-3xl font-bold text-blue-700">{doctor.name}</h2>
                    <p className="text-gray-600 text-lg mt-1 flex items-center justify-center md:justify-start">
                        <Award className="inline-block w-5 h-5 mr-1 text-yellow-500" />
                        {doctor.specialization}
                    </p>
                    <p className="text-gray-500 mt-2 flex items-center justify-center md:justify-start">
                        <Mail size={16} className="mr-2 text-blue-500" /> {doctor.email}
                    </p>
                    <p className="text-gray-500 mt-1 flex items-center justify-center md:justify-start">
                        <Briefcase size={16} className="mr-2 text-blue-500" />
                        Kinh nghiệm: {doctor.experience}
                    </p>
                </div>
            </div>

            {/* Feedback form */}
            <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-blue-700">Viết đánh giá của bạn</h3>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
                    >
                        {showForm ? <X className="mr-2" /> : <MessageSquarePlus className="mr-2" />}
                        {showForm ? "Đóng" : "Viết Feedback"}
                    </button>
                </div>

                {showForm && (
                    <div className="animate-fade-in">
                        <div className="flex items-center mb-3">
                            <span className="mr-3 text-sm text-gray-700 font-medium">
                                Mức độ hài lòng:
                            </span>
                            {[1, 2, 3, 4, 5].map((index) => (
                                <Star
                                    key={index}
                                    size={25}
                                    className={`cursor-pointer transition-all ${
                                        index <= (hover || rating)
                                            ? "fill-yellow-400 text-yellow-400 scale-110"
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
                            placeholder="Nhập cảm nghĩ của bạn về bác sĩ..."
                            className="w-full border border-gray-300 rounded-lg p-3 mb-4 focus:ring-2 focus:ring-blue-400 outline-none text-sm"
                            rows="4"
                        />
                        <button
                            onClick={handleSubmit}
                            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition font-semibold"
                        >
                            Gửi Feedback
                        </button>
                    </div>
                )}
            </div>

            {/* Feedback list */}
            <div className="bg-white rounded-2xl shadow-md p-6">
                <h3 className="text-xl font-semibold text-gray-700 mb-5">
                    Các Feedback gần đây
                </h3>
                {feedbacks.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center">
                        Chưa có feedback nào.
                    </p>
                ) : (
                    feedbacks.map((fb, idx) => (
                        <div
                            key={idx}
                            className="bg-blue-50 p-4 rounded-xl shadow-sm mb-3 border border-blue-100 hover:shadow-md transition relative"
                        >
                            {currentUserId == fb.user?.id && (
                                <button
                                    onClick={() => handleDelete(fb.id)}
                                    className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition transform hover:scale-110"
                                >
                                    <Trash2 size={18} />
                                </button>
                            )}
                            <div className="flex justify-between items-center mb-2">
                                <div className="flex items-center gap-2">
                                    <User2 className="text-blue-600" />
                                    <div>
                                        <p className="font-semibold text-gray-800">
                                            {fb.user?.name || "Người dùng ẩn danh"}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            {fb.created_at
                                                ? new Date(fb.created_at).toLocaleDateString("vi-VN")
                                                : "Chưa xác định"}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    {Array.from({ length: 5 }, (_, i) => (
                                        <Star
                                            key={i}
                                            size={15}
                                            className={
                                                i < Math.round(fb.rating)
                                                    ? "fill-yellow-400 text-yellow-400"
                                                    : "text-gray-300"
                                            }
                                        />
                                    ))}
                                </div>
                            </div>
                            <p className="text-gray-700 text-sm italic">{fb.comment}</p>
                        </div>
                    ))
                )}
            </div>

            {/* Toast */}
            {toast && (
                <div
                    className={`fixed bottom-5 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-xl text-white shadow-lg flex items-center gap-2 animate-slide-up ${
                        toast.type === "success" ? "bg-green-500" : "bg-red-500"
                    }`}
                >
                    {toast.type === "success" ? (
                        <CheckCircle size={20} />
                    ) : (
                        <AlertTriangle size={20} />
                    )}
                    <span className="text-sm font-medium">{toast.message}</span>
                </div>
            )}
        </div>
    );
}