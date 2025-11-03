import React, { useState } from "react";
import { Loader2, CreditCard, Wallet } from "lucide-react";

export default function PaymentOptions() {
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);

  // ID mẫu
  const appointment_id = 1;


  const handlePayment = (type) => {
    setSelected(type);
    setLoading(true);

    setTimeout(() => {
      if (type === "deposit") {
        window.location.href = `http://localhost:5173/payment/deposit/${appointment_id}`;
      } else if (type === "full") {
        window.location.href = `http://localhost:5173/payment/payfull/${appointment_id}`;
      }
      setLoading(false);
      setSelected(null);
    }, 1000); // Giả lập hiệu ứng xử lý
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex justify-center items-center p-6">
      <div className="bg-white shadow-xl rounded-3xl p-8 w-full max-w-md transition-all">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          💰 Chọn hình thức thanh toán
        </h2>

        <div className="flex flex-col gap-5">
          {/* Nút Thanh toán toàn bộ */}
          <button
            disabled={loading}
            onClick={() => handlePayment("full")}
            className={`flex items-center justify-center gap-3 w-full py-4 rounded-xl font-semibold text-white shadow-md transform transition-all ${
              selected === "full"
                ? "bg-blue-700 scale-95"
                : "bg-blue-600 hover:bg-blue-700 hover:scale-105"
            }`}
          >
            {loading && selected === "full" ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <CreditCard size={22} />
            )}
            {loading && selected === "full"
              ? "Đang xử lý..."
              : "Thanh toán toàn bộ"}
          </button>

          {/* Nút Đặt cọc */}
          <button
            disabled={loading}
            onClick={() => handlePayment("deposit")}
            className={`flex items-center justify-center gap-3 w-full py-4 rounded-xl font-semibold text-white shadow-md transform transition-all ${
              selected === "deposit"
                ? "bg-amber-600 scale-95"
                : "bg-amber-500 hover:bg-amber-600 hover:scale-105"
            }`}
          >
            {loading && selected === "deposit" ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <Wallet size={22} />
            )}
            {loading && selected === "deposit"
              ? "Đang xử lý..."
              : "Đặt cọc trước"}
          </button>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Giao dịch của bạn được bảo mật tuyệt đối qua PayOS 🔒
        </p>
      </div>
    </div>
  );
}
