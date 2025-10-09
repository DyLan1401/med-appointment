"use client";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function DoctorSchedule() {
    const [view, setView] = useState("week");

    const schedule = [
        { day: "Thứ 3", time: "09:00", status: "Khám định kỳ", color: "bg-blue-500" },
        { day: "Thứ 4", time: "13:00", status: "Tư vấn trực tuyến", color: "bg-yellow-400" },
        { day: "Thứ 5", time: "08:00", status: "Ca làm việc", color: "bg-green-500" },
    ];

    const days = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"];

    return (
        <div className="max-w-5xl mx-auto mt-10 bg-white shadow-md rounded-2xl p-6">
            {/* Header */}
            <div className="flex flex-col   mb-6">
                <div>
                    <h2 className="text-2xl font-semibold text-blue-600 mb-3 md:mb-0">
                        Lịch làm việc của tôi
                    </h2>
                    <p>xem lịch hẹn và thời gian làm việc theo tuần hoặc tháng</p>
                </div>
                <div className="flex items-center justify-between gap-4">
                    <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                        <button
                            onClick={() => setView("week")}
                            className={`px-4 py-1 ${view === "week" ? "bg-blue-500 text-white" : "text-gray-600 hover:bg-gray-100"}`}
                        >
                            Tuần
                        </button>
                        <button
                            onClick={() => setView("month")}
                            className={`px-4 py-1 ${view === "month" ? "bg-blue-500 text-white" : "text-gray-600 hover:bg-gray-100"}`}
                        >
                            Tháng
                        </button>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600">
                        <ChevronLeft className="cursor-pointer hover:text-blue-500" />
                        <span>Tháng 9, 2025</span>
                        <ChevronRight className="cursor-pointer hover:text-blue-500" />
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border border-gray-200">
                    <thead>
                        <tr className="bg-gray-100 text-gray-700 text-center">
                            <th className="border p-2 w-20">Thời gian</th>
                            {days.map((day, i) => (
                                <th key={i} className="border p-2">
                                    {day}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {/* 8h - 16h */}
                        {[8, 9, 10, 11, 12, 13, 14, 15].map((hour) => (
                            <tr key={hour} className="text-center h-16">
                                <td className="border p-2 text-gray-500 font-medium">{`${hour}:00`}</td>
                                {days.map((day, i) => {
                                    const match = schedule.find(
                                        (item) => item.day === day && item.time === `${hour}:00`
                                    );
                                    return (
                                        <td key={i} className="border p-2">
                                            {match ? (
                                                <span
                                                    className={`${match.color} text-white px-3 py-1 rounded-lg text-sm shadow-sm`}
                                                >
                                                    {match.status}
                                                </span>
                                            ) : (
                                                ""
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
