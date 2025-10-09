import React from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

export default function AppointmentStats() {
    const data = [
        { name: "Thứ 2", value: 35 },
        { name: "Thứ 3", value: 45 },
        { name: "Thứ 4", value: 60 },
        { name: "Thứ 5", value: 55 },
        { name: "Thứ 6", value: 65 },
        { name: "Thứ 7", value: 45 },
        { name: "Chủ nhật", value: 25 },
    ];

    const stats = [
        {
            label: "Lịch đã hoàn thành",
            value: 1250,
            color: "bg-blue-100 text-blue-600",
            icon: "📅",
        },
        {
            label: "Tổng số bệnh nhân",
            value: 850,
            color: "bg-green-100 text-green-600",
            icon: "👤",
        },
    ];

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="bg-white p-6 rounded-2xl shadow">
                {/* Tiêu đề */}
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-blue-700">
                        Thống kê Lịch khám
                    </h2>
                    <p className="text-gray-500 mt-1">
                        Tổng quan về các hoạt động khám bệnh gần đây.
                    </p>
                </div>

                {/* Hai ô thống kê */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                    {stats.map((item, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between bg-gray-50 p-4 rounded-xl shadow-sm border hover:shadow-md transition"
                        >
                            <div className="flex items-center gap-4">
                                <div
                                    className={`p-3 rounded-full ${item.color} text-2xl`}
                                >
                                    {item.icon}
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm">{item.label}</p>
                                    <p className="text-xl font-semibold">
                                        {item.value.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Biểu đồ */}
                <div className="bg-gray-50 p-5 rounded-xl shadow-sm border">
                    <h3 className="text-center text-lg font-semibold text-blue-600 mb-4">
                        Thống kê Bệnh nhân theo ngày
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="value" fill="#60a5fa" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
