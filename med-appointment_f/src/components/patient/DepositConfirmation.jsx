import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function DepositConfirmation() {
    const [timeLeft, setTimeLeft] = useState(5 * 60);
    const [selected, setSelected] = useState(null);
    const navigate = useNavigate();
    const { state } = useLocation();

    const newAppointment = state?.newAppointment;

    const appointment = JSON.parse(localStorage.getItem("pendingAppointment"));

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const handleConfirmDeposit = () => {
        navigate("/invoice", { state: { newAppointment } });
    };

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-100 p-4">
            <div className="bg-white shadow-xl rounded-xl p-6 w-full max-w-lg">
                <h2 className="text-xl font-semibold text-blue-600 mb-4">
                    Xác nhận đặt cọc
                </h2>
                <p className="mb-4 text-gray-600">
                    Vui lòng hoàn tất đặt cọc để giữ lịch của bạn.
                </p>

                <p className="font-medium text-gray-700 mb-2">
                    Bác sĩ: <span className="text-blue-700">{appointment?.doctor}</span>
                </p>
                <p className="font-medium text-gray-700 mb-2">
                    Thời gian: {appointment?.date} – {appointment?.time}
                </p>

                <p className="text-red-600 font-bold text-lg mb-4">
                    💰 Số tiền đặt cọc: 500.000 VND
                </p>

                <button
                    onClick={handleConfirmDeposit}
                    disabled={!selected}
                    className={`w-full py-3 rounded-lg font-semibold text-white ${selected ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-300"
                        }`}
                >
                    🔒 Xác nhận đặt cọc
                </button>
                <div className="mt-2 text-center text-gray-400 text-sm">
                    Thời gian còn lại: {minutes}:{seconds.toString().padStart(2, "0")}
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4">
                    <button
                        onClick={() => setSelected("momo")}
                        className={`border rounded-lg py-2 font-medium ${selected === "momo" ? "border-pink-500 bg-pink-50" : ""
                            }`}
                    >
                        Momo
                    </button>
                    <button
                        onClick={() => setSelected("vnpay")}
                        className={`border rounded-lg py-2 font-medium ${selected === "vnpay" ? "border-blue-500 bg-blue-50" : ""
                            }`}
                    >
                        VNPay
                    </button>
                </div>
            </div>
        </div>
    );
}
