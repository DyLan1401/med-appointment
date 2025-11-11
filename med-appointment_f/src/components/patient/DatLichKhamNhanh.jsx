import React, { useState } from "react";
import API from "../../api/axios";
import dt2 from "../../assets/dt2.jpg";
import { useLocation, useNavigate } from "react-router-dom";

export default function DatLichKhamNhanh() {
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [note, setNote] = useState("");
    const navigate = useNavigate();

    // ✅ Lấy dữ liệu appointment được truyền từ trang trước
    const { state } = useLocation();
    const appointment = state?.appointment;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!date || !time) {
            alert("⚠️ Vui lòng chọn đầy đủ ngày và giờ tái khám!");
            return;
        }

        try {
            const dateTime = `${date} ${time}`;

            const res = await API.post(
                `/appointments/rebook/${appointment.id}`,
                {
                    appointment_date: dateTime,
                    notes: note,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            const appointmentId = res.data.appointment.id;
            navigate(`/payment/options/${appointmentId}`);
            // ✅ Hiển thị thông báo kết quả
            alert(res.data.message);

            // Xoá dữ liệu form sau khi gửi
            setDate("");
            setTime("");
            setNote("");

        } catch (error) {
            console.error("❌ Lỗi đặt lịch:", error);
            if (error.response?.data?.message) {
                alert(error.response.data.message);
            } else {
                alert("Đặt lịch thất bại, vui lòng thử lại!");
            }
        }
    };


    if (!appointment) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-gray-600">Không có dữ liệu lịch khám để tái khám.</p>
            </div>
        );
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <div className="w-[400px] bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-center text-xl font-bold text-blue-600 mb-4">
                    Đặt lịch tái khám nhanh
                </h2>

                {/* Thông tin bác sĩ và dịch vụ */}
                <div className="flex items-center gap-3 border p-3 rounded-lg mb-5">
                    <img
                        src={dt2}
                        alt="doctor"
                        className="w-24 h-24 bg-contain rounded-full bg-blue-100 p-2"
                    />
                    <div>
                        <h3 className="text-blue-600 font-semibold">
                            {appointment.doctor || "Không rõ bác sĩ"}
                        </h3>
                        <p className="text-gray-500 text-sm italic">
                            {appointment.department || "Chưa rõ chuyên khoa"}
                        </p>
                        <p className="text-gray-400 text-xs">
                            Dịch vụ: {appointment.service}
                        </p>
                    </div>
                </div>

                {/* Form chọn ngày giờ */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            Chọn ngày
                        </label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full border rounded-md p-2 mt-1 focus:ring-2 focus:ring-blue-400 outline-none"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            Chọn giờ
                        </label>
                        <select
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            className="w-full border rounded-md p-2 mt-1 focus:ring-2 focus:ring-blue-400 outline-none"
                        >
                            <option value="">-- Chọn giờ --</option>
                            <option value="09:00:00">09:00</option>
                            <option value="10:00:00">10:00</option>
                            <option value="11:00:00">11:00</option>
                            <option value="13:00:00">13:00</option>
                            <option value="14:00:00">14:00</option>
                            <option value="15:00:00">15:00</option>
                        </select>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            Ghi chú
                        </label>
                        <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Nhập ghi chú (nếu có)..."
                            className="w-full border rounded-md p-2 mt-1 focus:ring-2 focus:ring-blue-400 outline-none"
                            rows="3"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                    >
                        Xác nhận đặt lịch
                    </button>
                </form>
            </div>
        </div>
    );
}
