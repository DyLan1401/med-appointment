import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/common/Navbar";
import API from "../../api/axios";
import avatar from "../../assets/avatar.jpg";
import Footer from "../../components/common/Footer"

export default function PostsPage() {
    const navigate = useNavigate();

    const [posts, setPosts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);

    // 🧭 Load categories + posts
    useEffect(() => {
        loadCategories();
    }, []);

    useEffect(() => {
        loadPosts(currentPage, selectedCategory);
    }, [currentPage, selectedCategory]);

    // 📦 Load danh mục
    const loadCategories = async () => {
        try {
            const res = await API.get("/categories");
            setCategories(Array.isArray(res.data) ? res.data : res.data.data || []);
        } catch (error) {
            console.error("Lỗi khi tải danh mục:", error);
        }
    };

    // 📦 Load bài viết
    const loadPosts = async (page = 1, categoryId = null) => {
        setLoading(true);
        try {
            const query = categoryId ? `?page=${page}&category_id=${categoryId}` : `?page=${page}`;
            const res = await API.get(`/posts${query}`);

            const postsData = Array.isArray(res.data.data)
                ? res.data.data
                : Array.isArray(res.data)
                    ? res.data
                    : [];

            setPosts(postsData);
            setLastPage(res.data.last_page || 1);
        } catch (error) {
            console.error("Lỗi khi tải bài viết:", error);
            setPosts([]);
        } finally {
            setLoading(false);
        }
    };

    // 📑 Chuyển trang
    const handlePageChange = (page) => {
        if (page >= 1 && page <= lastPage) setCurrentPage(page);
    };

    // 🧩 Chọn danh mục
    const handleCategoryClick = (categoryId) => {
        setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
        setCurrentPage(1); // reset về trang đầu
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar */}
            <Navbar />

            {/* Header */}
            <section className="py-12 px-6 text-center">
                <h1 className="text-4xl font-bold text-blue-700 mb-3">🩺 Tin tức & Bài viết</h1>
                <p className="text-gray-600 max-w-2xl mx-auto">
                    Cập nhật kiến thức y khoa, lời khuyên sức khỏe và tin tức nổi bật từ các bác sĩ của chúng tôi.
                </p>
                <div className="mt-4 w-24 h-1 bg-blue-400 mx-auto rounded-full" />
            </section>

            {/* Nội dung chính */}
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 px-6 pb-20">
                {/* Cột trái: Danh mục */}
                <aside className="w-full md:w-1/4 bg-white rounded-xl shadow-sm border p-5 h-fit sticky top-24">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
                        🗂️ Danh mục bài viết
                    </h3>
                    <ul className="space-y-2">
                        <li
                            onClick={() => handleCategoryClick(null)}
                            className={`cursor-pointer px-3 py-2 rounded-md font-medium text-sm transition-all duration-200
                ${selectedCategory === null
                                    ? "bg-blue-600 text-white shadow"
                                    : "text-gray-700 hover:bg-blue-100"
                                }`}
                        >
                            Tất cả bài viết
                        </li>
                        {categories.map((cat) => (
                            <li
                                key={cat.id}
                                onClick={() => handleCategoryClick(cat.id)}
                                className={`cursor-pointer px-3 py-2 rounded-md font-medium text-sm transition-all duration-200
                  ${selectedCategory === cat.id
                                        ? "bg-blue-600 text-white shadow"
                                        : "text-gray-700 hover:bg-blue-100"
                                    }`}
                            >
                                {cat.name}
                            </li>
                        ))}
                    </ul>
                </aside>

                {/* Cột phải: Danh sách bài viết */}
                <main className="flex-1">
                    {loading ? (
                        <p className="text-center text-gray-500 italic">Đang tải bài viết...</p>
                    ) : posts.length === 0 ? (
                        <p className="text-center text-gray-500 italic py-10">Chưa có bài viết nào.</p>
                    ) : (
                        <div className="grid lg:grid-cols-2 xl:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-8">
                            {posts.map((post) => (
                                <div
                                    key={post.id}
                                    onClick={() => navigate(`/blog/${post.id}`, { state: post })}
                                    className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden group"
                                >
                                    <div className="overflow-hidden">
                                        <img
                                            src={post.image || avatar}
                                            alt={post.title}
                                            onError={(e) => (e.target.src = avatar)}
                                            className="w-full h-56 object-cover transform group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                    <div className="p-5 flex flex-col justify-between h-[210px]">
                                        <div>
                                            <h2 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 line-clamp-2 mb-2">
                                                {post.title}
                                            </h2>
                                            <p className="text-gray-600 text-sm line-clamp-3 mb-3">
                                                {post.content}
                                            </p>
                                        </div>
                                        <div className="flex justify-between text-xs text-gray-500 border-t border-gray-100 pt-3">
                                            <span>{post.user?.name || "Bác sĩ ẩn danh"}</span>
                                            <span>
                                                {new Date(post.created_at).toLocaleDateString("vi-VN")}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Phân trang */}
                    {!loading && posts.length > 0 && (
                        <div className="flex justify-center items-center gap-3 mt-10">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={`px-4 py-2 rounded-md border text-sm ${currentPage === 1
                                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                    : "bg-blue-600 text-white hover:bg-blue-700"
                                    }`}
                            >
                                ← Trước
                            </button>

                            <span className="text-gray-700 font-medium">
                                Trang {currentPage}/{lastPage}
                            </span>

                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === lastPage}
                                className={`px-4 py-2 rounded-md border text-sm ${currentPage === lastPage
                                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                    : "bg-blue-600 text-white hover:bg-blue-700"
                                    }`}
                            >
                                Sau →
                            </button>
                        </div>
                    )}
                </main>
            </div>
            <Footer />
        </div>
    );
}
