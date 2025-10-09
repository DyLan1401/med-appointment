import React from "react";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";
import { RefreshCw, User2, CheckCircle, XCircle, Clock } from "lucide-react";

export default function BHYTStatistics() {
    const data = [
        { name: "Có BHYT (70.0%)", value: 70 },
        { name: "Không BHYT (30.0%)", value: 30 },
    ];
    const COLORS = ["#22c55e", "#ef4444"];

    return (
        <div className="min-h-screen bg-gray-50 flex justify-center p-6">
            <div className="bg-white w-full max-w-6xl rounded-2xl shadow-md p-6">
                {/* Header */}
                <div className="mb-4">
                    <h1 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
                        📊 Thống Kê BHYT Bệnh Nhân
                    </h1>
                    <p className="text-gray-500 text-sm">
                        Phân tích tỷ lệ bệnh nhân có và không có Bảo hiểm Y tế trong hệ thống.
                    </p>
                </div>

                {/* Bộ lọc + thời gian cập nhật */}
                <div className="flex flex-wrap justify-between items-center bg-gray-50 p-4 rounded-xl mb-6">
                    <div>
                        <label className="block text-gray-600 text-sm mb-1">Khoảng thời gian:</label>
                        <select className="border rounded-lg px-3 py-2 text-sm">
                            <option>Toàn bộ dữ liệu</option>
                            <option>Tháng này</option>
                            <option>Quý này</option>
                            <option>Năm nay</option>
                        </select>
                    </div>

                    <div className="text-right">
                        <p className="text-gray-600 text-sm">Cập nhật lần cuối:</p>
                        <div className="flex items-center justify-end gap-2 mt-1">
                            <span className="text-gray-800 font-medium text-sm">
                                04/10/2025 - 16:00
                            </span>
                            <button className="flex items-center gap-1 text-blue-600 hover:underline text-sm">
                                <RefreshCw size={16} /> Làm mới
                            </button>
                        </div>
                    </div>
                </div>

                {/* Thẻ thống kê */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
                    {/* Tổng bệnh nhân */}
                    <div className="bg-white border rounded-xl p-5 shadow-sm flex justify-between items-center">
                        <div>
                            <p className="text-gray-500 text-sm">TỔNG SỐ BỆNH NHÂN</p>
                            <p className="text-3xl font-semibold text-gray-800 mt-1">1.250</p>
                        </div>
                        <User2 className="text-blue-500" size={32} />
                    </div>

                    {/* Có BHYT */}
                    <div className="bg-white border rounded-xl p-5 shadow-sm flex justify-between items-center">
                        <div>
                            <p className="text-gray-500 text-sm">BỆNH NHÂN CÓ BHYT</p>
                            <p className="text-3xl font-semibold text-green-600 mt-1">875</p>
                            <p className="text-xs text-green-500">70.0%</p>
                        </div>
                        <CheckCircle className="text-green-500" size={32} />
                    </div>

                    {/* Không BHYT */}
                    <div className="bg-white border rounded-xl p-5 shadow-sm flex justify-between items-center">
                        <div>
                            <p className="text-gray-500 text-sm">BỆNH NHÂN KHÔNG BHYT</p>
                            <p className="text-3xl font-semibold text-red-600 mt-1">375</p>
                            <p className="text-xs text-red-500">30.0%</p>
                        </div>
                        <XCircle className="text-red-500" size={32} />
                    </div>
                </div>

                {/* Biểu đồ + Phân tích */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Biểu đồ tròn */}
                    <div className="col-span-2 bg-white border rounded-xl p-5 shadow-sm">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">
                            Biểu đồ Tỷ lệ Phân bố BHYT
                        </h2>
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie
                                    data={data}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    innerRadius={60}
                                    outerRadius={90}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Phân tích */}
                    <div className="bg-white border rounded-xl p-5 shadow-sm">
                        <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-1 mb-2">
                            <Clock size={14} /> Bệnh nhân mới nhất
                        </h3>
                        <ul className="space-y-2 text-sm">
                            <li className="flex justify-between">
                                <span>Lê Thị B (Có BHYT)</span>
                                <span className="text-blue-500">Vừa đăng ký</span>
                            </li>
                            <li className="flex justify-between">
                                <span>Trần Văn C (Không BHYT)</span>
                                <span className="text-gray-400">2 ngày trước</span>
                            </li>
                            <li className="flex justify-between">
                                <span>Phạm D (Có BHYT)</span>
                                <span className="text-gray-400">3 ngày trước</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
