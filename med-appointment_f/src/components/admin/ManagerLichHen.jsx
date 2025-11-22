import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { CheckCircle, XCircle, Printer, FileSpreadsheet, FileText } from "lucide-react";


export default function ManagerLichHen() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showMenu, setShowMenu] = useState(false);
    // Fetch dữ liệu ban đầu
    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = () => {
        setLoading(true);
        axios
            .get("http://127.0.0.1:8000/api/appointments")
            .then((res) => {
                setAppointments(res.data.data || []);
                setLoading(false);
            })
            .catch(() => {
                setError("Không thể tải dữ liệu từ server");
                setLoading(false);
            });
    };

    // PUT cập nhật trạng thái thật ở backend
    const updateStatus = async (id, newStatus) => {
        try {
            // 🔹 Lấy appointment hiện tại trong state
            const appointment = appointments.find((a) => a.id === id);
            if (!appointment) {
                toast.warning("Không tìm thấy lịch hẹn trong danh sách.");
                return;
            }

            const res = await axios.put(`http://127.0.0.1:8000/api/appointments/${id}`, {
                status: newStatus,
                updated_at: appointment.updated_at,
            });

            // ✅ Nếu backend trả về message thì hiển thị toast
            if (res.data?.message) {
                toast.success(res.data.message);
            }

            // ✅ Cập nhật lại frontend
            setAppointments((prev) =>
                prev.map((item) =>
                    item.id === id
                        ? {
                            ...item,
                            status: newStatus,
                            notes:
                                newStatus === "completed"
                                    ? "Đã xác nhận lịch hẹn này."
                                    : "Đã từ chối lịch hẹn này.",
                        }
                        : item
                )
            );
        } catch (error) {
            // ✅ Nếu backend trả về lỗi có message
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Cập nhật trạng thái thất bại!");
            }
        }
    };


    const handlePrint = () => window.print();

    const statusColor = (status) => {
        switch (status) {
            case "pending":
                return "bg-yellow-100 text-yellow-700";
            case "confirmed":
                return "bg-green-100 text-green-700";
            case "cancelled":
            case "rejected":
                return "bg-red-100 text-red-700";
            case "completed":
                return "bg-blue-100 text-blue-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    const leftAppointments = appointments.filter(
        (a) => a.status === "pending" || a.status === "cancelled" || a.status === "rejected"
    );
    const rightAppointments = appointments.filter(
        (a) => a.status === "confirmed" || a.status === "completed"
    );

    if (loading) return <p className="text-center text-gray-500">Đang tải dữ liệu...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;

    const handleDownload = (type) => {
        const url =
            type === "xlsx"
                ? "http://127.0.0.1:8000/api/export-completed/xlsx"
                : "http://127.0.0.1:8000/api/export-completed/pdf";

        // Mở link trong tab mới hoặc tải trực tiếp
        window.open(url, "_blank");
        setShowMenu(false);
    };

    return (
        <div className=" p-6">

            {/* Header */}
            <div className="flex justify-between items-center border-b pb-3 mb-4">
                <div className="flex flex-col gap-y-5">
                    <h2 className="text-2xl font-bold text-blue-700 mb-2">Quản lý Lịch hẹn</h2>
                    <p className="text-gray-500 text-sm">
                        Duyệt và xác nhận các cuộc hẹn từ bệnh nhân.
                    </p>
                </div>
                {/* Nút in có menu */}
                <div className="relative">
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        className="flex items-center gap-2 bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
                    >
                        <Printer size={18} /> In danh sách
                    </button>

                    {showMenu && (
                        <div className="absolute right-0 mt-2 bg-white border shadow-md rounded-lg w-48 z-10">
                            <button
                                onClick={() => handleDownload("xlsx")}
                                className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100 transition"
                            >
                                <FileSpreadsheet size={18} className="text-green-600" />
                                Xuất Excel (.xlsx)
                            </button>
                            <button
                                onClick={() => handleDownload("pdf")}
                                className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100 transition"
                            >
                                <FileText size={18} className="text-red-600" />
                                Xuất PDF (.pdf)
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Hai cột */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Cột bên trái */}
                <div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-3">
                        ⏳ Lịch hẹn đang chờ / bị hủy / bị từ chối
                    </h3>
                    <div className="flex flex-col gap-4 max-h-[600px] overflow-y-auto pr-2">
                        {leftAppointments.length === 0 && (
                            <p className="text-gray-400 italic">Không có lịch hẹn nào.</p>
                        )}
                        {leftAppointments.map((apt) => (
                            <div
                                key={apt.id}
                                className="border rounded-lg p-4 flex flex-col gap-2 bg-gray-50 shadow-sm"
                            >
                                <p><strong>Bệnh nhân:</strong> {apt.patient_name}</p>
                                <p><strong>Dịch vụ:</strong> {apt.service_name}</p>
                                <p><strong>Ngày hẹn:</strong> {apt.appointment_date || "Chưa có"}</p>
                                <p className="flex items-center gap-2 mt-1">
                                    <strong>Trạng thái:</strong>{" "}
                                    <span
                                        className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColor(
                                            apt.status
                                        )}`}
                                    >
                                        {apt.status.toUpperCase()}
                                    </span>
                                </p>
                                <div className="mt-2 text-sm text-gray-600">
                                    <strong>Ghi chú:</strong> {apt.notes || "—"}
                                </div>

                                {/* Nút hành động */}
                                {apt.status === "pending" && (
                                    <div className="flex justify-end gap-3 mt-4">
                                        <button
                                            onClick={() => updateStatus(apt.id, "confirmed")}
                                            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
                                        >
                                            <CheckCircle size={18} /> Xác nhận
                                        </button>
                                        <button
                                            onClick={() => updateStatus(apt.id, "rejected")}
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

                {/* Cột bên phải */}
                <div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-3">
                        ✅ Lịch hẹn đã xác nhận / hoàn tất
                    </h3>
                    <div className="flex flex-col gap-4 max-h-[600px] overflow-y-auto pr-2">
                        {rightAppointments.length === 0 && (
                            <p className="text-gray-400 italic">
                                Chưa có lịch hẹn nào được xác nhận.
                            </p>
                        )}
                        {rightAppointments.map((apt) => (
                            <div
                                key={apt.id}
                                className="border rounded-lg p-4 flex flex-col gap-2 bg-green-50 shadow-sm"
                            >
                                <p><strong>Bệnh nhân:</strong> {apt.patient_name}</p>
                                <p><strong>Dịch vụ:</strong> {apt.service_name}</p>
                                <p><strong>Ngày hẹn:</strong> {apt.appointment_date || "Chưa có"}</p>
                                <p className="flex items-center gap-2 mt-1">
                                    <strong>Trạng thái:</strong>{" "}
                                    <span
                                        className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColor(
                                            apt.status
                                        )}`}
                                    >
                                        {apt.status.toUpperCase()}
                                    </span>
                                </p>
                                <div className="mt-2 text-sm text-gray-600">
                                    <strong>Ghi chú:</strong> {apt.notes || "—"}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
