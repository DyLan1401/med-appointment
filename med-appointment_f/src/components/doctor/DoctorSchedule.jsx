"use client";
import { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";
import axios from "axios";

export default function DoctorSchedule() {
  const [view, setView] = useState("week"); // week | month
  const [weekOffset, setWeekOffset] = useState(0);
  const [monthOffset, setMonthOffset] = useState(0);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [doctorId, setDoctorId] = useState(null);
  const [daysInMonth, setDaysInMonth] = useState([]);

  const API_URL = "http://localhost:8000/api/schedules/getbyid/";
  const daysOfWeek = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"];

  // Lấy doctor_id từ localStorage
  useEffect(() => {
    const id = localStorage.getItem("doctor_id");
    if (id) setDoctorId(id);
  }, []);

  // Chuẩn hóa ngày: chỉ giữ năm-tháng-ngày
  const normalizeDate = (dateString) => {
    const d = new Date(dateString);
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  };

  // Lấy lịch từ API
  const fetchSchedules = async () => {
    if (!doctorId) return;

    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}${doctorId}`);
      if (res.data.status && Array.isArray(res.data.data)) {
        const converted = res.data.data.map((item) => ({
          ...item,
          dateObj: normalizeDate(item.date),
        }));
        setSchedules(converted);
      } else {
        setSchedules([]);
      }
    } catch (err) {
      console.error("❌ Lỗi fetchSchedules:", err);
      setSchedules([]);
    } finally {
      setLoading(false);
    }
  };

  // Range tuần
  const getWeekRange = (offset = weekOffset) => {
    const today = new Date();
    const monday = new Date(today);
    const currentDay = monday.getDay();
    const diffToMonday = currentDay === 0 ? -6 : 1 - currentDay;
    monday.setDate(today.getDate() + diffToMonday + offset * 7);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    const f = (d) =>
      `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
    return `${f(monday)} - ${f(sunday)}`;
  };

  // Range tháng
  const getMonthRange = (offset = monthOffset) => {
    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth() + offset, 1);
    const end = new Date(today.getFullYear(), today.getMonth() + offset + 1, 0);
    const f = (d) =>
      `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
    return `${f(start)} - ${f(end)}`;
  };

  // Tính danh sách ngày của tháng
  const getDaysInMonth = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + monthOffset;
    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);
    const days = [];
    for (let d = new Date(first); d <= last; d.setDate(d.getDate() + 1)) {
      days.push(new Date(d));
    }
    return days;
  };

  // Cập nhật daysInMonth khi view = month hoặc monthOffset thay đổi
  useEffect(() => {
    if (view === "month") {
      setDaysInMonth(getDaysInMonth());
    }
  }, [view, monthOffset]);

  // Reload lịch khi doctorId, tuần hoặc tháng thay đổi
  useEffect(() => {
    if (doctorId) fetchSchedules();
  }, [doctorId, weekOffset, monthOffset]);

  // Lọc lịch theo tuần/tháng
  const filteredSchedules = schedules.filter((item) => {
    const scheduleDay = item.dateObj.toDateString();
    const today = new Date();

    if (view === "week") {
      const monday = new Date(today);
      const currentDay = monday.getDay();
      const diffToMonday = currentDay === 0 ? -6 : 1 - currentDay;
      monday.setDate(today.getDate() + diffToMonday + weekOffset * 7);
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      const mondayStr = monday.toDateString();
      const sundayStr = sunday.toDateString();
      return scheduleDay >= mondayStr && scheduleDay <= sundayStr;
    }

    // month
    const first = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
    const last = new Date(today.getFullYear(), today.getMonth() + monthOffset + 1, 0);
    const firstStr = first.toDateString();
    const lastStr = last.toDateString();
    return scheduleDay >= firstStr && scheduleDay <= lastStr;
  });

  return (
    <div className="max-w-6xl mx-auto mt-10 bg-white shadow-md rounded-2xl p-6">
      {/* HEADER */}
      <div className="flex flex-col mb-6">
        <h2 className="text-2xl font-semibold text-blue-600 mb-3">Lịch làm việc của tôi</h2>
        <p>Xem lịch theo tuần hoặc tháng</p>

        <div className="flex items-center justify-between gap-4 mt-4">
          {/* Chọn tuần/tháng */}
          <div className="flex items-center gap-3 text-gray-600">
            <label className="font-medium text-gray-700">{view === "week" ? "Chọn tuần:" : "Chọn tháng:"}</label>

            {view === "week" ? (
              <select
                value={weekOffset}
                onChange={(e) => setWeekOffset(Number(e.target.value))}
                className="border rounded-lg px-3 py-1"
              >
                <option value={-1}>Tuần trước ({getWeekRange(-1)})</option>
                <option value={0}>Tuần này ({getWeekRange(0)})</option>
                <option value={1}>Tuần tới ({getWeekRange(1)})</option>
              </select>
            ) : (
              <select
                value={monthOffset}
                onChange={(e) => setMonthOffset(Number(e.target.value))}
                className="border rounded-lg px-3 py-1"
              >
                <option value={-1}>Tháng trước ({getMonthRange(-1)})</option>
                <option value={0}>Tháng này ({getMonthRange(0)})</option>
                <option value={1}>Tháng tới ({getMonthRange(1)})</option>
              </select>
            )}

            <button
              onClick={fetchSchedules}
              className="ml-3 text-sm text-gray-500 hover:text-blue-600 flex items-center gap-1"
            >
              <RefreshCw className="w-4 h-4" /> Làm mới
            </button>
          </div>

          {/* Nút đổi chế độ */}
          <div className="flex border rounded-lg overflow-hidden">
            <button
              onClick={() => setView("week")}
              className={`px-4 py-1 ${view === "week" ? "bg-blue-500 text-white" : "hover:bg-gray-100"}`}
            >
              Tuần
            </button>
            <button
              onClick={() => setView("month")}
              className={`px-4 py-1 ${view === "month" ? "bg-blue-500 text-white" : "hover:bg-gray-100"}`}
            >
              Tháng
            </button>
          </div>
        </div>
      </div>

      {/* BẢNG LỊCH */}
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100 text-center">
              <th className="border p-2 w-20">Thời gian</th>
              {view === "week"
                ? daysOfWeek.map((day, i) => (
                    <th key={i} className="border p-2">{day}</th>
                  ))
                : daysInMonth.map((d, i) => (
                    <th key={i} className="border p-2">{d.getDate()}/{d.getMonth() + 1}</th>
                  ))}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="text-center text-gray-500 p-4">Đang tải...</td>
              </tr>
            ) : (
              [8, 9, 10, 11, 12, 13, 14, 15].map((hour) => (
                <tr key={hour} className="text-center h-16">
                  <td className="border p-2 text-gray-500 font-medium">{hour}:00</td>

                  {(view === "week" ? daysOfWeek : daysInMonth).map((_, i) => {
                    let match;

                    if (view === "week") {
                      const today = new Date();
                      const monday = new Date(today);
                      const currentDay = monday.getDay();
                      const diffToMonday = currentDay === 0 ? -6 : 1 - currentDay;
                      monday.setDate(today.getDate() + diffToMonday + weekOffset * 7);
                      const day = new Date(monday);
                      day.setDate(monday.getDate() + i);
                      match = filteredSchedules.find(
                        (item) =>
                          item.dateObj.toDateString() === day.toDateString() &&
                          item.start_time.startsWith(String(hour).padStart(2, "0"))
                      );
                    } else {
                      const day = daysInMonth[i];
                      match = filteredSchedules.find(
                        (item) =>
                          item.dateObj.toDateString() === day.toDateString() &&
                          item.start_time.startsWith(String(hour).padStart(2, "0"))
                      );
                    }

                    return (
                      <td
                        key={i}
                        className="border p-2 hover:bg-blue-50 cursor-pointer"
                        onClick={() => match && setSelectedSchedule(match)}
                      >
                        {match ? (
                          <span
                            className={`${
                              match.status === "available"
                                ? "bg-green-500"
                                : match.status === "unavailable"
                                ? "bg-red-500"
                                : "bg-gray-400"
                            } text-white px-3 py-1 rounded-lg text-sm`}
                          >
                            {match.status}
                          </span>
                        ) : (
                          ""
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Chi tiết lịch */}
        {selectedSchedule && (
          <div className="mt-4 p-4 bg-blue-50 border rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold text-blue-600 mb-2">Chi tiết lịch làm việc</h3>
            <p><strong>Ngày:</strong> {selectedSchedule.date}</p>
            <p><strong>Bắt đầu:</strong> {selectedSchedule.start_time}</p>
            <p><strong>Kết thúc:</strong> {selectedSchedule.end_time}</p>
            <p><strong>Trạng thái:</strong> {selectedSchedule.status}</p>

            <button
              onClick={() => setSelectedSchedule(null)}
              className="mt-3 px-3 py-1 bg-blue-500 text-white rounded-lg"
            >
              Đóng
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
