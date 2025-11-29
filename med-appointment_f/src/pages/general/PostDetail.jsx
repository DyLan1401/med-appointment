import React, { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
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

  // ===== CURRENT USER =====
  const currentUserId = Number(localStorage.getItem("user_id")) || null;

  // ===== FEEDBACK STATE =====
  const [feedbacks, setFeedbacks] = useState([]);
  const [newFeedback, setNewFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // ===== EDIT FEEDBACK STATE =====
  const [editingId, setEditingId] = useState(null);
  const [editingContent, setEditingContent] = useState("");

  // ===== LOAD MAIN POST =====
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

  const loadPost = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/posts/${id}`);
      setPost(res.data);
      loadRelated(res.data.category_id);
    } catch (error) {
      toast.error("Không thể tải bài viết. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  // ===== LOAD RELATED POSTS =====
  const loadRelated = async (categoryId) => {
    if (!categoryId) return;
    try {
      const res = await API.get(`/posts?category_id=${categoryId}`);
      setRelatedPosts(
        res.data.data.filter((p) => p.id !== Number(id)).slice(0, 3)
      );
    } catch (error) { }
  };

  // ===== LOAD FEEDBACKS =====
  useEffect(() => {
    if (post?.id) {
      loadFeedbacks(post.id);
    }
  }, [post]);

  const loadFeedbacks = async (postId) => {
    try {
      const res = await API.get(`/posts/${postId}/feedbacks`);
      setFeedbacks(res.data.data || res.data);
    } catch (err) { }
  };

  // ===== CREATE FEEDBACK =====
  const handleSubmitFeedback = async () => {
    if (!newFeedback.trim()) return;

    setSubmitting(true);
    try {
      await API.post(`/posts/${post.id}/feedbacks`, {
        content: newFeedback, // ✅ KHÔNG GỬI ROLE
      });

      setNewFeedback("");
      loadFeedbacks(post.id);
      toast.success("Gửi feedback thành công!");
    } catch (err) {
      toast.error("Không thể gửi feedback, vui lòng thử lại!");
    } finally {
      setSubmitting(false);
    }
  };

  // ===== UPDATE FEEDBACK =====
  const handleUpdateFeedback = async (feedbackId) => {
    if (!editingContent.trim()) {
      toast.warning("Nội dung không được để trống!");
      return;
    }

    try {
      await API.put(`/post-feedbacks/${feedbackId}`, {
        content: editingContent,
      });

      setEditingId(null);
      setEditingContent("");
      loadFeedbacks(post.id);
      toast.success("Cập nhật feedback thành công!");
    } catch (err) {
      toast.error("Không thể cập nhật feedback.");
    }
  };

  // ===== DELETE FEEDBACK =====
  const handleDeleteFeedback = async (feedbackId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa feedback này?")) return;

    try {
      await API.delete(`/post-feedbacks/${feedbackId}`);
      setFeedbacks((prev) => prev.filter((f) => f.id !== feedbackId));
      toast.success("Đã xóa feedback thành công!");
    } catch (err) {
      toast.error("Không thể xóa feedback.");
    }
  };

  // ===== LOADING =====
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

      {/* ===== BANNER ===== */}
      <div className="relative w-full h-72 md:h-96 overflow-hidden">
        <img
          src={post.image || avatar}
          alt={post.title}
          onError={(e) => (e.target.src = avatar)}
          className="w-full h-full object-cover brightness-90"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white max-w-3xl text-center px-4">
            {post.title}
          </h1>
        </div>
      </div>

      {/* ===== CONTENT ===== */}
      <div className="max-w-7xl mx-auto px-6 py-16 flex flex-col md:flex-row gap-10">
        {/* ===== LEFT ===== */}
        <div className="flex-1 bg-white shadow-md rounded-2xl p-8">
          <div className="flex justify-between items-center text-sm text-gray-500 border-b pb-3 mb-6">
            <span>👨‍⚕️ {post.user?.name || "Bác sĩ ẩn danh"}</span>
            <span>🗓️ {new Date(post.created_at).toLocaleDateString("vi-VN")}</span>
          </div>

          <div className="prose max-w-none text-gray-800">
            <img
              src={post.image || avatar}
              alt={post.title}
              onError={(e) => (e.target.src = avatar)}
              className="w-full h-56 object-cover rounded-lg mb-4"
            />
            {post.content ? (
              <div
                dangerouslySetInnerHTML={{
                  __html: post.content.replace(/\n/g, "<br/>"),
                }}
              />
            ) : (
              <p className="italic text-gray-500">
                Bài viết chưa có nội dung chi tiết.
              </p>
            )}
          </div>

          {/* ===== FEEDBACK SECTION ===== */}
          <div className="mt-10 border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">💬 Phản hồi bài viết</h3>

            {/* NEW FEEDBACK */}
            <div className="flex flex-col gap-3 mb-6">
              <textarea
                value={newFeedback}
                onChange={(e) => setNewFeedback(e.target.value)}
                placeholder="Nhập phản hồi của bạn..."
                className="border rounded-lg p-3 w-full"
                rows={3}
              />
              <button
                onClick={handleSubmitFeedback}
                disabled={submitting}
                className="self-end bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg disabled:opacity-60"
              >
                {submitting ? "Đang gửi..." : "Gửi feedback"}
              </button>
            </div>

            {/* LIST FEEDBACK */}
            {feedbacks.length === 0 ? (
              <p className="text-gray-500 italic">Chưa có phản hồi nào.</p>
            ) : (
              <ul className="space-y-5">
                {feedbacks.map((fb) => (
                  <li
                    key={fb.id}
                    className={`flex gap-3 items-start p-3 rounded-lg ${fb.role === "doctor" ? "bg-blue-50" : "bg-gray-50"
                      }`}
                  >
                    <img
                      src={fb.user?.avatar_url || avatar}
                      alt={fb.user?.name || "Người dùng"}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-center text-sm text-gray-600 mb-1">
                        <span
                          className={`font-semibold ${fb.role === "doctor"
                            ? "text-blue-700"
                            : "text-green-700"
                            }`}
                        >
                          {fb.user?.name || "Ẩn danh"} (
                          {fb.role === "doctor" ? "Bác sĩ" : "Bệnh nhân"})
                        </span>
                        <span>
                          {new Date(fb.created_at).toLocaleDateString("vi-VN")}
                        </span>
                      </div>

                      {editingId === fb.id ? (
                        <>
                          <textarea
                            value={editingContent}
                            onChange={(e) =>
                              setEditingContent(e.target.value)
                            }
                            className="w-full border rounded-md p-2"
                          />
                          <div className="flex gap-2 mt-2">
                            <button
                              onClick={() => handleUpdateFeedback(fb.id)}
                              className="bg-green-600 text-white px-3 py-1 rounded-md"
                            >
                              Lưu
                            </button>
                            <button
                              onClick={() => {
                                setEditingId(null);
                                setEditingContent("");
                              }}
                              className="bg-gray-400 text-white px-3 py-1 rounded-md"
                            >
                              Hủy
                            </button>
                          </div>
                        </>
                      ) : (
                        <p className="text-gray-800">{fb.content}</p>
                      )}

                      {/* ACTION BUTTONS */}
                      {fb.user_id === currentUserId &&
                        editingId !== fb.id && (
                          <div className="flex gap-3 mt-2 text-sm">
                            <button
                              onClick={() => {
                                setEditingId(fb.id);
                                setEditingContent(fb.content);
                              }}
                              className="text-blue-600 hover:underline"
                            >
                              Sửa
                            </button>
                            <button
                              onClick={() => handleDeleteFeedback(fb.id)}
                              className="text-red-600 hover:underline"
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

        {/* ===== RIGHT (RELATED POSTS) ===== */}
        <aside className="w-full md:w-1/3 bg-white rounded-2xl shadow-md p-6 h-fit">
          <h3 className="text-lg font-semibold border-b pb-2 mb-4">
            📰 Bài viết liên quan
          </h3>

          {relatedPosts.length === 0 ? (
            <p className="text-sm text-gray-500 italic">
              Chưa có bài viết cùng danh mục.
            </p>
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
                    <h4 className="text-sm font-semibold line-clamp-2 hover:text-blue-600">
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
