"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Search,
  UserPlus,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X,
  CheckCircle2,
  Info,
  Clock,
} from "lucide-react";
import { LuNotebookPen } from "react-icons/lu";
import { FaTrashAlt, FaPencilAlt } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

export default function ManagerPatient() {
  const [patients, setPatients] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    date_of_birth: "",
    gender: "",
    address: "",
    health_insurance: "",
    google_id: "",
    facebook_id: "",
  });
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  // 🟩 Ghi chú
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [noteStatus, setNoteStatus] = useState("");

  const API_URL = "http://localhost:8000/api/patients";

  /* ----------------- 🧩 Fetch danh sách bệnh nhân ----------------- */
  const fetchPatients = async (page = 1, searchTerm = "") => {
    try {
      const res = await axios.get(`${API_URL}?page=${page}&search=${searchTerm}`);
      setPatients(res.data.data);
      setLastPage(res.data.last_page);
      setNotFound(res.data.data.length === 0);
    } catch (error) {
      setNotFound(true);
      toast.error("❌ Lỗi khi tải danh sách bệnh nhân!");
    }
  };

  useEffect(() => {
    fetchPatients(page);
  }, [page]);

  /* ----------------- 🧩 Kiểm tra form trước khi gửi ----------------- */
  const validateForm = () => {
    if (!form.name || !form.email || !form.phone || !form.gender || !form.address) {
      toast.warning("⚠️ Vui lòng nhập đầy đủ thông tin trước khi lưu!");
      return false;
    }
    return true;
  };

  /* ----------------- 🧩 Thêm / Sửa bệnh nhân ----------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, form);
        toast.success("✅ Cập nhật bệnh nhân thành công!");
      } else {
        await axios.post(API_URL, form);
        toast.success("🩺 Thêm bệnh nhân thành công!");
      }
      setForm({
        name: "",
        email: "",
        phone: "",
        date_of_birth: "",
        gender: "",
        address: "",
        health_insurance: "",
        google_id: "",
        facebook_id: "",
      });
      setEditingId(null);
      setShowForm(false);
      fetchPatients(page, search);
    } catch (error) {
      toast.error(error.response?.data?.message || "❌ Có lỗi xảy ra khi lưu dữ liệu!");
    }
  };

  /* ----------------- 🧩 Xóa bệnh nhân ----------------- */
  const confirmDeleteAction = async () => {
    if (!confirmDelete) return;

    try {
      // Gửi yêu cầu xóa
      const res = await axios.delete(`${API_URL}/${confirmDelete.id}`);

      // ✅ Nếu backend trả message => hiển thị
      toast.success(res.data.message || "🗑️ Xóa bệnh nhân thành công!", {
        position: "top-right",
        autoClose: 2000,
      });

      // 🧹 Cập nhật danh sách mà không cần reload trang
      setPatients((prev) => prev.filter((p) => p.id !== confirmDelete.id));

    } catch (error) {
      const msg =
        error.response?.data?.message ||
        "❌ Không thể xóa bệnh nhân! Vui lòng thử lại.";
      toast.error(msg, { position: "top-right", autoClose: 2500 });
    }

    // 🔒 Đóng popup
    setConfirmDelete(null);
  };

  /* ----------------- 🧩 Sửa bệnh nhân ----------------- */
  const handleEdit = (p) => {
    setEditingId(p.id);
    setForm({
      name: p.user.name,
      email: p.user.email,
      phone: p.user.phone,
      date_of_birth: p.date_of_birth || "",
      gender: p.gender || "",
      address: p.address || "",
      health_insurance: p.health_insurance || "",
      google_id: p.google_id || "",
      facebook_id: p.facebook_id || "",
    });
    setShowForm(true);
  };

  /* ----------------- 🧩 Tìm kiếm ----------------- */
  const handleSearch = () => fetchPatients(1, search);

  /* ----------------- 🟩 Ghi chú ----------------- */
  const handleSendNote = (p) => {
    setSelectedPatient(p);
    setNoteTitle("");
    setNoteContent("");
    setNoteStatus("");
    setShowNoteModal(true);
    fetchNotes(p.id);
  };

  const sendNote = async () => {
    if (!noteContent.trim()) {
      toast.warning("⚠️ Nội dung ghi chú không được để trống!");
      return;
    }

    setNoteStatus("⏳ Đang gửi ghi chú...");
    try {
      await axios.post("http://localhost:8000/api/notes", {
        patient_id: selectedPatient.id,
        title: noteTitle || "Ghi chú từ hệ thống",
        content: noteContent,
      });
      toast.success("✅ Gửi ghi chú thành công!");
      fetchNotes(selectedPatient.id);
      setNoteTitle("");
      setNoteContent("");
    } catch (error) {
      toast.error(error.response?.data?.message || "❌ Gửi ghi chú thất bại!");
    }
  };

  const fetchNotes = async (patientId) => {
    try {
      const res = await axios.get(`http://localhost:8000/api/notes/${patientId}`);
      setSelectedPatient((prev) => ({
        ...prev,
        notes: res.data,
      }));
    } catch (err) {
      toast.error("⚠️ Lỗi khi tải ghi chú!");
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!window.confirm("Xác nhận xóa ghi chú này?")) return;
    try {
      await axios.delete(`http://localhost:8000/api/notes/${noteId}`);
      toast.success("🗑️ Đã xóa ghi chú!");
      fetchNotes(selectedPatient.id);
    } catch (err) {
      toast.error("❌ Lỗi khi xóa ghi chú!");
    }
  };

  /* ----------------- 🧩 Hiển thị popup xác nhận xóa ----------------- */
  const handleDelete = (p) => {
    setConfirmDelete(p);
  };

  /* =============================================================== */
  return (
    <div className=" p-6">
      {/* 🟦 Tiêu đề */}
      <h1 className="text-2xl font-bold text-blue-700 mb-2">
        Quản lý bệnh nhân
      </h1>
      {/* 🔍 Thanh tìm kiếm */}
      <div className="flex justify-between items-center py-2">
        <div className="flex justify-center items-center gap-2">
          <input
            type="search"
            placeholder="Nhập tên bệnh nhân..."
            className="border p-2 rounded-lg w-full bg-white shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button
            onClick={handleSearch}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition shadow-md"
          >
            <Search size={24} />
          </button>
        </div>
        <button
          onClick={() => {
            setEditingId(null);
            setForm({
              name: "",
              email: "",
              phone: "",
              date_of_birth: "",
              gender: "",
              address: "",
              health_insurance: "",
              google_id: "",
              facebook_id: "",
            });
            setShowForm(true);
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition shadow-md"
        >
          Thêm bệnh nhân
        </button>
      </div>

      {/* 📋 Bảng danh sách bệnh nhân */}
      <table className="w-full text-sm text-center text-gray-700">
        <thead className="uppercase text-white bg-blue-600">
          <tr>
            <th className="px-4 py-3">ID</th>
            <th className="px-4 py-3">Tên</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">SĐT</th>
            <th className="px-4 py-3">Giới tính</th>
            <th className="px-4 py-3">Ngày sinh</th>
            <th className="px-4 py-3">Địa chỉ</th>
            <th className="px-4 py-3">Bảo hiểm</th>
            <th className="px-4 py-3">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {notFound ? (
            <tr>
              <td colSpan="9" className="text-center py-6 text-gray-500">
                Không tìm thấy
              </td>
            </tr>
          ) : (
            patients.map((p) => (
              <tr key={p.id} className="border-b hover:bg-gray-100 transition">
                <td className="px-4 py-3">{p.id}</td>
                <td className="px-4 py-3">{p.user.name}</td>
                <td className="px-4 py-3">{p.user.email}</td>
                <td className="px-4 py-3">{p.user.phone}</td>
                <td className="px-4 py-3 capitalize">{p.gender || "-"}</td>
                <td className="px-4 py-3">{p.date_of_birth || "-"}</td>
                <td className="px-4 py-3">{p.address || "-"}</td>
                <td className="px-4 py-3">{p.health_insurance || "-"}</td>
                <td className="space-x-2">
                  <button
                    onClick={() => handleEdit(p)}
                    className="text-green-600 hover:underline "
                  >
                    <FaPencilAlt />
                  </button>
                  <button
                    onClick={() => handleDelete(p)}
                    className="text-red-600 hover:underline "
                  >
                    <FaTrashAlt />
                  </button>
                  <button
                    onClick={() => handleSendNote(p)}
                    className="text-yellow-600 hover:underline "
                  >
                    <LuNotebookPen />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* 🧭 Phân trang */}
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

      {/* 🟢 Modal Form Thêm / Sửa */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-40"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white p-6 rounded-xl shadow-xl w-[500px] relative"
            >
              <button
                onClick={() => setShowForm(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
              >
                <X size={20} />
              </button>
              <h2 className="text-2xl font-semibold text-blue-600 mb-4">
                {editingId ? "Cập nhật thông tin bệnh nhân" : "Thêm bệnh nhân mới"}
              </h2>

              <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                <input
                  placeholder="Họ và tên"
                  className="border p-2 rounded-lg col-span-2"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
                <input
                  placeholder="Email"
                  className="border p-2 rounded-lg col-span-2"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
                <input
                  placeholder="Số điện thoại"
                  className="border p-2 rounded-lg"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  required
                />
                <input
                  type="date"
                  className="border p-2 rounded-lg"
                  value={form.date_of_birth}
                  onChange={(e) =>
                    setForm({ ...form, date_of_birth: e.target.value })
                  }
                />
                <select
                  className="border p-2 rounded-lg"
                  value={form.gender}
                  onChange={(e) => setForm({ ...form, gender: e.target.value })}
                  required
                >
                  <option value="">Giới tính</option>
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                  <option value="other">Khác</option>
                </select>
                <input
                  placeholder="Địa chỉ"
                  className="border p-2 rounded-lg col-span-2"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  required
                />
                <input
                  placeholder="Bảo hiểm y tế"
                  className="border p-2 rounded-lg col-span-2"
                  value={form.health_insurance}
                  onChange={(e) =>
                    setForm({ ...form, health_insurance: e.target.value })
                  }
                />
                <input
                  placeholder="Google ID"
                  className="border p-2 rounded-lg"
                  value={form.google_id}
                  onChange={(e) => setForm({ ...form, google_id: e.target.value })}
                />
                <input
                  placeholder="Facebook ID"
                  className="border p-2 rounded-lg"
                  value={form.facebook_id}
                  onChange={(e) =>
                    setForm({ ...form, facebook_id: e.target.value })
                  }
                />
                <button
                  type="submit"
                  className={`col-span-2 ${editingId
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-blue-600 hover:bg-blue-700"
                    } text-white py-2 rounded-lg transition`}
                >
                  {editingId ? "Lưu thay đổi" : "Thêm mới"}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🔴 Popup xác nhận xóa */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-[400px] text-center">
            <h3 className="text-lg font-semibold mb-4">
              Bạn có chắc muốn xóa bệnh nhân
            </h3>
            <p className="mb-6 text-gray-600">
              <strong>{confirmDelete.user.name}</strong> (ID: {confirmDelete.id})
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

      {/* 🟩 Modal ghi chú */}
      <AnimatePresence>
        {showNoteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white p-6 rounded-xl shadow-xl w-[600px] max-h-[90vh] overflow-y-auto relative"
            >
              {/* Nút đóng */}
              <button
                onClick={() => setShowNoteModal(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
              >
                <X size={20} />
              </button>

              {/* Tiêu đề */}
              <h2 className="text-2xl font-semibold text-blue-600 mb-2 text-center">
                🩺 Ghi chú cho bệnh nhân:{" "}
                <span className="text-gray-800">{selectedPatient?.user?.name}</span>
              </h2>
              <p className="text-sm text-gray-500 text-center mb-4">
                (ID: {selectedPatient?.id})
              </p>

              {/* Form ghi chú */}
              <div className="space-y-3 mb-6">
                <input
                  type="text"
                  placeholder="Tiêu đề (tùy chọn)"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  className="w-full border rounded-lg p-2"
                />
                <textarea
                  rows="4"
                  placeholder="Nội dung ghi chú..."
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  className="w-full border rounded-lg p-2"
                ></textarea>
                <button
                  onClick={sendNote}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Gửi ghi chú
                </button>
                {noteStatus && (
                  <p className="text-center text-gray-500 text-sm mt-2">
                    {noteStatus}
                  </p>
                )}
              </div>

              {/* Danh sách ghi chú */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-3">
                  📋 Danh sách ghi chú gần đây
                </h3>
                {selectedPatient?.notes?.length ? (
                  <ul className="space-y-4">
                    {selectedPatient.notes.map((note) => (
                      <li
                        key={note.id}
                        className={`border rounded-lg p-4 shadow-sm ${note.is_read ? "bg-gray-100" : "bg-white"
                          }`}
                      >
                        <h4 className="text-lg font-semibold text-gray-700 flex items-center justify-between">
                          <span>{note.title}</span>
                          {!note.is_read && (
                            <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-md">
                              Chưa đọc
                            </span>
                          )}
                        </h4>
                        <p className="text-gray-600 mt-1">{note.content}</p>
                        <div className="text-sm text-gray-400 mt-2 flex justify-between items-center">
                          <span>
                            <Clock size={14} className="inline mr-1" />
                            {new Date(note.created_at).toLocaleString()}
                          </span>
                          <button
                            onClick={() => handleDeleteNote(note.id)}
                            className="text-red-600 hover:underline flex items-center gap-1"
                          >
                            <FaTrashAlt />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-center">Chưa có ghi chú nào.</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}