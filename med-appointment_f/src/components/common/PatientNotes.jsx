import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../api/axios";

export default function PatientNotes() {
  const { id } = useParams(); // 👉 lấy id từ URL
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    if (id) {
      API.get(`/notes/${id}`)
        .then((res) => setNotes(res.data))
        .catch((err) => console.error("Lỗi khi tải ghi chú:", err));
    }
  }, [id]);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold text-blue-600 mb-6 text-center">
        📋 Ghi chú của bác sĩ dành cho bệnh nhân {id}
      </h2>

      {notes.length === 0 ? (
        <p className="text-gray-500 text-center">Chưa có ghi chú nào.</p>
      ) : (
        <ul className="space-y-4">
          {notes.map((note) => (
            <li
              key={note.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition"
            >
              <h3 className="text-lg font-semibold text-gray-700">
                {note.title}
              </h3>
              <p className="text-gray-600 mt-2">{note.content}</p>
              <div className="text-sm text-gray-400 mt-2">
                Ngày tạo: {new Date(note.created_at).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
