import React, { useState, useEffect } from "react";
import API from "../../api/axios";

export default function Categories() {
    const [categories, setCategories] = useState([]);
    const [form, setForm] = useState({ name: "", description: "" });
    const [editingId, setEditingId] = useState(null);
    const [search, setSearch] = useState("");

    // const getCategories = () => API.get("/categories");
    const createCategory = (data) => API.post("/    ", data);
    const updateCategory = (id, data) => API.put(`/categories/${id}`, data);
    const deleteCategory = (id) => API.delete(`/categories/${id}`);

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        const res = await API.get(`/categories?search=${search}`);
        setCategories(res.data);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editingId) {
            await updateCategory(editingId, form);
        } else {
            await createCategory(form);
        }
        setForm({ name: "", description: "" });
        setEditingId(null);
        loadCategories();
    };

    const handleEdit = (cat) => {
        setEditingId(cat.id);
        setForm({ name: cat.name, description: cat.description });
    };

    const handleDelete = async (id) => {
        await deleteCategory(id);
        loadCategories();
    };

    const filteredCategories = categories.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-blue-700">📂 Quản lý danh mục</h2>
                <button
                    onClick={() => setEditingId(null)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium"
                >
                    ➕ Thêm danh mục
                </button>
            </div>

            {/* Search bar */}
            <div className="flex gap-3 mb-6">
                <input
                    type="text"
                    placeholder="Nhập tên danh mục..."
                    className="border border-gray-300 rounded-md px-3 py-2 w-1/3 focus:ring focus:ring-blue-200"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <button
                    onClick={loadCategories}

                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md">
                    🔍 Tìm kiếm
                </button>
            </div>

            {/* Form thêm / sửa danh mục */}
            <form
                onSubmit={handleSubmit}
                className="bg-white shadow-md rounded-lg p-5 mb-6"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-700 mb-1 font-medium">
                            Tên danh mục
                        </label>
                        <input
                            type="text"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            placeholder="Nhập tên danh mục"
                            className="border border-gray-300 rounded-md w-full px-3 py-2 focus:ring focus:ring-blue-200"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-1 font-medium">
                            Mô tả
                        </label>
                        <input
                            type="text"
                            value={form.description}
                            onChange={(e) =>
                                setForm({ ...form, description: e.target.value })
                            }
                            placeholder="Nhập mô tả"
                            className="border border-gray-300 rounded-md w-full px-3 py-2 focus:ring focus:ring-blue-200"
                        />
                    </div>
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

            {/* Bảng danh mục */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full text-sm text-gray-700">
                    <thead>
                        <tr className="bg-blue-600 text-white text-left">
                            <th className="py-3 px-4 font-semibold">ID</th>
                            <th className="py-3 px-4 font-semibold">Tên danh mục</th>
                            <th className="py-3 px-4 font-semibold">Mô tả</th>
                            <th className="py-3 px-4 font-semibold text-center">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCategories.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="4"
                                    className="text-center text-gray-500 py-5 italic"
                                >
                                    Chưa có danh mục nào
                                </td>
                            </tr>
                        ) : (
                            filteredCategories.map((cat, index) => (
                                <tr
                                    key={cat.id}
                                    className={`border-b hover:bg-gray-50 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"
                                        }`}
                                >
                                    <td className="py-3 px-4">{cat.id}</td>
                                    <td className="py-3 px-4 font-medium text-gray-800">
                                        {cat.name}
                                    </td>
                                    <td className="py-3 px-4">{cat.description}</td>
                                    <td className="py-3 px-4 text-center space-x-2">
                                        <button
                                            onClick={() => handleEdit(cat)}
                                            className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-md text-sm"
                                        >
                                            Sửa
                                        </button>
                                        <button
                                            onClick={() => handleDelete(cat.id)}
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
        </div>
    );
}
