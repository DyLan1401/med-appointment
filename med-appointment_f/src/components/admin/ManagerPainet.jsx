// ✅ FILE: AdminNoteSend.jsx hoặc ManagerPatient.jsx
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
} from "lucide-react";

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
  const [message, setMessage] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  // 🟩 Thêm state cho gửi ghi chú
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);

  // 🟢 Hiển thị trạng thái gửi ghi chú
  const [noteStatus, setNoteStatus] = useState("");

  const API_URL = "http://localhost:8000/api/patients";

  const fetchPatients = async (page = 1, searchTerm = "") => {
    try {
      const res = await axios.get(`${API_URL}?page=${page}&search=${searchTerm}`);
      setPatients(res.data.data);
      setLastPage(res.data.last_page);
      setNotFound(res.data.data.length === 0);
    } catch (error) {
      console.error("Error fetching patients:", error);
      setNotFound(true);
    }
  };

  useEffect(() => {
    fetchPatients(page);
  }, [page]);

  const validateForm = () => {
    if (!form.name || !form.email || !form.phone || !form.gender || !form.address) {
      setMessage({
        type: "error",
        text: "Vui lòng nhập đầy đủ thông tin trước khi lưu!",
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, form);
        setMessage({ type: "success", text: "Cập nhật bệnh nhân thành công!" });
      } else {
        await axios.post(API_URL, form);
        setMessage({ type: "success", text: "Thêm bệnh nhân thành công!" });
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
      console.error("Error saving patient:", error);
      setMessage({
        type: "error",
        text: "Có lỗi xảy ra khi lưu dữ liệu, vui lòng thử lại!",
      });
    }
  };

  const handleDelete = (patient) => {
    setConfirmDelete(patient);
  };

  const confirmDeleteAction = async () => {
    if (!confirmDelete) return;
    try {
      await axios.delete(`${API_URL}/${confirmDelete.id}`);
      setMessage({
        type: "success",
        text: `Đã xóa bệnh nhân "${confirmDelete.user.name}" (ID: ${confirmDelete.id})`,
      });
      fetchPatients(page, search);
    } catch (error) {
      console.error("Error deleting patient:", error);
      setMessage({
        type: "error",
        text: "Không thể xóa bệnh nhân, vui lòng thử lại!",
      });
    }
    setConfirmDelete(null);
  };

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

  const handleSearch = () => {
    fetchPatients(1, search);
  };

  // 🟩 Mở modal ghi chú
  const handleSendNote = (p) => {
    setSelectedPatient(p);
    setNoteTitle("");
    setNoteContent("");
    setNoteStatus("");
    setShowNoteModal(true);
  };

  // 🟩 Gửi ghi chú
  const sendNote = async () => {
    if (!noteContent.trim()) {
      setNoteStatus("⚠️ Nội dung ghi chú không được để trống!");
      return;
    }

    setNoteStatus("⏳ Đang gửi ghi chú...");
    try {
      await axios.post("http://localhost:8000/api/notes", {
        patient_id: selectedPatient.id,
        title: noteTitle || "Ghi chú từ hệ thống",
        content: noteContent,
      });

      setNoteStatus("✅ Gửi ghi chú thành công!");
      setTimeout(() => {
        setShowNoteModal(false);
        setNoteStatus("");
      }, 1500);
    } catch (error) {
      console.error(error);
      setNoteStatus("❌ Gửi ghi chú thất bại! Vui lòng thử lại.");
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 p-6">
      {/* 🟦 Tiêu đề */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-blue-600 text-3xl font-bold">Quản lý bệnh nhân</h1>
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
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition"
        >
          <UserPlus size={18} /> Thêm bệnh nhân
        </button>
      </div>

      {/* 🟢 Hiển thị message */}
      {message && (
        <div
          className={`mb-4 px-4 py-3 rounded-lg ${
            message.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* 🧭 Thanh tìm kiếm */}
      <div className="flex items-center gap-2 mb-4">
        <input
          type="search"
          placeholder="Nhập tên bệnh nhân..."
          className="border p-2 rounded-lg w-1/3 bg-white shadow-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="flex items-center gap-1 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition"
        >
          <Search size={18} /> Tìm kiếm
        </button>
      </div>

      {/* 🧾 Bảng danh sách bệnh nhân */}
      <div className="overflow-x-auto shadow-md rounded-lg bg-white">
        <table className="w-full text-sm text-gray-700">
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
                <tr key={p.id} className="border-b hover:bg-gray-100">
                  <td className="px-4 py-3">{p.id}</td>
                  <td className="px-4 py-3">{p.user.name}</td>
                  <td className="px-4 py-3">{p.user.email}</td>
                  <td className="px-4 py-3">{p.user.phone}</td>
                  <td className="px-4 py-3 capitalize">{p.gender || "-"}</td>
                  <td className="px-4 py-3">{p.date_of_birth || "-"}</td>
                  <td className="px-4 py-3">{p.address || "-"}</td>
                  <td className="px-4 py-3">{p.health_insurance || "-"}</td>
                  <td className="px-4 py-3 space-x-3">
                    <button
                      onClick={() => handleEdit(p)}
                      className="text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <Edit size={16} /> Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(p)}
                      className="text-red-600 hover:underline flex items-center gap-1"
                    >
                      <Trash2 size={16} /> Xóa
                    </button>
                    {/* 🟩 Nút gửi ghi chú */}
                    <button
                      onClick={() => handleSendNote(p)}
                      className="text-yellow-600 hover:underline flex items-center gap-1"
                    >
                      📋 Ghi chú
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

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

      {/* 🟩 Modal gửi ghi chú */}
      {showNoteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-[450px] relative">
            <button
              onClick={() => setShowNoteModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
            >
              <X size={20} />
            </button>
            <h2 className="text-2xl font-semibold text-blue-600 mb-4">
              Gửi ghi chú cho {selectedPatient?.user?.name}
            </h2>
            <input
              placeholder="Tiêu đề ghi chú (tuỳ chọn)"
              className="border w-full p-2 rounded-lg mb-3"
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
            />
            <textarea
              placeholder="Nhập nội dung ghi chú..."
              className="border w-full h-40 p-2 rounded-lg mb-4"
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
            />
            <button
              onClick={sendNote}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg w-full"
            >
              Gửi đi
            </button>

            {/* 🟢 Trạng thái gửi */}
            {noteStatus && (
              <p
                className={`mt-3 text-sm text-center ${
                  noteStatus.includes("✅")
                    ? "text-green-600"
                    : noteStatus.includes("❌")
                    ? "text-red-600"
                    : "text-blue-600"
                }`}
              >
                {noteStatus}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}