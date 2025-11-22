import React, { useState, useEffect } from "react";
import API from "../../api/axios";
import { FaTrashAlt, FaPencilAlt } from "react-icons/fa";

export default function Posts() {
    const [posts, setPosts] = useState([]);
    const [pagination, setPagination] = useState({ current_page: 1, last_page: 1 });

    const [categories, setCategories] = useState([]);
    const [form, setForm] = useState({
        title: "",
        content: "",
        image: "",
        category_id: "",
    });
    const [editingId, setEditingId] = useState(null);
    const [search, setSearch] = useState("");

    const getCategories = () => API.get("/categories");
    // const getPosts = () => API.get("/posts");
    // const createPost = (data) => API.post("/posts", data);
    // const updatePost = (id, data) => API.put(`/posts/${id}`, data);
    const deletePost = (id) => API.delete(`/posts/${id}`);

    useEffect(() => {
        loadPosts();
        loadCategories();
    }, []);

    const loadPosts = async () => {
        const res = await API.get(`/posts?search=${search}`);
        console.log("Kết quả API posts:", res.data);

        setPosts(res.data.data || res.data);
        setPagination({
            current_page: res.data.current_page,
            last_page: res.data.last_page,
        });
    };

    const loadCategories = async () => {
        try {
            const res = await getCategories();
            setCategories(Array.isArray(res.data) ? res.data : res.data.data || []);
        } catch (err) {
            console.error("Lỗi khi tải danh mục:", err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("title", form.title);
        formData.append("content", form.content);
        formData.append("category_id", form.category_id);
        if (form.image) formData.append("image", form.image); // chỉ gửi khi có ảnh mới

        try {
            if (editingId) {
                await API.post(`/posts/${editingId}?_method=PUT`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
            } else {
                await API.post("/posts", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
            }

            setForm({ title: "", content: "", image: "", category_id: "", oldImage: "" });
            setEditingId(null);
            loadPosts();
        } catch (err) {
            console.error("Lỗi khi gửi dữ liệu:", err);
        }
    };


    const handleEdit = (post) => {
        setEditingId(post.id);
        setForm({
            title: post.title,
            content: post.content,
            image: null, // reset để chọn ảnh mới
            category_id: post.category_id || "",
            oldImage: post.image, // lưu lại link ảnh cũ để hiển thị
        });
    };

    const handleDelete = async (id) => {
        await deletePost(id);
        loadPosts();
    };

    const filteredPosts = posts.filter((p) =>
        p.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-6 ">
            {/* Header */}
            <h2 className="text-2xl font-bold text-blue-700 mb-2"> Quản lý bài viết</h2>

            {/* Form thêm / sửa bài viết */}
            <form
                onSubmit={handleSubmit}
                className="bg-white shadow-md rounded-lg p-5 mb-6"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-700 mb-1 font-medium">
                            Tiêu đề
                        </label>
                        <input
                            type="text"
                            placeholder="Nhập tiêu đề bài viết..."
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            className="border border-gray-300 rounded-md w-full px-3 py-2 focus:ring focus:ring-blue-200"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-1 font-medium">
                            Danh mục
                        </label>
                        <select
                            value={form.category_id}
                            onChange={(e) =>
                                setForm({ ...form, category_id: e.target.value })
                            }
                            className="border border-gray-300 rounded-md w-full px-3 py-2 focus:ring focus:ring-blue-200"
                        >
                            <option value="">-- Chọn danh mục --</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="mt-4">
                    <label className="block text-gray-700 mb-1 font-medium">
                        Hình ảnh (link)
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
                        className="border border-gray-300 rounded-md w-full px-3 py-2 focus:ring focus:ring-blue-200"
                    />
                    {form.image && typeof form.image === "object" && (
                        <div className="mt-2">
                            <img
                                src={URL.createObjectURL(form.image)}
                                alt="preview"
                                className="w-24 h-24 object-cover rounded-md border"
                            />
                        </div>
                    )}

                </div>

                <div className="mt-4">
                    <label className="block text-gray-700 mb-1 font-medium">Nội dung</label>
                    <textarea
                        placeholder="Nhập nội dung bài viết..."
                        value={form.content}
                        onChange={(e) => setForm({ ...form, content: e.target.value })}
                        className="border border-gray-300 rounded-md w-full px-3 py-2 h-28 focus:ring focus:ring-blue-200"
                    ></textarea>
                </div>

                <div className="mt-4 text-right">
                    <button
                        type="submit"
                        className={`px-6 py-2 rounded-md text-white font-medium ${editingId
                            ? "bg-green-500 hover:bg-green-600"
                            : "bg-blue-600 hover:bg-blue-700"
                            }`}
                    >
                        {editingId ? "Cập nhật" : "Thêm mới"}
                    </button>
                </div>
            </form>

            {/* Search bar */}
            <div className="flex gap-3 mb-6">
                <input
                    type="text"
                    placeholder="Nhập tiêu đề bài viết..."
                    className="border border-gray-300 rounded-md px-3 py-2 w-1/3 focus:ring focus:ring-blue-200"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <button
                    onClick={loadPosts}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
                    🔍 Tìm kiếm
                </button>
            </div>

            {/* Bảng danh sách bài viết */}
            <table className="min-w-full text-center text-sm text-gray-700">
                <thead>
                    <tr className="bg-blue-600 text-white ">
                        <th className="py-3 px-4 font-semibold">ID</th>
                        <th className="py-3 px-4 font-semibold">Tiêu đề</th>
                        <th className="py-3 px-4 font-semibold">Danh mục</th>
                        <th className="py-3 px-4 font-semibold">Hình ảnh</th>
                        <th className="py-3 px-4 font-semibold">Nội dung</th>
                        <th className="py-3 px-4 font-semibold text-center">Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredPosts.length === 0 ? (
                        <tr>
                            <td colSpan="6" className="text-center text-gray-500 py-5 italic">
                                Chưa có bài viết nào
                            </td>
                        </tr>
                    ) : (
                        filteredPosts.map((p, index) => (
                            <tr
                                key={p.id}
                                className={`border-b hover:bg-gray-50 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"
                                    }`}
                            >
                                <td className="py-3 px-4">{p.id}</td>
                                <td className="py-3 px-4 font-medium text-gray-800">
                                    {p.title}
                                </td>
                                <td className="py-3 px-4">{p.category?.name || "Không có"}</td>
                                <td className="py-3 px-4">
                                    {p.image ? (
                                        <img
                                            src={p.image}
                                            alt={p.title}
                                            className="w-16 h-16 object-cover rounded-md border"
                                        />
                                    ) : (
                                        <span className="text-gray-400 italic">Không có ảnh</span>
                                    )}
                                </td>
                                <td className="py-3 px-4 max-w-xs truncate">{p.content}</td>
                                <td className="py-3 px-4 text-center space-x-2">
                                    <button
                                        onClick={() => handleEdit(p)}
                                        className=" text-green-500 hover:underline "
                                    >
                                        <FaPencilAlt />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(p.id)}
                                        className=" text-red-600 hover:underline "
                                    >
                                        <FaTrashAlt />
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
            <div className="flex justify-center items-center gap-2 mt-6">
                <button
                    onClick={() => loadCategories(pagination.current_page - 1)}
                    disabled={pagination.current_page === 1}
                    className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-md disabled:opacity-50"
                >
                    Trước
                </button>

                <span className="text-gray-700 font-medium">
                    Trang {pagination.current_page} / {pagination.last_page}
                </span>

                <button
                    onClick={() => loadCategories(pagination.current_page + 1)}
                    disabled={pagination.current_page === pagination.last_page}
                    className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-md disabled:opacity-50"
                >
                    Sau
                </button>
            </div>
        </div >
    );
}
