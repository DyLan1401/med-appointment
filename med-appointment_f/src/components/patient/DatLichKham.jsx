import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function DatLichKham() {
    const [doctor, setDoctor] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [note, setNote] = useState("");
    // const [appointments, setAppointments] = useState([]);
    const navigate = useNavigate();

    const doctorList = ["BS. Nguyễn Văn A", "BS. Trần Thị B", "BS. Lê Văn C"];
    const timeList = ["08:00 AM", "09:00 AM", "10:00 AM", "13:00 PM", "15:00 PM"];

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!doctor || !date || !time) {
            alert("Vui lòng nhập đủ thông tin!");
            return;
        }

        const newAppointment = {
            id: "#APT" + (Math.floor(Math.random() * 900) + 100),
            doctor,
            date,
            time,
            note,
            status: "Đang chờ đặt cọc",
            total: 5000000, // giả sử gói khám 5tr
            deposit: 500000, // đặt cọc 500k
        };

        // chuyến hướng sang trang đặt cọc, truyền data qua state
        navigate("/deposit", { state: { newAppointment } });
    };

    // const handleCancel = (id) => {
    //     setAppointments((prev) =>
    //         prev.map((apt) =>
    //             apt.id === id ? { ...apt, status: "Đã hủy" } : apt
    //         )
    //     );
    // };

    return (
        <div className="w-full h-screen bg-gray-50 p-6">
            <div className="bg-white shadow-md rounded-xl p-6">
                <h2 className="text-2xl font-semibold text-blue-600 mb-4">Đặt lịch khám</h2>

                <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                        <label className="block mb-1 text-gray-700">Chọn bác sĩ</label>
                        <select
                            value={doctor}
                            onChange={(e) => setDoctor(e.target.value)}
                            className="w-full border rounded-lg p-2"
                        >
                            <option value="">-- Chọn bác sĩ --</option>
                            {doctorList.map((d, i) => (
                                <option key={i}>{d}</option>
                            ))}
                        </select>

                        <label className="block mt-4 mb-1 text-gray-700">Chọn giờ</label>
                        <select
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            className="w-full border rounded-lg p-2"
                        >
                            <option value="">-- Chọn giờ --</option>
                            {timeList.map((t, i) => (
                                <option key={i}>{t}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block mb-1 text-gray-700">Chọn ngày</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full border rounded-lg p-2"
                        />

                        <label className="block mt-4 mb-1 text-gray-700">Ghi chú</label>
                        <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            className="w-full border rounded-lg p-2"
                            placeholder="Ghi chú thêm..."
                        />
                    </div>

                    <div className="col-span-2 mt-2">
                        <button
                            type="submit"
                            className="bg-green-600 hover:bg-green-700 text-white w-full py-3 rounded-lg font-semibold"
                        >
                            ✅ Đặt Lịch Hẹn
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
