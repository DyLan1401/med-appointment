import React, { useState, useEffect } from "react";
import axios from "axios";
import { Loader2, Wallet, User, Stethoscope, Activity } from "lucide-react";
import { useParams } from "react-router-dom"; // ✅ thêm dòng này

export default function DepositPage() {
  const { appointmentId } = useParams(); // ✅ lấy id từ URL
  const [loading, setLoading] = useState(false);
  const [appointment, setAppointment] = useState(null);
  const [depositAmount, setDepositAmount] = useState(0);

  // Lấy dữ liệu cuộc hẹn
  useEffect(() => {
    const fetchAppointment = async () => {
      if (!appointmentId) return; // ✅ tránh lỗi undefined
      try {
        const res = await axios.get(`http://localhost:8000/api/appointments/show/${appointmentId}`);
        setAppointment(res.data.data);
        const deposit = res.data.data.service.price * 0.2;
        setDepositAmount(deposit);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      }
    };
    fetchAppointment();
  }, [appointmentId]);

  // Gửi yêu cầu tạo hóa đơn đặt cọc
  const handleDeposit = async () => {
    setLoading(true);
    try {
      const payload = {
        appointment_id: appointment.id,
        patient_id: appointment.patient.id,
        doctor_id: appointment.doctor.id,
        amount: depositAmount,
        type: "deposit",
      };
      const res = await axios.post("http://localhost:8000/api/invoices", payload);
      alert("✅ Đặt cọc thành công!");
      console.log(res.data);
    } catch (error) {
      console.error(error);
      alert("❌ Không thể tạo hóa đơn!");
    } finally {
      setLoading(false);
    }
  };

  if (!appointment) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <Loader2 className="animate-spin w-8 h-8 text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-amber-50 flex items-center justify-center p-6">
      <div className="bg-white shadow-2xl border border-gray-100 rounded-3xl w-full max-w-lg p-6">
        {/* Header */}
        <div className="text-center border-b pb-4 mb-4">
          <h2 className="text-3xl font-bold text-gray-800">💰 Đặt cọc dịch vụ</h2>
          <p className="text-gray-500 mt-1">Xác nhận thông tin trước khi thanh toán</p>
        </div>

        {/* Nội dung thông tin */}
        <div className="space-y-3 text-gray-700">
          <InfoRow icon={<User className="w-5 h-5 text-blue-500" />} label="Bệnh nhân" value={appointment.patient.name} />
          <InfoRow icon={<Stethoscope className="w-5 h-5 text-green-500" />} label="Bác sĩ" value={appointment.doctor.name} />
          <InfoRow icon={<Activity className="w-5 h-5 text-purple-500" />} label="Dịch vụ" value={appointment.service.name} />
          <InfoRow icon={<Wallet className="w-5 h-5 text-amber-500" />} label="Số tiền gốc" value={`${appointment.service.price.toLocaleString()} ₫`} />
          <InfoRow
            icon={<span className="text-amber-600 font-semibold">💵</span>}
            label="Cần đặt cọc"
            value={`${depositAmount.toLocaleString()} ₫`}
            highlight
          />
        </div>

        {/* Nút đặt cọc */}
        <div className="pt-6">
          <button
            onClick={handleDeposit}
            disabled={loading}
            className={`w-full py-3 rounded-xl text-white font-semibold transition-all ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <Loader2 className="animate-spin mr-2 w-5 h-5" /> Đang xử lý...
              </div>
            ) : (
              "💳 Đặt cọc ngay"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// Component hàng thông tin (key-value)
function InfoRow({ icon, label, value, highlight = false }) {
  return (
    <div className={`flex items-center justify-between border-b pb-2 ${highlight ? "text-amber-600 font-bold" : ""}`}>
      <span className="flex items-center gap-2 font-medium">
        {icon} {label}
      </span>
      <span>{value}</span>
    </div>
  );
}
