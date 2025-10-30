import React, { useEffect, useState } from "react";
import API from "../../api/axios"; // axios đã config baseURL
import avatar from "../../assets/avatar.jpg";

export default function Section2() {
    const [posts, setPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [loading, setLoading] = useState(false);

    console.log(loading);
    useEffect(() => {
        loadPosts(currentPage);
    }, [currentPage]);

    const loadPosts = async (page = 1) => {
        setLoading(true);
        try {
            const res = await API.get(`/posts?page=${page}`);
            // ✅ Nếu backend trả về data dạng object có "data" thì dùng nó,
            // nếu không thì dùng chính res.data
            const postsData = Array.isArray(res.data.data)
                ? res.data.data
                : Array.isArray(res.data)
                    ? res.data
                    : [];
            setPosts(postsData);
            setLastPage(res.data.last_page || 1);
        } catch (err) {
            console.error("Lỗi khi tải bài viết:", err);
            setPosts([]); // tránh undefined
        } finally {
            setLoading(false);
        }
    };


    const handlePageChange = (page) => {
        if (page >= 1 && page <= lastPage) {
            setCurrentPage(page);
        }
    };

    return (
        <div className="w-full h-full bg-gray-50 py-10">
            <div className="w-full flex flex-col justify-center items-center">
                <div className="text-3xl font-bold py-5 text-blue-500">
                    📰 Tin Tức Sức Khỏe
                    <hr className="mt-2 border-blue-300 w-40 mx-auto" />
                </div>

                {Array.isArray(posts) && posts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-10">
                        {posts.map((post) => (
                            <div
                                key={post.id}
                                className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                            >
                                <img
                                    className="w-full h-56 object-cover"
                                    src={post.image || avatar}
                                    alt={post.title}
                                    onError={(e) => (e.target.src = avatar)}
                                />
                                <div className="p-4 flex flex-col gap-2">
                                    <h3 className="font-semibold text-lg text-gray-800 line-clamp-2">
                                        {post.title}
                                    </h3>
                                    <p className="text-sm text-gray-600 line-clamp-3">{post.content}</p>
                                    <a
                                        href="#"
                                        className="text-blue-600 font-medium hover:text-blue-800 mt-2"
                                    >
                                        Đọc thêm →
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 italic py-5">Chưa có bài viết nào</p>
                )}


                {/* Phân trang */}
                <div className="flex justify-center items-center gap-2 mt-8">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`px-3 py-1 rounded-md border ${currentPage === 1
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                            }`}
                    >
                        ← Trước
                    </button>

                    <span className="px-3 py-1 text-gray-700 font-semibold">
                        Trang {currentPage}/{lastPage}
                    </span>

                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === lastPage}
                        className={`px-3 py-1 rounded-md border ${currentPage === lastPage
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                            }`}
                    >
                        Sau →
                    </button>
                </div>
            </div>
        </div>
    );
}
