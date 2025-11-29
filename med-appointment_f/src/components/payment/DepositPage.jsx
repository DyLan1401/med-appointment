import React, { useState, useEffect } from "react";
import API from "../../api/axios";
import { toast } from "react-toastify";
import { Loader2, Wallet, User, Stethoscope, Activity } from "lucide-react";
import { useParams } from "react-router-dom";
import Navbar from "../common/Navbar";
import Footer from "../common/Footer";

export default function DepositPage() {
  const { appointmentId } = useParams();
  const [loading, setLoading] = useState(false);
  const [appointment, setAppointment] = useState(null);
  const [depositAmount, setDepositAmount] = useState(0);

  useEffect(() => {
    const fetchAppointment = async () => {
      if (!appointmentId) return;
      try {
        const res = await API.get(`/appointments/show/${appointmentId}`);
        setAppointment(res.data.data);
        const deposit = res.data.data.service.price * 0.2;
        setDepositAmount(deposit);
      } catch (error) {
        console.error(error);
        toast.error("Không thể tải dữ liệu. Vui lòng thử lại!");
      }
    };
    fetchAppointment();
  }, [appointmentId]);

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

      const resInvoice = await API.post("/invoices", payload);

      if (!resInvoice.data?.data?.invoice?.id) {
        toast.error("❌ Không lấy được ID hóa đơn!");
        return;
      }

      const invoiceId = resInvoice.data.data.invoice.id;

      const resPayment = await API.post("/payment/create", {
        invoice_id: invoiceId,
      });

      if (resPayment.data?.success && resPayment.data?.checkoutUrl) {
        toast.success("Đang chuyển đến trang thanh toán...");
        setTimeout(() => {
          window.location.href = resPayment.data.checkoutUrl;
        }, 1000);
      } else {
        toast.error("❌ Không tạo được link thanh toán!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "❌ Lỗi khi tạo hóa đơn hoặc thanh toán!");
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
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-amber-50 flex items-center justify-center p-6">
        <div className="bg-white shadow-2xl border border-gray-100 rounded-3xl w-full max-w-lg p-6">
          <div className="text-center border-b pb-4 mb-4">
            <h2 className="text-3xl font-bold text-gray-800">💰 Đặt cọc dịch vụ</h2>
            <p className="text-gray-500 mt-1">Xác nhận thông tin trước khi thanh toán</p>
          </div>

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

          <div className="pt-6">
            <button
              onClick={handleDeposit}
              disabled={loading}
              className={`w-full py-3 rounded-xl text-white font-semibold transition-all ${loading
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
      <Footer />
    </>
  );
}

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