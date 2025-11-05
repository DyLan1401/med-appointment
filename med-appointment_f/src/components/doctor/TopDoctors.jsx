import React, { useEffect, useState } from "react";
import API from "../../api/axios";

export default function TopDoctors() {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const res = await API.get("/doctors/top?limit=10"); // gọi API mới bạn tạo
            setDoctors(res.data);
        } catch (error) {
            console.error("Lỗi load top doctors:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p className="p-5 text-center">Đang tải...</p>;

    return (
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-md p-6 mt-8">
            <h2 className="text-xl font-semibold text-blue-600 mb-2">
                Bác sĩ được đặt nhiều nhất
            </h2>
            <p className="text-gray-500 text-sm mb-6">
                Xếp hạng các bác sĩ dựa trên số lượng lịch hẹn đã được xác nhận.
            </p>

            <table className="w-full border border-gray-200 rounded-lg overflow-hidden text-sm">
                <thead className="bg-blue-600 text-white">
                    <tr>
                        <th className="py-2 px-4 text-left w-16">Hạng</th>
                        <th className="py-2 px-4 text-left">Bác sĩ</th>
                        <th className="py-2 px-4 text-left">Chuyên khoa</th>
                        <th className="py-2 px-4 text-left">Số lượt đặt lịch</th>
                    </tr>
                </thead>
                <tbody>
                    {doctors.map((doc, idx) => (
                        <tr key={doc.doctor_id} className="border-b hover:bg-blue-50 transition">
                            <td className="py-2 px-4">
                                <div
                                    className={`w-7 h-7 flex items-center justify-center rounded-full text-white font-semibold ${
                                        idx === 0
                                            ? "bg-yellow-400"
                                            : idx === 1
                                            ? "bg-gray-400"
                                            : idx === 2
                                            ? "bg-amber-700"
                                            : "bg-blue-400"
                                    }`}
                                >
                                    {idx + 1}
                                </div>
                            </td>
                            <td className="py-2 px-4 flex items-center gap-2">
                                <img
                                    src={doc.avatar || "https://cdn-icons-png.flaticon.com/512/4140/4140048.png"}
                                    alt={doc.doctor_name}
                                    className="w-8 h-8 rounded-full border"
                                />
                                <span className="font-medium text-blue-700">
                                    {doc.doctor_name}
                                </span>
                            </td>
                            <td className="py-2 px-4">{doc.specialty || "Chưa có"}</td>
                            <td className="py-2 px-4 font-semibold text-blue-600">
                                {doc.total_appointments}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
