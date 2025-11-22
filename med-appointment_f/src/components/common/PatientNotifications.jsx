import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Bell, CheckCircle, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom"; // 🧩 Thêm dòng này

export default function PagePatientNotifications() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🧩 Lấy id từ URL (ví dụ: /notifications/:id)
  const { id: idFromUrl } = useParams();

  // 👉 Lấy thông tin bệnh nhân (ưu tiên user login, sau đó URL, rồi localStorage)
  const user = JSON.parse(localStorage.getItem("user"));
  const patientId =
    (user && user.id) || idFromUrl || localStorage.getItem("patient_id_temp");

  // 🧠 Lấy danh sách ghi chú
  useEffect(() => {
    if (!patientId) {
      setLoading(false);
      return;
    }

    axios
      .get(`http://localhost:8000/api/notes/${patientId}`)
      .then((res) => {
        setNotes(res.data);
        setLoading(false);
      })
      .catch((err) => {
        toast.error("Không thể tải thông báo. Vui lòng thử lại!");
        setLoading(false);
      });
  }, [patientId]);

  // ✅ Đánh dấu ghi chú đã đọc
  const markAsRead = async (noteId) => {
    try {
      await axios.put(`http://localhost:8000/api/notes/${noteId}/read`);
      setNotes((prev) =>
        prev.map((n) => (n.id === noteId ? { ...n, is_read: true } : n))
      );
      toast.success("Đã đánh dấu đã đọc!");
    } catch (err) {
      toast.error("Không thể đánh dấu đã đọc. Vui lòng thử lại!");
    }
  };

  // ⏳ Loading
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Đang tải thông báo...
      </div>
    );
  }

  // ⚠️ Nếu chưa có patient_id
  if (!patientId) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-600">
        <Bell className="w-10 h-10 mb-3 text-blue-500" />
        <p>Bạn chưa có thông tin bệnh nhân để xem thông báo.</p>
        <p className="text-sm text-gray-400 mt-1">
          (Vui lòng đăng nhập hoặc lưu <code>patient_id_temp</code> vào
          localStorage)
        </p>
      </div>
    );
  }

  // 💌 Giao diện hiển thị thông báo
  return (
    <div className="max-w-3xl mx-auto mt-24 bg-white shadow-md rounded-lg p-6">
      <div className="flex items-center mb-4 gap-2">
        <Bell className="text-blue-600" />
        <h2 className="text-2xl font-bold text-blue-600">
          Thông báo từ hệ thống
        </h2>
      </div>

      {notes.length === 0 ? (
        <p className="text-gray-500 text-center py-6">
          Không có thông báo nào.
        </p>
      ) : (
        <div className="space-y-4">
          {notes.map((note, index) => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`p-4 rounded-lg border ${
                note.is_read ? "bg-gray-50" : "bg-blue-50"
              }`}
            >
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-800">
                  {note.title || "Ghi chú từ bác sĩ"}
                </h3>
                {note.is_read ? (
                  <CheckCircle className="text-green-500 w-5 h-5" />
                ) : (
                  <Clock className="text-yellow-500 w-5 h-5" />
                )}
              </div>

              <p className="text-gray-700 mt-1">{note.content}</p>

              <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
                <span>{new Date(note.created_at).toLocaleString()}</span>
                {!note.is_read && (
                  <button
                    onClick={() => markAsRead(note.id)}
                    className="text-blue-600 hover:underline"
                  >
                    Đánh dấu đã đọc
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}