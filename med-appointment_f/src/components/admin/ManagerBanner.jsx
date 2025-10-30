import React, { useState, useEffect } from "react";
import API from "../../api/axios";

export default function ManagerBanners() {
    const [banners, setBanners] = useState([]);
    const [pagination, setPagination] = useState({ current_page: 1, last_page: 1 });

    const [form, setForm] = useState({
        title: "",
        link: "",
        image: "",
        is_active: true,
    });

    const [editingId, setEditingId] = useState(null);
    const [search, setSearch] = useState("");

    // ------------------- API -------------------
    const loadBanners = async (page = 1) => {
        try {
            const res = await API.get(`/banners?page=${page}&search=${search}`);
            setBanners(res.data);
            console.log(res.data) // nếu paginate hoặc không
            setPagination({
                current_page: res.data.current_page || 1,
                last_page: res.data.last_page || 1,
            });
        } catch (err) {
            console.error("Lỗi khi tải banners:", err);
        }
    };

    const deleteBanner = (id) => API.delete(`/banners/${id}`);

    // ------------------- Hooks -------------------
    useEffect(() => {
        loadBanners();
    }, []);

    // ------------------- CRUD HANDLERS -------------------
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("title", form.title);
        formData.append("link", form.link);
        formData.append("is_active", form.is_active ? 1 : 0);
        if (form.image) formData.append("image", form.image);

        try {
            if (editingId) {
                await API.post(`/banners/${editingId}?_method=PUT`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
            } else {
                await API.post("/banners", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
            }
            setForm({ title: "", link: "", image: "", is_active: true });
            setEditingId(null);
            loadBanners();
        } catch (err) {
            console.error("Lỗi khi gửi dữ liệu:", err);
        }
    };

    const handleEdit = (banner) => {
        setEditingId(banner.id);
        setForm({
            title: banner.title || "",
            link: banner.link || "",
            image: null,
            oldImage: banner.image,
            is_active: banner.is_active ? true : false,
        });
    };

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc muốn xóa banner này?")) {
            await deleteBanner(id);
            loadBanners();
        }
    };

    // ------------------- UI -------------------
    const filteredBanners = banners.filter((b) =>
        b.title?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-blue-700">🖼️ Quản lý Banner</h2>
                <button
                    onClick={() => {
                        setEditingId(null);
                        setForm({ title: "", link: "", image: "", is_active: true });
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium"
                >
                    ➕ Thêm banner
                </button>
            </div>

            {/* Search bar */}
            <div className="flex gap-3 mb-6">
                <input
                    type="text"
                    placeholder="Nhập tiêu đề banner..."
                    className="border border-gray-300 rounded-md px-3 py-2 w-1/3 focus:ring focus:ring-blue-200"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <button
                    onClick={loadBanners}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
                >
                    🔍 Tìm kiếm
                </button>
            </div>

            {/* Form thêm / sửa banner */}
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-5 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-700 mb-1 font-medium">Tiêu đề</label>
                        <input
                            type="text"
                            placeholder="Nhập tiêu đề banner..."
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            className="border border-gray-300 rounded-md w-full px-3 py-2 focus:ring focus:ring-blue-200"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-1 font-medium">Liên kết</label>
                        <input
                            type="text"
                            placeholder="Nhập link (nếu có)"
                            value={form.link}
                            onChange={(e) => setForm({ ...form, link: e.target.value })}
                            className="border border-gray-300 rounded-md w-full px-3 py-2 focus:ring focus:ring-blue-200"
                        />
                    </div>
                </div>

                <div className="mt-4">
                    <label className="block text-gray-700 mb-1 font-medium">Ảnh banner</label>
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
                    {!form.image && form.oldImage && (
                        <div className="mt-2">
                            <img
                                src={`http://localhost:8000/storage/${form.oldImage}`}
                                alt="old"
                                className="w-24 h-24 object-cover rounded-md border"
                            />
                        </div>
                    )}
                </div>

                <div className="mt-4 flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={form.is_active}
                        onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                    />
                    <label className="text-gray-700">Hiển thị banner</label>
                </div>

                <div className="mt-4 text-right">
                    <button
                        type="submit"
                        className={`px-6 py-2 rounded-md text-white font-medium ${editingId
                            ? "bg-yellow-500 hover:bg-yellow-600"
                            : "bg-blue-600 hover:bg-blue-700"
                            }`}
                    >
                        {editingId ? "Cập nhật" : "Thêm mới"}
                    </button>
                </div>
            </form>

            {/* Bảng danh sách banner */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full text-sm text-gray-700">
                    <thead>
                        <tr className="bg-blue-600 text-white text-left">
                            <th className="py-3 px-4 font-semibold">ID</th>
                            <th className="py-3 px-4 font-semibold">Tiêu đề</th>
                            <th className="py-3 px-4 font-semibold">Ảnh</th>
                            <th className="py-3 px-4 font-semibold">Liên kết</th>
                            <th className="py-3 px-4 font-semibold">Trạng thái</th>
                            <th className="py-3 px-4 font-semibold text-center">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredBanners.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="6"
                                    className="text-center text-gray-500 py-5 italic"
                                >
                                    Chưa có banner nào
                                </td>
                            </tr>
                        ) : (
                            filteredBanners.map((b, index) => (
                                <tr
                                    key={b.id}
                                    className={`border-b hover:bg-gray-50 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"
                                        }`}
                                >
                                    <td className="py-3 px-4">{b.id}</td>
                                    <td className="py-3 px-4 font-medium text-gray-800">
                                        {b.title || "Không có tiêu đề"}
                                    </td>
                                    <td className="py-3 px-4">
                                        {b.image ? (
                                            <img
                                                src={b.image}
                                                alt={b.title}
                                                className="w-16 h-16 object-cover rounded-md border"
                                            />
                                        ) : (
                                            <span className="text-gray-400 italic">Không có ảnh</span>
                                        )}
                                    </td>
                                    <td className="py-3 px-4 truncate max-w-xs">{b.link || "—"}</td>
                                    <td className="py-3 px-4">
                                        {b.is_active ? (
                                            <span className="text-green-600 font-medium">Hiển thị</span>
                                        ) : (
                                            <span className="text-gray-400 font-medium">Ẩn</span>
                                        )}
                                    </td>
                                    <td className="py-3 px-4 text-center space-x-2">
                                        <button
                                            onClick={() => handleEdit(b)}
                                            className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-md text-sm"
                                        >
                                            Sửa
                                        </button>
                                        <button
                                            onClick={() => handleDelete(b.id)}
                                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm"
                                        >
                                            Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Phân trang */}
            <div className="flex justify-center items-center gap-2 mt-6">
                <button
                    onClick={() => loadBanners(pagination.current_page - 1)}
                    disabled={pagination.current_page === 1}
                    className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-md disabled:opacity-50"
                >
                    ◀ Trước
                </button>

                <span className="text-gray-700 font-medium">
                    Trang {pagination.current_page} / {pagination.last_page}
                </span>

                <button
                    onClick={() => loadBanners(pagination.current_page + 1)}
                    disabled={pagination.current_page === pagination.last_page}
                    className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-md disabled:opacity-50"
                >
                    Sau ▶
                </button>
            </div>
        </div>
    );
}
