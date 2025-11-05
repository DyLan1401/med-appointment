import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function DatLichKham() {
    const [doctorList, setDoctorList] = useState([]);
    const [doctor, setDoctor] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [note, setNote] = useState("");
    const [selectedService, setSelectedService] = useState(null);

    const navigate = useNavigate();
    const timeList = ["08:00 AM", "09:00 AM", "10:00 AM", "13:00 PM", "15:00 PM"];

    // ✅ Lấy danh sách bác sĩ thật từ API
    useEffect(() => {
        axios.get("http://localhost:8000/api/doctors/list")
            .then(res => setDoctorList(res.data))
            .catch(err => console.error("Lỗi khi tải bác sĩ:", err));
    }, []);

    // ✅ Lấy gói dịch vụ từ localStorage
    useEffect(() => {
        const serviceData = localStorage.getItem("selectedService");
        if (serviceData) {
            setSelectedService(JSON.parse(serviceData));
        } else {
            alert("⚠️ Vui lòng chọn 1 gói dịch vụ trước khi đặt lịch!");
            navigate("/formservice");
        }
    }, [navigate]);

    // ✅ Khi nhấn Đặt lịch
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
            service: selectedService,
            total: selectedService?.price || 0,
            deposit: Math.round((selectedService?.price || 0) * 0.1),
        };

        navigate("/deposit", { state: { newAppointment } });
    };

    return (
        <div className="w-full min-h-screen bg-gray-50 p-6">
            <div className="bg-white shadow-md rounded-xl p-6 max-w-3xl mx-auto">
                <h2 className="text-2xl font-semibold text-blue-600 mb-4 text-center">
                    Đặt lịch khám
                </h2>

                {selectedService && (
                    <div className="border border-blue-300 bg-blue-50 p-4 rounded-lg mb-6">
                        <h3 className="text-xl font-semibold text-blue-700">
                            Gói dịch vụ đã chọn:
                        </h3>
                        <p className="mt-2 text-gray-800 font-medium">
                            {selectedService.name}
                        </p>
                        <p className="text-gray-600 text-sm">
                            {selectedService.description}
                        </p>
                        <p className="mt-2 font-semibold text-gray-900">
                            Giá: {Number(selectedService.price).toLocaleString()} VND
                        </p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                        <label className="block mb-1 text-gray-700">Chọn bác sĩ</label>
                        <select
                            value={doctor}
                            onChange={(e) => setDoctor(e.target.value)}
                            className="w-full border rounded-lg p-2"
                        >
                            <option value="">-- Chọn bác sĩ --</option>
                            {doctorList.map((d) => (
                                <option key={d.id} value={d.name}>
                                    {d.name}
                                </option>
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
