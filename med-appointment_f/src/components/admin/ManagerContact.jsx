import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import { FaSearch, FaUserPlus } from "react-icons/fa";

export default function ContactManager() {
  const [contacts, setContacts] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

  const API_URL = "http://localhost:8000/api/contacts";

  const getContacts = async () => {
    try {
      const res = await axios.get(API_URL);
      return res.data;
    } catch (err) {
      console.error("❌ Lỗi lấy danh sách:", err);
      return { success: false, message: "Lỗi kết nối server" };
    }
  };

  const addContact = async (data) => {
    try {
      const res = await axios.post(API_URL, data);
      return res.data;
    } catch {
      return { success: false, message: "Thêm liên hệ thất bại" };
    }
  };

  const updateContact = async (id, data) => {
    try {
      const res = await axios.put(`${API_URL}/${id}`, data);
      return res.data;
    } catch {
      return { success: false, message: "Cập nhật thất bại" };
    }
  };

  const deleteContact = async (id) => {
    try {
      const res = await axios.delete(`${API_URL}/${id}`);
      return res.data;
    } catch {
      return { success: false, message: "Xóa thất bại" };
    }
  };

  // 🟢 Load contacts
  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    setLoading(true);
    const res = await getContacts();
    if (res.success) setContacts(res.data);
    setLoading(false);
  };

  // 🟢 Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name) return alert("Vui lòng nhập tên!");
    let res = editingId ? await updateContact(editingId, form) : await addContact(form);
    if (res.success) {
      alert(res.message);
      setForm({ name: "", email: "", phone: "", message: "" });
      setEditingId(null);
      setShowForm(false);
      loadContacts();
    } else alert(res.message);
  };

  // 🟢 Xóa contact
  const handleDelete = async (id) => {
    if (window.confirm("Bạn chắc chắn muốn xóa liên hệ này?")) {
      const res = await deleteContact(id);
      if (res.success) {
        alert(res.message);
        loadContacts();
      }
    }
  };

  // 🟢 Chỉnh sửa contact
  const handleEdit = (c) => {
    setForm({ name: c.name, email: c.email, phone: c.phone, message: c.message });
    setEditingId(c.id);
    setShowForm(true);
  };

  // 🟢 Lọc theo tên
  const filtered = contacts.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-5">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-purple-700">Quản lý liên hệ</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-2 px-4 py-2 rounded-lg font-semibold"
          >
            <FaUserPlus /> {showForm ? "Đóng form" : "Thêm liên hệ"}
          </button>
        </div>

        {/* Thanh tìm kiếm */}
        <div className="flex gap-3 mb-6">
          <input
            type="text"
            placeholder="Nhập tên liên hệ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 flex-1"
          />
          <button className="bg-green-500 hover:bg-green-600 text-white px-4 rounded-lg flex items-center gap-2">
            <FaSearch /> Tìm kiếm
          </button>
        </div>

        {/* Form thêm/sửa */}
        {showForm && (
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 mb-6 border-b pb-6">
            <input
              type="text"
              placeholder="Tên"
              className="border rounded-lg p-2 col-span-1"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email"
              className="border rounded-lg p-2 col-span-1"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <input
              type="text"
              placeholder="Số điện thoại"
              className="border rounded-lg p-2 col-span-1"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
            <input
              type="text"
              placeholder="Tin nhắn"
              className="border rounded-lg p-2 col-span-2"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />
            <button
              type="submit"
              className="col-span-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg py-2 font-semibold transition"
            >
              {editingId ? "Cập nhật liên hệ" : "Thêm liên hệ"}
            </button>
          </form>
        )}

        {/* Danh sách */}
        {loading ? (
          <p className="text-center text-gray-500">Đang tải dữ liệu...</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-purple-600 text-white text-sm uppercase">
                <th className="p-2 border">ID</th>
                <th className="p-2 border">Tên</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">SĐT</th>
                <th className="p-2 border">Tin nhắn</th>
                <th className="p-2 border">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((c, i) => (
                  <tr key={c.id} className="hover:bg-gray-100 text-center">
                    <td className="border p-2">{i + 1}</td>
                    <td className="border p-2">{c.name}</td>
                    <td className="border p-2">{c.email}</td>
                    <td className="border p-2">{c.phone}</td>
                    <td className="border p-2 text-left">{c.message}</td>
                    <td className="border p-2 space-x-2">
                      <button
                        onClick={() => handleEdit(c)}
                        className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center p-4 text-gray-500">
                    Không tìm thấy
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
