import React, { useState, useEffect } from "react";
import { Save, X } from "lucide-react";
import { toast } from "react-toastify";
import { FaTrashAlt, FaPencilAlt } from "react-icons/fa";
import API from "../../api/axios"; // ✅ dùng axios instance có interceptor

export default function ManagerFeedBackPost() {
    const [feedbacks, setFeedbacks] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editingContent, setEditingContent] = useState("");

    // ✅ Load toàn bộ feedback (admin)
    const fetchFeedbacks = async () => {
        try {
            const res = await API.get("/post-feedbacks");
            setFeedbacks(res.data.data || []);
        } catch (err) {
            console.error(err);
            toast.error("❌ Không thể tải danh sách feedback!");
        }
    };

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    // ✅ Bắt đầu sửa
    const handleEdit = (fb) => {
        setEditingId(fb.id);
        setEditingContent(fb.content);
    };

    // ✅ Lưu cập nhật
    const handleSave = async (id) => {
        if (!editingContent.trim()) {
            toast.warning("⚠️ Nội dung không được để trống!");
            return;
        }

        try {
            await API.put(`/post-feedbacks/${id}`, {
                content: editingContent,
            });

            toast.success("✅ Cập nhật feedback thành công!");
            setEditingId(null);
            setEditingContent("");
            fetchFeedbacks();
        } catch (err) {
            console.error(err);
            toast.error("❌ Không thể cập nhật feedback!");
        }
    };

    // ✅ Xóa feedback
    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xóa feedback này không?")) return;

        try {
            await API.delete(`/post-feedbacks/${id}`);
            toast.success("🗑️ Đã xóa feedback!");
            fetchFeedbacks();
        } catch (err) {
            console.error(err);
            toast.error("❌ Không thể xóa feedback!");
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold text-blue-700 mb-4">
                Quản lý Feedback Bài viết
            </h2>

            <div className="space-y-4">
                {feedbacks.length === 0 ? (
                    <p className="text-gray-400 italic">Chưa có feedback nào.</p>
                ) : (
                    feedbacks.map((fb) => (
                        <div
                            key={fb.id}
                            className="border border-gray-100 rounded-xl p-4 flex items-start gap-4 hover:shadow-sm transition"
                        >
                            {/* ✅ Avatar chuẩn theo accessor avatar_url */}
                            <img
                                src={
                                    fb.user?.avatar_url ||
                                    "https://cdn-icons-png.flaticon.com/512/4140/4140048.png"
                                }
                                alt={fb.user?.name || "Người dùng"}
                                className="w-12 h-12 rounded-full border"
                            />

                            <div className="flex-1">
                                <h3 className="font-semibold text-blue-700">
                                    {fb.user?.name || "Ẩn danh"}
                                </h3>

                                {editingId === fb.id ? (
                                    <div className="mt-2">
                                        <textarea
                                            value={editingContent}
                                            onChange={(e) => setEditingContent(e.target.value)}
                                            className="w-full border rounded-md p-2 text-sm"
                                        />
                                        <div className="flex gap-2 mt-2">
                                            <button
                                                onClick={() => handleSave(fb.id)}
                                                className="flex items-center gap-1 bg-green-500 text-white px-3 py-1 rounded-md text-sm"
                                            >
                                                <Save className="w-4 h-4" /> Lưu
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setEditingId(null);
                                                    setEditingContent("");
                                                }}
                                                className="flex items-center gap-1 bg-gray-400 text-white px-3 py-1 rounded-md text-sm"
                                            >
                                                <X className="w-4 h-4" /> Hủy
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-gray-600 text-sm mt-1">
                                        “{fb.content}”
                                    </p>
                                )}

                                <div className="flex items-center justify-between mt-2">
                                    <span className="text-xs text-gray-400">
                                        {fb.created_at
                                            ? new Date(fb.created_at).toLocaleDateString("vi-VN")
                                            : "Chưa rõ"}
                                    </span>

                                    {/* ✅ Hiển thị role */}
                                    <span
                                        className={`text-xs px-2 py-1 rounded-full ${fb.role === "doctor"
                                                ? "bg-blue-100 text-blue-700"
                                                : "bg-green-100 text-green-700"
                                            }`}
                                    >
                                        {fb.role}
                                    </span>
                                </div>
                            </div>

                            {/* ✅ Nút thao tác */}
                            {editingId !== fb.id && (
                                <div className="flex flex-col gap-2">
                                    <button
                                        onClick={() => handleEdit(fb)}
                                        className="text-blue-500 hover:underline text-sm flex items-center gap-1"
                                    >
                                        <FaPencilAlt />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(fb.id)}
                                        className="text-red-500 hover:underline text-sm flex items-center gap-1"
                                    >
                                        <FaTrashAlt />
                                    </button>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
