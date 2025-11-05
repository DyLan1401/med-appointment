"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../api/axios";
import { Printer } from "lucide-react"; // 🧩 Icon in hiện đại

export default function PatientNotes() {
  const { id } = useParams(); // 👉 Lấy id bệnh nhân từ URL
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showExportMenu, setShowExportMenu] = useState(false); // 🧩 Trạng thái menu xuất file

  // 🧩 Lấy danh sách ghi chú khi component được load
  useEffect(() => {
    if (id) {
      API.get(`/notes/${id}`)
        .then((res) => setNotes(res.data))
        .catch((err) => {
          console.error("❌ Lỗi khi tải ghi chú:", err);
          setError("Không thể tải danh sách ghi chú. Vui lòng thử lại.");
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false); // ⛔ Nếu không có id, vẫn cho render để hiện nút In
    }
  }, [id]);

  // 🟩 Hàm "Đánh dấu đã đọc"
  const markAsRead = async (noteId) => {
    try {
      await API.put(`/notes/${noteId}/read`);
      setNotes((prev) =>
        prev.map((n) => (n.id === noteId ? { ...n, is_read: true } : n))
      );
    } catch (err) {
      console.error("❌ Lỗi đánh dấu đã đọc:", err);
      alert("Không thể đánh dấu ghi chú này. Vui lòng thử lại.");
    }
  };

  // 🟨 Hàm "In danh sách ghi chú" (xuất PDF)
  const handlePrint = async () => {
    try {
      if (!id) {
        alert("Không xác định được ID bệnh nhân để in danh sách.");
        return;
      }
      const url = `${API.defaults.baseURL}/notes/${id}/export-pdf`;
      window.open(url, "_blank");
    } catch (err) {
      console.error("❌ Lỗi khi xuất PDF:", err);
      alert("Không thể in danh sách ghi chú. Vui lòng thử lại.");
    }
  };

  // ==============================
  // 🧱 Giao diện chính
  // ==============================
  return (
    <>
      {/* ✅ Dropdown “In danh sách” hiển thị ở góc phải trên */}
      <div className="fixed top-[110px] right-6 z-[99999]">
        <div className="relative">
          <button
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="group relative flex items-center gap-2 px-5 py-2.5 rounded-xl
                       bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500
                       text-white font-semibold shadow-lg hover:shadow-2xl
                       transition-all duration-500 ease-out hover:scale-[1.06] hover:from-purple-500 hover:to-blue-500"
          >
            <Printer
              className="w-5 h-5 transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110"
            />
            <span className="tracking-wide drop-shadow-sm">
              In danh sách ghi chú
            </span>

            {/* Hiệu ứng ánh sáng chạy ngang */}
            <span
              className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 
                         bg-gradient-to-r from-white/10 to-transparent 
                         blur-sm animate-pulse transition-opacity"
            ></span>
          </button>

          {/* 🧩 Menu chọn định dạng xuất */}
          {showExportMenu && (
            <div className="absolute right-0 mt-2 bg-white shadow-lg border rounded-lg w-52 z-10">
              <button
                onClick={() => {
                  window.open(
                    `${API.defaults.baseURL}/notes/${id}/export-excel`,
                    "_blank"
                  );
                  setShowExportMenu(false);
                }}
                className="flex items-center w-full gap-2 px-3 py-2 hover:bg-gray-100 text-green-600 font-medium"
              >
                📗 Xuất file Excel (.xlsx)
              </button>
              <button
                onClick={() => {
                  window.open(
                    `${API.defaults.baseURL}/notes/${id}/export-pdf`,
                    "_blank"
                  );
                  setShowExportMenu(false);
                }}
                className="flex items-center w-full gap-2 px-3 py-2 hover:bg-gray-100 text-red-600 font-medium"
              >
                📕 Xuất file PDF (.pdf)
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 🧱 Nội dung chính */}
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md mt-10 min-h-[300px]">
        {/* 🏷️ Tiêu đề */}
        <h2 className="text-2xl font-semibold text-blue-600 mb-6 text-center">
          📋 Ghi chú của bác sĩ dành cho bệnh nhân
        </h2>

        {/* ⚠️ Thông báo lỗi */}
        {error && (
          <p className="text-red-500 text-center font-medium mb-4">{error}</p>
        )}

        {/* ⏳ Trạng thái loading */}
        {loading ? (
          <p className="text-gray-500 text-center animate-pulse">
            Đang tải ghi chú...
          </p>
        ) : notes.length === 0 ? (
          <p className="text-gray-500 text-center">Chưa có ghi chú nào.</p>
        ) : (
          <ul className="space-y-4">
            {notes.map((note) => (
              <li
                key={note.id}
                className={`border rounded-lg p-4 shadow-sm transition duration-200 ${
                  note.is_read
                    ? "bg-gray-100 border-gray-200"
                    : "bg-white border-gray-300"
                }`}
              >
                <h3 className="text-lg font-semibold text-gray-800">
                  {note.title}
                </h3>
                <p className="text-gray-600 mt-2 leading-relaxed">
                  {note.content}
                </p>

                <div className="text-sm text-gray-500 mt-3 flex justify-between items-center">
                  <span>
                    Ngày tạo:{" "}
                    {new Date(note.created_at).toLocaleString("vi-VN", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </span>

                  {/* 🟩 Nút đánh dấu đã đọc */}
                  {!note.is_read && (
                    <button
                      onClick={() => markAsRead(note.id)}
                      className="text-blue-600 hover:underline text-sm font-medium"
                    >
                      Đánh dấu đã đọc
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* ✅ Footer trang */}
        <footer className="mt-10 text-center text-gray-500 text-sm border-t pt-4">
          © {new Date().getFullYear()} Hệ thống quản lý bệnh nhân — Tất cả
          quyền được bảo lưu.
        </footer>
      </div>
    </>
  );
}