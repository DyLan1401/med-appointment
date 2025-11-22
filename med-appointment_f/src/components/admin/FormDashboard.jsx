import React, { useEffect, useState } from "react";
import axios from "axios";

export default function FormDashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const res = await axios.get("http://localhost:8000/api/dashboard");
                if (res.data.status) {
                    setData(res.data.data);
                } else {
                    setError(res.data.msg || "Không thể tải dữ liệu");
                }
            } catch (err) {
                setError("Lỗi kết nối đến server!");
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();
    }, []);

    if (loading) return <div className="p-6 text-gray-600">Đang tải dữ liệu...</div>;
    if (error) return <div className="p-6 text-red-500">❌ {error}</div>;

    const stats = [
        {
            label: "Tổng bệnh nhân",
            value: data.total_patients,
            icon: "👤",
            color: "bg-blue-100 text-blue-600",
        },
        {
            label: "Lịch hẹn đang chờ",
            value: data.pending_appointments,
            icon: "📅",
            color: "bg-green-100 text-green-600",
        },
        {
            label: "Đã xác nhận / Hoàn thành",
            value: data.confirmed_appointments,
            icon: "✅",
            color: "bg-purple-100 text-purple-600",
        },
    ];

    return (
        <div className="p-6">
            {/* --- Tiêu đề --- */}
            <h2 className="text-2xl font-bold text-blue-700 mb-2">Bảng Điều Khiển Tổng Quan</h2>

            {/* --- Tổng quan --- */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {stats.map((item, index) => (
                    <div
                        key={index}
                        className="flex items-center justify-between bg-white p-5 rounded-2xl shadow hover:shadow-lg transition"
                    >
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-full ${item.color} text-xl`}>{item.icon}</div>
                            <div>
                                <p className="text-gray-500 text-sm">{item.label}</p>
                                <p className="text-xl font-semibold">{item.value?.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* --- Lịch hẹn & Phản hồi --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Lịch hẹn gần đây */}
                <div className="bg-white p-6 rounded-2xl shadow">
                    <h3 className="text-lg font-semibold text-blue-600 mb-4 border-b pb-2">Lịch hẹn gần đây</h3>
                    <ul className="space-y-3">
                        {data.recent_appointments?.map((item, index) => (
                            <li key={index} className="border-b pb-2">
                                <p className="font-medium">{item.service_name}</p>
                                <p className="text-sm text-gray-500">{item.doctor_name}</p>
                                <p className="text-sm text-gray-400">
                                    🕒 {item.appointment_date} — Trạng thái:{" "}
                                    <span className="font-medium">{item.status}</span>
                                </p>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Phản hồi mới nhất */}
                <div className="bg-white p-6 rounded-2xl shadow">
                    <h3 className="text-lg font-semibold text-blue-600 mb-4 border-b pb-2">Phản hồi mới nhất</h3>
                    <ul className="space-y-4">
                        {data.feedbacks?.map((fb, index) => (
                            <li key={index}>
                                <div className="flex gap-1 text-yellow-400 mb-1">
                                    {Array.from({ length: fb.rating }).map((_, i) => (
                                        <span key={i}>★</span>
                                    ))}
                                </div>
                                <p className="text-gray-700 italic">"{fb.comment}"</p>
                                <p className="text-sm text-gray-500 mt-1">- {fb.patient_name}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
