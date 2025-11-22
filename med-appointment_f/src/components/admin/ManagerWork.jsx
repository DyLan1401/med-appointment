import React, { useState } from "react";
import { FaTrashAlt, FaPencilAlt } from "react-icons/fa";

export default function ManagerWork() {
    const [freeTimes, setFreeTimes] = useState([
        { id: 1, date: "22/10/2025", time: "09:00 - 12:00" },
        { id: 2, date: "23/10/2025", time: "14:00 - 17:00" },
    ]);


    console.log(setFreeTimes)
    return (
        <div className="p-6">
            {/* Header */}
            <h2 className="text-2xl font-bold text-blue-700 mb-2">
                Quản lý Lịch làm việc
            </h2>


            <div>
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
                        Thêm lịch rảnh
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
                                <button
                                    className="text-green-600 hover:underline"
                                >
                                    <FaPencilAlt />

                                </button>
                                <button
                                    className="text-red-600 hover:underline"
                                >
                                    <FaTrashAlt />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>


        </div>
    );
}
