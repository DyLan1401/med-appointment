import React, { useState } from "react";
import { CheckCircle, XCircle, Printer } from "lucide-react";

export default function ManagerLichHen() {
    const [appointments, setAppointments] = useState([
        {
            id: 1,
            name: "Phạm Minh Hiếu",
            service: "Khám Tổng quát",
            time: "16/09/2025 lúc 14h chiều",
            status: "ĐANG CHỜ XÁC NHẬN",
            note: "",
        },
        {
            id: 2,
            name: "Trần Thị Trúc Giang",
            service: "Khám Tổng quát",
            time: "23/09/2025 lúc 10h sáng",
            status: "ĐÃ XÁC NHẬN",
            note: "Đã xác nhận lịch hẹn này.",
        },
        {
            id: 3,
            name: "Trần Thị Thu Hiền",
            service: "Khám Tai Mũi Họng",
            time: "14/09/2025 lúc 11h sáng",
            status: "ĐÃ TỪ CHỐI",
            note: "Đã từ chối lịch hẹn này.",
        },
    ]);

    // Hàm cập nhật trạng thái
    const updateStatus = (id, newStatus) => {
        setAppointments((prev) =>
            prev.map((item) =>
                item.id === id
                    ? {
                        ...item,
                        status: newStatus,
                        note:
                            newStatus === "ĐÃ XÁC NHẬN"
                                ? "Đã xác nhận lịch hẹn này."
                                : "Đã từ chối lịch hẹn này.",
                    }
                    : item
            )
        );
    };

    // Hàm in danh sách
    const handlePrint = () => window.print();

    // Render màu theo trạng thái
    const statusColor = (status) => {
        if (status === "ĐANG CHỜ XÁC NHẬN") return "bg-yellow-100 text-yellow-700";
        if (status === "ĐÃ XÁC NHẬN") return "bg-green-100 text-green-700";
        if (status === "ĐÃ TỪ CHỐI") return "bg-red-100 text-red-700";
        return "";
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-5">
                <div className="flex justify-between items-center border-b pb-3 mb-4">
                    <div className="flex flex-col gap-y-5">
                        <h2 className="text-3xl font-bold text-blue-600">Quản lý Lịch hẹn</h2>
                        <p className="text-gray-500 text-sm">
                            Duyệt và xác nhận các cuộc hẹn từ bệnh nhân.
                        </p>
                    </div>
                    <button
                        onClick={handlePrint}
                        className="flex items-center gap-2 bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
                    >
                        <Printer size={18} /> In danh sách
                    </button>
                </div>

                {/* Danh sách lịch hẹn */}
                <div className="flex flex-col gap-4">
                    {appointments.map((apt) => (
                        <div
                            key={apt.id}
                            className="border rounded-lg p-4 flex flex-col gap-2 bg-gray-50 shadow-sm"
                        >
                            <p>
                                <strong>Bệnh nhân:</strong> {apt.name}
                            </p>
                            <p>
                                <strong>Dịch vụ:</strong> {apt.service}
                            </p>
                            <p>
                                <strong>Thời gian:</strong> {apt.time}
                            </p>
                            <p className="flex items-center gap-2 mt-1">
                                <strong>Trạng thái:</strong>{" "}
                                <span
                                    className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColor(
                                        apt.status
                                    )}`}
                                >
                                    {apt.status}
                                </span>
                            </p>

                            <div className="mt-2  text-sm text-gray-600">
                                <strong>Ghi chú:</strong> {apt.note || "—"}
                            </div>

                            {/* Nút hành động */}
                            {apt.status === "ĐANG CHỜ XÁC NHẬN" && (
                                <div className="flex justify-end gap-3 mt-4">
                                    <button
                                        onClick={() => updateStatus(apt.id, "ĐÃ XÁC NHẬN")}
                                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
                                    >
                                        <CheckCircle size={18} /> Xác nhận
                                    </button>
                                    <button
                                        onClick={() => updateStatus(apt.id, "ĐÃ TỪ CHỐI")}
                                        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
                                    >
                                        <XCircle size={18} /> Từ chối
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
