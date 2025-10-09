import React, { useState } from "react";

import dt2 from "../../assets/dt2.jpg";

export default function DatLichKhamNhanh() {
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [note, setNote] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log({ date, time, note });
        alert("Đặt lịch tái khám thành công!");
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <div className="w-[400px] bg-white rounded-2xl shadow-lg p-6">
                {/* Tiêu đề */}
                <h2 className="text-center text-xl font-bold text-blue-600 mb-4">
                    Đặt lịch tái khám nhanh
                </h2>

                {/* Thông tin bác sĩ */}
                <div className="flex items-center gap-3 border p-3 rounded-lg mb-5">
                    <img
                        src={dt2}
                        alt="doctor"
                        className="w-24  h-24 bg-contain rounded-full bg-blue-100 p-2"
                    />
                    <div>
                        <h3 className="text-blue-600 font-semibold">
                            Dr. Dang Thanh Phong
                        </h3>
                        <p className="text-gray-500 text-sm italic">Khoa Tai Mũi Họng</p>
                        <p className="text-gray-400 text-xs">
                            Lần khám gần nhất: 13/09/2025
                        </p>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="text-sm font-medium text-gray-700">Chọn ngày</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full border rounded-md p-2 mt-1 focus:ring-2 focus:ring-blue-400 outline-none"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700">Chọn giờ</label>
                        <select
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            className="w-full border rounded-md p-2 mt-1 focus:ring-2 focus:ring-blue-400 outline-none"
                        >
                            <option value="">-- Chọn giờ --</option>
                            <option value="09:00 AM">09:00 AM</option>
                            <option value="10:00 AM">10:00 AM</option>
                            <option value="11:00 AM">11:00 AM</option>
                        </select>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700">Ghi chú</label>
                        <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Nhập ghi chú..."
                            className="w-full border rounded-md p-2 mt-1 focus:ring-2 focus:ring-blue-400 outline-none"
                            rows="3"
                        />
                    </div>

                    {/* Nút xác nhận */}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                    >
                        Xác nhận đặt lịch
                    </button>

                    {/* Thay đổi bác sĩ */}
                    <div className="text-center mt-2">
                        <button
                            type="button"
                            className="text-blue-500 text-sm hover:underline"
                        >
                            Thay đổi bác sĩ
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
