import React, { useState } from "react";
import { Pencil, Trash2, Check, X, Info } from "lucide-react";

export default function ManagerWork() {
    const [freeTimes, setFreeTimes] = useState([
        { id: 1, date: "22/10/2025", time: "09:00 - 12:00" },
        { id: 2, date: "23/10/2025", time: "14:00 - 17:00" },
    ]);

    const [upcoming, setUpcoming] = useState([
        {
            id: 1,
            name: "Bệnh nhân: Trần Văn B",
            date: "24/09/2025, 10:30 AM",
            reason: "Khám tổng quát, yêu cầu nội soi phẫu thuật",
            status: "pending",
        },
        {
            id: 2,
            name: "Bệnh nhân: Lê Thị D",
            date: "24/09/2025, 02:00 PM",
            reason: "Cập nhật đơn thuốc định kỳ",
            status: "waiting",
        },
    ]);
    console.log(setFreeTimes)
    console.log(setUpcoming)
    return (
        <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-md p-6 mt-6">
            <h2 className="text-xl font-semibold text-blue-600 mb-2">
                Quản lý Lịch làm việc
            </h2>
            <p className="text-gray-500 text-sm mb-6">
                Thiết lập thời gian rảnh, cập nhật và xem các cuộc hẹn sắp tới.
            </p>

            <div className="grid md:grid-cols-2 gap-8">
                {/* --- Quản lý lịch rảnh --- */}
                <div>
                    <h3 className="font-medium text-blue-600 mb-3">Quản lý Lịch rảnh</h3>
                    <div className="space-y-3">
                        <input
                            type="date"
                            className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                        />
                        <input
                            type="time"
                            placeholder="Giờ bắt đầu"
                            className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                        />
                        <input
                            type="time"
                            placeholder="Giờ kết thúc"
                            className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                        />
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm">
                            + Thêm lịch rảnh
                        </button>
                    </div>

                    <div className="mt-5">
                        <p className="font-medium text-gray-700 mb-2">Lịch rảnh đã thêm</p>
                        {freeTimes.map((item) => (
                            <div
                                key={item.id}
                                className="flex justify-between items-center border p-2 rounded-lg mb-2 text-sm"
                            >
                                <span>
                                    {item.date} - {item.time}
                                </span>
                                <div className="flex gap-2">
                                    <button className="text-gray-500 hover:text-blue-600">
                                        <Pencil size={16} />
                                    </button>
                                    <button className="text-gray-500 hover:text-red-600">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* --- Lịch hẹn sắp tới --- */}
                <div>
                    <h3 className="font-medium text-blue-600 mb-3">Lịch hẹn sắp tới</h3>

                    <div className="space-y-3">
                        {upcoming.map((item) => (
                            <div
                                key={item.id}
                                className="border rounded-xl p-4 text-sm flex flex-col gap-1 bg-gray-50"
                            >
                                <div className="flex justify-between items-center">
                                    <p className="font-semibold text-blue-700">{item.name}</p>
                                    {item.status === "pending" ? (
                                        <button className="bg-blue-500 text-white text-xs px-3 py-1 rounded-md flex items-center gap-1">
                                            <Info size={14} /> Chi tiết
                                        </button>
                                    ) : (
                                        <div className="flex gap-2">
                                            <button className="bg-green-500 text-white text-xs px-3 py-1 rounded-md flex items-center gap-1">
                                                <Check size={14} /> Xác nhận
                                            </button>
                                            <button className="bg-red-500 text-white text-xs px-3 py-1 rounded-md flex items-center gap-1">
                                                <X size={14} /> Hủy
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <p className="text-gray-500">{item.date}</p>
                                <p className="text-gray-600 text-xs">{item.reason}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
