"use client";
import { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";
import axios from "axios";

export default function DoctorSchedule() {
    const [view, setView] = useState("week"); // 'week' hoặc 'month'
    const [weekOffset, setWeekOffset] = useState(0);
    const [monthOffset, setMonthOffset] = useState(0);
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedSchedule, setSelectedSchedule] = useState(null);

    const API_URL = "http://127.0.0.1:8000/api/schedules/getbyid/";
    const daysOfWeek = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"];

    // 🧮 Lấy dải tuần
    const getWeekRange = (offset = weekOffset) => {
        const now = new Date();
        const monday = new Date(now.setDate(now.getDate() - now.getDay() + 1 + offset * 7));
        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);
        const format = (d) => `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1)
            .toString()
            .padStart(2, "0")}/${d.getFullYear()}`;
        return `${format(monday)} - ${format(sunday)}`;
    };

    // 🧮 Lấy dải tháng
    const getMonthRange = (offset = monthOffset) => {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth() + offset, 1);
        const end = new Date(now.getFullYear(), now.getMonth() + offset + 1, 0);
        const format = (d) => `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1)
            .toString()
            .padStart(2, "0")}/${d.getFullYear()}`;
        return `${format(start)} - ${format(end)}`;
    };

    // 🧠 Gọi API
    const fetchSchedules = async () => {
        try {
            setLoading(true);
            const doctorId = 1;
            const res = await axios.get(API_URL + doctorId);
            if (res.data.status) setSchedules(res.data.data);
            else setSchedules([]);
        } catch (err) {
            console.error(err);
            setSchedules([]);
        } finally {
            setLoading(false);
        }
    };

    // 🧩 Lọc dữ liệu theo chế độ
    const filteredSchedules = schedules.filter((item) => {
        const date = new Date(item.date);
        const now = new Date();
        if (view === "week") {
            const monday = new Date(now.setDate(now.getDate() - now.getDay() + 1 + weekOffset * 7));
            const sunday = new Date(monday);
            sunday.setDate(monday.getDate() + 6);
            return date >= monday && date <= sunday;
        } else {
            const first = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);
            const last = new Date(now.getFullYear(), now.getMonth() + monthOffset + 1, 0);
            return date >= first && date <= last;
        }
    });

    // 🧮 Tạo danh sách ngày trong tháng
    const getDaysInMonth = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + monthOffset;
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const days = [];
        for (let d = firstDay; d <= lastDay; d.setDate(d.getDate() + 1)) {
            days.push(new Date(d));
        }
        return days;
    };

    useEffect(() => {
        fetchSchedules();
    }, [weekOffset, monthOffset]);

    return (
        <div className="max-w-6xl mx-auto mt-10 bg-white shadow-md rounded-2xl p-6">
            {/* Header */}
            <div className="flex flex-col mb-6">
                <h2 className="text-2xl font-semibold text-blue-600 mb-3">Lịch làm việc của tôi</h2>
                <p>Xem lịch hẹn và thời gian làm việc theo tuần hoặc tháng</p>

                <div className="flex items-center justify-between gap-4 mt-4">
                    {/* Bộ chọn chế độ */}
                    <div className="flex items-center gap-3 text-gray-600">
                        <label className="font-medium text-gray-700">
                            {view === "week" ? "Chọn tuần:" : "Chọn tháng:"}
                        </label>

                        {view === "week" ? (
                            <select
                                value={weekOffset}
                                onChange={(e) => setWeekOffset(Number(e.target.value))}
                                className="border border-gray-300 rounded-lg px-3 py-1 text-gray-700 focus:ring-2 focus:ring-blue-400"
                            >
                                <option value={-1}>Tuần trước ({getWeekRange(-1)})</option>
                                <option value={0}>Tuần hiện tại ({getWeekRange(0)})</option>
                                <option value={1}>Tuần tới ({getWeekRange(1)})</option>
                            </select>
                        ) : (
                            <select
                                value={monthOffset}
                                onChange={(e) => setMonthOffset(Number(e.target.value))}
                                className="border border-gray-300 rounded-lg px-3 py-1 text-gray-700 focus:ring-2 focus:ring-blue-400"
                            >
                                <option value={-1}>Tháng trước ({getMonthRange(-1)})</option>
                                <option value={0}>Tháng hiện tại ({getMonthRange(0)})</option>
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
                    <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                        <button
                            onClick={() => setView("week")}
                            className={`px-4 py-1 ${view === "week"
                                ? "bg-blue-500 text-white"
                                : "text-gray-600 hover:bg-gray-100"
                                }`}
                        >
                            Tuần
                        </button>
                        <button
                            onClick={() => setView("month")}
                            className={`px-4 py-1 ${view === "month"
                                ? "bg-blue-500 text-white"
                                : "text-gray-600 hover:bg-gray-100"
                                }`}
                        >
                            Tháng
                        </button>
                    </div>
                </div>
            </div>

            {/* Bảng lịch */}
            <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border border-gray-200">
                    <thead>
                        <tr className="bg-gray-100 text-gray-700 text-center">
                            <th className="border p-2 w-20">Thời gian</th>
                            {view === "week"
                                ? daysOfWeek.map((day, i) => (
                                    <th key={i} className="border p-2">{day}</th>
                                ))
                                : getDaysInMonth().map((d, i) => (
                                    <th key={i} className="border p-2 whitespace-nowrap">
                                        {`${d.getDate()}/${d.getMonth() + 1}`}
                                    </th>
                                ))}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={8} className="text-center p-4 text-gray-500">
                                    Đang tải dữ liệu...
                                </td>
                            </tr>
                        ) : (
                            [8, 9, 10, 11, 12, 13, 14, 15].map((hour) => (
                                <tr key={hour} className="text-center h-16">
                                    <td className="border p-2 text-gray-500 font-medium">{`${hour}:00`}</td>

                                    {(view === "week" ? daysOfWeek : getDaysInMonth()).map((_, i) => {
                                        let match;
                                        if (view === "week") {
                                            match = filteredSchedules.find(
                                                (item) =>
                                                    new Date(item.date).getDay() === (i + 1) % 7 &&
                                                    item.start_time.startsWith(hour.toString().padStart(2, "0"))
                                            );
                                        } else {
                                            const day = getDaysInMonth()[i];
                                            match = filteredSchedules.find(
                                                (item) =>
                                                    new Date(item.date).getDate() === day.getDate() &&
                                                    new Date(item.date).getMonth() === day.getMonth() &&
                                                    item.start_time.startsWith(hour.toString().padStart(2, "0"))
                                            );
                                        }

                                        return (
                                            <td
                                                key={i}
                                                className="border p-2 cursor-pointer hover:bg-blue-50 transition"
                                                onClick={() => match && setSelectedSchedule(match)}
                                            >
                                                {match ? (
                                                    <span
                                                        className={`${match.status === "available"
                                                            ? "bg-green-500"
                                                            : match.status === "unavailable"
                                                                ? "bg-red-500"
                                                                : "bg-gray-400"
                                                            } text-white px-3 py-1 rounded-lg text-sm shadow-sm`}
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
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl text-gray-700 shadow-sm">
                        <h3 className="text-lg font-semibold text-blue-600 mb-2">Chi tiết lịch làm việc</h3>
                        <p><strong>Ngày:</strong> {new Date(selectedSchedule.date).toLocaleDateString()}</p>
                        <p><strong>Giờ bắt đầu:</strong> {selectedSchedule.start_time}</p>
                        <p><strong>Giờ kết thúc:</strong> {selectedSchedule.end_time}</p>
                        <p><strong>Trạng thái:</strong> {selectedSchedule.status || "Không xác định"}</p>
                        <button
                            onClick={() => setSelectedSchedule(null)}
                            className="mt-3 px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        >
                            Đóng
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
