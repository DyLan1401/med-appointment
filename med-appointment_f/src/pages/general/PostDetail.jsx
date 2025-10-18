import React, { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/common/Navbar";
import API from "../../api/axios";
import avatar from "../../assets/avatar.jpg";

export default function PostDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { state } = useLocation(); // nếu đi từ PostsPage thì có sẵn dữ liệu
    const [post, setPost] = useState(state || null);
    const [relatedPosts, setRelatedPosts] = useState([]);
    const [loading, setLoading] = useState(false);

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
