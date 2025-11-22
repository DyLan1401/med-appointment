import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import {
  Search,
  UserPlus,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X,
  Image as ImageIcon,
} from "lucide-react";
import { FaTrashAlt, FaPencilAlt } from "react-icons/fa";

export default function ManagerUsers() {
  const API_URL = "http://127.0.0.1:8000/api/users";

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [preview, setPreview] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    phone: "",
    insurance_info: "",
    avatar: null,
  });

  // ✅ Lấy danh sách người dùng
  const fetchUsers = async (page = 1, searchTerm = "") => {
    try {
      const res = await axios.get(`${API_URL}?page=${page}&search=${searchTerm}`);
      setUsers(res.data.data);
      setLastPage(res.data.last_page);
      setNotFound(res.data.data.length === 0);
    } catch (error) {
      toast.error("Không thể tải danh sách người dùng. Vui lòng thử lại!");
      setNotFound(true);
    }
  };

  useEffect(() => {
    fetchUsers(page, search);
  }, [page]);

  // ✅ Validate form
  const validateForm = () => {
    if (!form.name || !form.email || (!editingId && !form.password)) {
      setMessage({ type: "error", text: "Vui lòng nhập đầy đủ thông tin bắt buộc!" });
      return false;
    }
    return true;
  };

  // ✅ Thêm/Sửa người dùng
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formData = new FormData();
    for (const key in form) {
      if (form[key] !== null && form[key] !== "") {
        formData.append(key, form[key]);
      }
    }

    try {
      if (editingId) {
        await axios.post(`${API_URL}/${editingId}?_method=PUT`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setMessage({ type: "success", text: "Cập nhật người dùng thành công!" });
      } else {
        await axios.post(API_URL, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setMessage({ type: "success", text: "Thêm người dùng mới thành công!" });
      }

      setShowForm(false);
      setEditingId(null);
      resetForm();
      fetchUsers(page, search);
    } catch (error) {
      toast.error(error.response?.data?.message || "Có lỗi xảy ra khi lưu người dùng! Vui lòng kiểm tra lại.");
      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Có lỗi xảy ra khi lưu người dùng! Vui lòng kiểm tra lại.",
      });
    }
  };

  // ✅ Reset form
  const resetForm = () => {
    setForm({
      name: "",
      email: "",
      password: "",
      role: "user",
      phone: "",
      insurance_info: "",
      avatar: null,
    });
    setPreview(null);
  };

  // ✅ Khi nhấn nút sửa
  const handleEdit = (u) => {
    setEditingId(u.id);
    setForm({
      name: u.name,
      email: u.email,
      password: "",
      role: u.role,
      phone: u.phone || "",
      insurance_info: u.insurance_info || "",
      avatar: null,
    });
    setPreview(u.avatar_url || null);
    setShowForm(true);
  };

  // ✅ Khi nhấn nút xóa
  const handleDelete = (u) => setConfirmDelete(u);

  const confirmDeleteAction = async () => {
    if (!confirmDelete) return;
    try {
      await axios.delete(`${API_URL}/${confirmDelete.id}`);
      setMessage({
        type: "success",
        text: `Đã xóa người dùng "${confirmDelete.name}" thành công!`,
      });
      fetchUsers(page, search);
    } catch {
      setMessage({
        type: "error",
        text: "Không thể xóa người dùng, vui lòng thử lại!",
      });
    }
    setConfirmDelete(null);
  };

  const handleSearch = async () => {
    setPage(1);
    await fetchUsers(1, search);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "avatar") {
      const file = files[0];
      setForm({ ...form, avatar: file });
      if (file) setPreview(URL.createObjectURL(file));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <h1 className="text-2xl font-bold text-blue-700 mb-2">Quản lý người dùng</h1>

      {/* Thông báo */}
      {message && (
        <div
          className={`mb-4 px-4 py-3 rounded-lg ${message.type === "success"
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
            }`}
        >
          {message.text}
        </div>
      )}

      {/* Tìm kiếm */}
      <div className="flex justify-between items-center py-2">
        <div className="flex justify-center items-center gap-2">
          <input
            type="search"
            placeholder="Nhập tên hoặc email người dùng..."
            className="border p-2 rounded-lg w-full bg-white shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            onClick={handleSearch}
            className="flex items-center gap-1 bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 transition"
          >
            <Search size={24} />
          </button>
        </div>
        <button
          onClick={() => {
            setEditingId(null);
            resetForm();
            setShowForm(true);
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Thêm người dùng
        </button>
      </div>

      {/* ✅ Bảng danh sách người dùng */}
      <table className="w-full text-sm text-center text-gray-700">
        <thead className="uppercase text-white bg-blue-600">
          <tr>
            <th className="px-4 py-3">STT</th>
            <th className="px-4 py-3">Ảnh</th>
            <th className="px-4 py-3">Tên</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Vai trò</th>
            <th className="px-4 py-3">SĐT</th>
            <th className="px-4 py-3">BHYT</th>
            <th className="px-4 py-3">Tạo</th>
            <th className="px-4 py-3">Cập nhật</th>
            <th className="px-4 py-3">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {notFound ? (
            <tr>
              <td colSpan="10" className="text-center py-6 text-gray-500">
                Không tìm thấy người dùng
              </td>
            </tr>
          ) : (
            users.map((u, index) => (
              <tr key={u.id} className="border-b hover:bg-gray-100">
                <td className="text-center px-3 py-2 font-medium">
                  {(page - 1) * 5 + index + 1}
                </td>
                <td className="px-3 py-2 text-center">
                  <img
                    src={u.avatar_url}
                    alt={u.name}
                    className="w-10 h-10 rounded-full mx-auto object-cover"
                    onError={(e) => (e.target.src = "/images/default-avatar.png")}
                  />
                </td>
                <td className="px-3 py-2">{u.name}</td>
                <td className="px-3 py-2">{u.email}</td>
                <td className="px-3 py-2 capitalize">
                  {u.role === "admin"
                    ? "Quản trị viên"
                    : u.role === "doctor"
                      ? "Bác sĩ"
                      : "Bệnh nhân"}
                </td>
                <td className="px-3 py-2">{u.phone || "-"}</td>
                <td className="px-3 py-2">{u.insurance_info || "-"}</td>
                <td className="px-3 py-2">
                  {new Date(u.created_at).toLocaleDateString()}
                </td>
                <td className="px-3 py-2">
                  {new Date(u.updated_at).toLocaleDateString()}
                </td>
                <td className=" space-x-3">
                  <button
                    onClick={() => handleEdit(u)}
                    className="text-green-600 hover:underline "
                  >
                    <FaPencilAlt />
                  </button>
                  <button
                    onClick={() => handleDelete(u)}
                    className="text-red-600 hover:underline "
                  >
                    <FaTrashAlt />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* ✅ Phân trang */}
      <div className="flex justify-center mt-4 gap-4">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="p-2 bg-gray-200 rounded-full disabled:opacity-50 hover:bg-gray-300"
        >
          <ChevronLeft size={20} />
        </button>
        <span className="px-3 py-1 text-gray-600 font-medium">
          Trang {page} / {lastPage}
        </span>
        <button
          disabled={page === lastPage}
          onClick={() => setPage((p) => p + 1)}
          className="p-2 bg-gray-200 rounded-full disabled:opacity-50 hover:bg-gray-300"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* ✅ Form thêm/sửa */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-40">
          <div className="bg-white p-6 rounded-xl shadow-xl w-[500px] relative">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
            >
              <X size={20} />
            </button>
            <h2 className="text-2xl font-semibold text-blue-600 mb-4">
              {editingId ? "Cập nhật người dùng" : "Thêm người dùng mới"}
            </h2>

            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <input
                name="name"
                placeholder="Tên người dùng"
                value={form.name}
                onChange={handleChange}
                className="border p-2 rounded-lg col-span-2"
                required
              />
              <input
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className="border p-2 rounded-lg col-span-2"
                required
              />
              {!editingId && (
                <input
                  name="password"
                  type="password"
                  placeholder="Mật khẩu"
                  value={form.password}
                  onChange={handleChange}
                  className="border p-2 rounded-lg col-span-2"
                  required
                />
              )}
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="border p-2 rounded-lg col-span-2"
              >
                <option value="user">Bệnh nhân</option>
                <option value="doctor">Bác sĩ</option>
                <option value="admin">Quản trị viên</option>
              </select>
              <input
                name="phone"
                placeholder="Số điện thoại"
                value={form.phone}
                onChange={handleChange}
                className="border p-2 rounded-lg col-span-2"
              />
              <textarea
                name="insurance_info"
                placeholder="Thông tin bảo hiểm"
                value={form.insurance_info}
                onChange={handleChange}
                className="border p-2 rounded-lg col-span-2"
              ></textarea>

              <div className="col-span-2 flex flex-col items-center">
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-24 h-24 rounded-full object-cover mb-2 shadow"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-2">
                    <ImageIcon size={32} className="text-gray-400" />
                  </div>
                )}
                <label className="cursor-pointer bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition">
                  Chọn ảnh
                  <input
                    type="file"
                    name="avatar"
                    accept="image/*"
                    onChange={handleChange}
                    className="hidden"
                  />
                </label>
              </div>

              <button
                type="submit"
                className={`col-span-2 ${editingId
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-green-600 hover:bg-green-700"
                  } text-white py-2 rounded-lg transition`}
              >
                {editingId ? "Lưu thay đổi" : "Thêm mới"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Xác nhận xóa */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-[400px] text-center">
            <h3 className="text-lg font-semibold mb-4">
              Bạn có chắc muốn xóa người dùng này?
            </h3>
            <p className="mb-6 text-gray-600">
              <strong>{confirmDelete.name}</strong> (ID: {confirmDelete.id})
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmDeleteAction}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
              >
                Xóa
              </button>
              <button
                onClick={() => setConfirmDelete(null)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}