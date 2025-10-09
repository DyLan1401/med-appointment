import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function InvoicePayment() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const newAppointment = state?.newAppointment;

    const remaining =
        (newAppointment?.total || 0) - (newAppointment?.deposit || 0);

    const handleBackToList = () => {
        navigate("/datlichkham", {
            state: { completedAppointment: { ...newAppointment, status: "Sắp diễn ra" } },
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-md w-full max-w-2xl p-6">
                <h2 className="text-xl font-bold text-blue-600 mb-3">Thanh toán chi tiết</h2>

                <p className="text-gray-600 mb-2">
                    Tổng chi phí:{" "}
                    <b className="text-gray-800">{newAppointment?.total?.toLocaleString()}đ</b>
                </p>
                <p className="text-gray-600 mb-2">
                    Đã đặt cọc:{" "}
                    <b className="text-green-600">{newAppointment?.deposit?.toLocaleString()}đ</b>
                </p>
                <p className="text-lg text-red-600 font-semibold mb-6">
                    Còn lại cần thanh toán: {remaining.toLocaleString()}đ
                </p>

                <div className="flex gap-3">
                    <button
                        onClick={handleBackToList}
                        className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-3 rounded-lg"
                    >
                        ⏭️ Bỏ qua – Thanh toán sau
                    </button>
                    <button
                        onClick={handleBackToList}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg"
                    >
                        💸 Thanh toán ngay
                    </button>
                </div>
            </div>
        </div>
    );
}
