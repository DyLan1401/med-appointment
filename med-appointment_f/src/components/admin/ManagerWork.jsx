import React, { useState, useEffect } from "react";
import axios from "axios";
import { Pencil, Trash2 } from "lucide-react";

export default function ManagerSchedule() {
  const [schedules, setSchedules] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [editingId, setEditingId] = useState(null);

  const DOCTOR_API = "http://localhost:8000/api/doctors";
  const SCHEDULE_API = "http://localhost:8000/api/schedules";

  // Lấy danh sách bác sĩ
  const fetchDoctors = async () => {
    try {
      const res = await axios.get(DOCTOR_API);
      const data = Array.isArray(res.data) ? res.data : res.data.data || [];
      const doctorList = data.map((d) => ({
        id: d.id,
        name: d.user?.name || d.name || "Không rõ bác sĩ",
      }));
      setDoctors(doctorList);
    } catch (error) {
      console.error("Lỗi khi tải bác sĩ:", error);
      setDoctors([]);
    }
  };

  // Lấy lịch theo bác sĩ
  const fetchSchedules = async (doctorId) => {
    if (!doctorId) return setSchedules([]);
    try {
      const res = await axios.get(`${SCHEDULE_API}/getbyid/${doctorId}`);
      if (res.data.status) {
        const mappedSchedules = res.data.data.map((item) => ({
          ...item,
          date: item.date.split("T")[0],
          start_time: item.start_time.slice(0, 5),
          end_time: item.end_time.slice(0, 5),
        }));
        setSchedules(mappedSchedules);
      } else {
        setSchedules([]);
      }
    } catch (error) {
      console.error("Lỗi khi tải lịch:", error);
      setSchedules([]);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    fetchSchedules(selectedDoctor);
  }, [selectedDoctor]);

  // Thêm hoặc cập nhật lịch
  const handleAddOrUpdate = async () => {
    if (!selectedDoctor || !date || !startTime || !endTime) {
      alert("Vui lòng chọn bác sĩ, ngày và thời gian hợp lệ!");
      return;
    }

    const data = {
      doctor_id: Number(selectedDoctor),
      date,
      start_time: startTime,
      end_time: endTime,
    };

    try {
      if (editingId) {
        await axios.put(`${SCHEDULE_API}/${editingId}`, data);
        alert("✅ Cập nhật lịch thành công!");
      } else {
        await axios.post(SCHEDULE_API, data);
        alert("✅ Thêm lịch thành công!");
      }
      fetchSchedules(selectedDoctor);
      resetForm();
    } catch (error) {
      if (error.response) {
        alert(
          JSON.stringify(error.response.data.errors || error.response.data.msg)
        );
      } else {
        alert("❌ Không thể lưu lịch!");
      }
    }
  };

  // Xóa lịch
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa lịch này không?")) return;
    try {
      await axios.delete(`${SCHEDULE_API}/${id}`);
      setSchedules(schedules.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Lỗi khi xóa:", error);
    }
  };

  // Chọn để sửa
  const handleEdit = (item) => {
    setDate(item.date);
    setStartTime(item.start_time);
    setEndTime(item.end_time);
    setEditingId(item.id);
  };

  const getDoctorName = (id) => {
    const doctor = doctors.find((d) => d.id === Number(id));
    return doctor ? doctor.name : "Không rõ bác sĩ";
  };


  const resetForm = () => {
    setDate("");
    setStartTime("");
    setEndTime("");
    setEditingId(null);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-md p-6 mt-6">
      <h2 className="text-xl font-semibold text-blue-600 mb-2">
        Quản lý Lịch hẹn
      </h2>
      <p className="text-gray-500 text-sm mb-6">
        Thiết lập lịch làm việc cho bác sĩ.
      </p>

      {/* Form */}
      <div className="space-y-3 mb-6">
        <select
          value={selectedDoctor}
          onChange={(e) => setSelectedDoctor(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
        >
          <option value="">Chọn bác sĩ</option>
          {doctors.map((doc) => (
            <option key={doc.id} value={doc.id}>
              {doc.name}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
        />
        <input
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
        />
        <input
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
        />

        <button
          onClick={handleAddOrUpdate}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
        >
          {editingId ? "Cập nhật lịch" : "+ Thêm lịch"}
        </button>
      </div>

      {/* Danh sách lịch */}
      <div>
        {schedules.length === 0 ? (
          <p className="text-gray-400 text-sm italic">Chưa có lịch nào.</p>
        ) : (
          schedules.map((item) => (
            <div
              key={item.id}
              className="bg-gray-50 border border-gray-300 text-sm rounded-lg flex justify-between items-center p-2.5 mb-2"
            >
              <span>
                {getDoctorName(item.doctor_id)} — {item.date} — {item.start_time} - {item.end_time}
                {item.status && (
                  <span
                    className={`ml-2 px-2 py-0.5 text-white text-xs rounded ${item.status === "available" ? "bg-green-500" : "bg-red-500"
                      }`}
                  >
                    {item.status}
                  </span>
                )}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="text-gray-500 hover:text-blue-600 transition"
                  title="Chỉnh sửa"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-gray-500 hover:text-red-600 transition"
                  title="Xóa"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}