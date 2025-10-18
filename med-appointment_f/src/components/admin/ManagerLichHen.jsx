import React, { useState, useEffect } from "react";
import axios from "axios";
import { CheckCircle, XCircle, Printer } from "lucide-react";

export default function ManagerLichHen() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
            alert("Không tìm thấy lịch hẹn trong danh sách.");
            return;
        }

        const res = await axios.put(`http://127.0.0.1:8000/api/appointments/${id}`, {
            status: newStatus,
            updated_at: appointment.updated_at,
        });

        // ✅ Nếu backend trả về message thì hiển thị alert
        if (res.data?.message) {
            alert(res.data.message);
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
        console.error(error);

        // ✅ Nếu backend trả về lỗi có message
        if (error.response?.data?.message) {
            alert(error.response.data.message);
        } else {
            alert("Cập nhật trạng thái thất bại!");
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

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-5">
                {/* Header */}
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
                                                onClick={() => updateStatus(apt.id, "completed")}
                                                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
                                            >
                                                <CheckCircle size={18} /> Xác nhận
                                            </button>
                                            <button
                                                onClick={() => updateStatus(apt.id, "cancelled")}
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
        </div>
    );
}
