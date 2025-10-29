import React, { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/common/Navbar";
import API from "../../api/axios";
import avatar from "../../assets/avatar.jpg";

export default function PostDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { state } = useLocation();
    const [post, setPost] = useState(state || null);
    const [relatedPosts, setRelatedPosts] = useState([]);
    const [loading, setLoading] = useState(false);

    const currentUserId = Number(localStorage.getItem("user_id")) || null;

    // 🟢 Cập nhật feedback
const handleUpdateFeedback = async (id, newContent) => {
  try {
    await API.put(`/feedbacks/${id}`, { content: newContent });
    setFeedbacks((prev) =>
      prev.map((f) => (f.id === id ? { ...f, content: newContent, isEditing: false } : f))
    );
  } catch (err) {
    console.error("Lỗi khi cập nhật feedback:", err);
    alert("Không thể cập nhật feedback.");
  }
};

// 🔴 Xóa feedback
const handleDeleteFeedback = async (id) => {
  if (!window.confirm("Bạn có chắc chắn muốn xóa feedback này?")) return;
  try {
    await API.delete(`/feedbacks/${id}`);
    setFeedbacks((prev) => prev.filter((f) => f.id !== id));
  } catch (err) {
    console.error("Lỗi khi xóa feedback:", err);
    alert("Không thể xóa feedback.");
  }
};
    // 🧭 Gọi API khi load trang hoặc F5
    useEffect(() => {
        setLoading(true);
        if (state && state.id === Number(id)) {
            setPost(state);
            loadRelated(state.category_id);
            setLoading(false);
        } else {
            loadPost();
        }
    }, [id]);

    // 📦 Lấy chi tiết bài viết
    const loadPost = async () => {
        setLoading(true);
        try {
            const res = await API.get(`/posts/${id}`);
            setPost(res.data);
            loadRelated(res.data.category_id);
        } catch (error) {
            console.error("Lỗi khi tải bài viết:", error);
        } finally {
            setLoading(false);
        }
    };

    // 📦 Lấy bài viết liên quan cùng danh mục
    const loadRelated = async (categoryId) => {
        if (!categoryId) return;
        try {
            const res = await API.get(`/posts?category_id=${categoryId}`);
            setRelatedPosts(res.data.data.filter((p) => p.id !== Number(id)).slice(0, 3));
        } catch (error) {
            console.error("Lỗi khi tải bài viết liên quan:", error);
        }
    };

    // 🗣️ FEEDBACK SECTION
    const [feedbacks, setFeedbacks] = useState([]);
    const [newFeedback, setNewFeedback] = useState("");
    const [role, setRole] = useState(localStorage.getItem("role") || "patient"); // mặc định là bệnh nhân
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (post?.id) {
            loadFeedbacks(post.id);
        }
    }, [post]);

    const loadFeedbacks = async (postId) => {
        try {
            const res = await API.get(`/posts/${postId}/feedbacks`);
            setFeedbacks(res.data);
        } catch (err) {
            console.error("Lỗi khi tải feedback:", err);
        }
    };

    const handleSubmitFeedback = async () => {
        if (!newFeedback.trim()) return;
        setSubmitting(true);
        try {
            await API.post(`/posts/${post.id}/feedbacks`, {
                content: newFeedback,
                role: role, // 'doctor' hoặc 'patient'
            });
            setNewFeedback("");
            loadFeedbacks(post.id);
        } catch (err) {
            console.error("Lỗi khi gửi feedback:", err);
            alert("Không thể gửi feedback, vui lòng thử lại!");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading || !post) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-500 italic">
                Đang tải bài viết...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            {/* Banner bài viết */}
            <div className="relative w-full h-72 md:h-96 overflow-hidden">
                <img
                    src={post.image || avatar}
                    alt={post.title}
                    onError={(e) => (e.target.src = avatar)}
                    className="w-full h-full object-cover brightness-90"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-white max-w-3xl text-center px-4 leading-tight drop-shadow-lg">
                        {post.title}
                    </h1>
                </div>
            </div>

            {/* Nội dung */}
            <div className="max-w-7xl mx-auto px-6 py-16 flex flex-col md:flex-row gap-10">
                {/* Cột trái: Nội dung bài viết */}
                <div className="flex-1 bg-white shadow-md rounded-2xl p-8">
                    <div className="flex justify-between items-center text-sm text-gray-500 border-b pb-3 mb-6">
                        <span>👨‍⚕️ {post.user?.name || "Bác sĩ ẩn danh"}</span>
                        <span>🗓️ {new Date(post.created_at).toLocaleDateString("vi-VN")}</span>
                    </div>

                    {/* Nội dung chính */}
                    <div className="prose max-w-none text-gray-800 leading-relaxed">
                        <div className="overflow-hidden">
                            <img
                                src={post.image || avatar}
                                alt={post.title}
                                onError={(e) => (e.target.src = avatar)}
                                className="w-full h-56 object-cover transform group-hover:scale-105 transition-transform duration-500"
                            />
                        </div>
                        {post.content ? (
                            <div
                                dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, "<br/>") }}
                            />
                        ) : (
                            <p className="italic text-gray-500">Bài viết chưa có nội dung chi tiết.</p>
                        )}
                    </div>

                    {/* 🗣️ Khu vực Feedback */}
                    <div className="mt-10 border-t pt-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">💬 Phản hồi bài viết</h3>

                        {/* Vai trò người dùng */}
                        <div className="flex items-center gap-3 mb-3">
                            <label className="font-medium text-gray-700">Tôi là:</label>
                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="border rounded-lg px-3 py-2"
                            >
                                <option value="patient">Bệnh nhân</option>
                                <option value="doctor">Bác sĩ</option>
                            </select>
                        </div>

                        {/* Form nhập feedback */}
                        <div className="flex flex-col gap-3 mb-6">
                            <textarea
                                value={newFeedback}
                                onChange={(e) => setNewFeedback(e.target.value)}
                                placeholder={`Nhập phản hồi của bạn (${role === "doctor" ? "bác sĩ" : "bệnh nhân"})...`}
                                className="border rounded-lg p-3 w-full focus:ring focus:ring-blue-200"
                                rows={3}
                            />
                            <button
                                onClick={handleSubmitFeedback}
                                disabled={submitting}
                                className="self-end bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition disabled:opacity-60"
                            >
                                {submitting ? "Đang gửi..." : "Gửi feedback"}
                            </button>
                        </div>

                        {/* Danh sách feedback */}
                        {feedbacks.length === 0 ? (
                            <p className="text-gray-500 italic">Chưa có phản hồi nào.</p>
                        ) : (
                            <ul className="space-y-5">
{feedbacks.map((fb) => (
  <li
    key={fb.id}
    className={`flex gap-3 items-start ${fb.role === "doctor" ? "bg-blue-50" : "bg-gray-50"} p-3 rounded-lg`}
  >
    <img
      src={fb.user?.avatar || avatar}
      alt={fb.user?.name || "Người dùng"}
      className="w-10 h-10 rounded-full object-cover"
    />
    <div className="flex-1">
      <div className="flex justify-between items-center text-sm text-gray-600 mb-1">
        <span className={`font-semibold ${fb.role === "doctor" ? "text-blue-700" : "text-green-700"}`}>
          {fb.user?.name || "Ẩn danh"} ({fb.role === "doctor" ? "Bác sĩ" : "Bệnh nhân"})
        </span>
        <span>{new Date(fb.created_at).toLocaleDateString("vi-VN")}</span>
      </div>

      {/* Nếu đang chỉnh sửa */}
      {fb.isEditing ? (
        <div className="flex flex-col gap-2">
          <textarea
            value={fb.tempContent}
            onChange={(e) =>
              setFeedbacks((prev) =>
                prev.map((f) => (f.id === fb.id ? { ...f, tempContent: e.target.value } : f))
              )
            }
            className="w-full border rounded-md p-2"
          />
          <div className="flex gap-2">
            <button
              onClick={() => handleUpdateFeedback(fb.id, fb.tempContent)}
              className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700"
            >
              Lưu
            </button>
            <button
              onClick={() =>
                setFeedbacks((prev) =>
                  prev.map((f) => (f.id === fb.id ? { ...f, isEditing: false } : f))
                )
              }
              className="bg-gray-400 text-white px-3 py-1 rounded-md hover:bg-gray-500"
            >
              Hủy
            </button>
          </div>
        </div>
      ) : (
        <p className="text-gray-800">{fb.content}</p>
      )}

      {/* Nút hành động chỉ hiện nếu feedback thuộc về user hiện tại */}
      {fb.user_id === currentUserId && !fb.isEditing && (
        <div className="flex gap-3 mt-2 text-sm">
          <button
            onClick={() =>
              setFeedbacks((prev) =>
                prev.map((f) =>
                  f.id === fb.id ? { ...f, isEditing: true, tempContent: f.content } : f
                )
              )
            }
            className=" rounded-lg outline-1 p-2 text-blue-600 hover:underline"
          >
            Sửa
          </button>
          <button
            onClick={() => handleDeleteFeedback(fb.id)}
            className=" rounded-lg  outline-1 p-2 text-red-600 hover:underline"
          >
            Xóa
          </button>
        </div>
      )}
    </div>
  </li>
))}
</ul>

                        )}
                    </div>
                </div>

                {/* Cột phải: Bài viết liên quan */}
                <aside className="w-full md:w-1/3 bg-white rounded-2xl shadow-md p-6 h-fit">
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">
                        📰 Bài viết liên quan
                    </h3>

                    {relatedPosts.length === 0 ? (
                        <p className="text-sm text-gray-500 italic">Chưa có bài viết cùng danh mục.</p>
                    ) : (
                        <ul className="space-y-5">
                            {relatedPosts.map((p) => (
                                <li
                                    key={p.id}
                                    onClick={() => navigate(`/blog/${p.id}`, { state: p })}
                                    className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-md transition"
                                >
                                    <img
                                        src={p.image || avatar}
                                        onError={(e) => (e.target.src = avatar)}
                                        alt={p.title}
                                        className="w-16 h-16 object-cover rounded-md"
                                    />
                                    <div className="flex-1">
                                        <h4 className="text-sm font-semibold text-gray-800 line-clamp-2 hover:text-blue-600">
                                            {p.title}
                                        </h4>
                                        <p className="text-xs text-gray-500">
                                            {new Date(p.created_at).toLocaleDateString("vi-VN")}
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </aside>
            </div>
        </div>
    );
}
