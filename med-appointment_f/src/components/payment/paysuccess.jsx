import { CheckCircle2, Download, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
export default function PaymentSuccess() {
    const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-5">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-3xl shadow-2xl p-12 text-center relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-green-100 rounded-full opacity-50"></div>
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-emerald-100 rounded-full opacity-50"></div>
          
          <div className="relative z-10">
            {/* Success Icon */}
            <div className="mb-8 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-green-400 rounded-full blur-3xl opacity-50 animate-pulse"></div>
                <div className="relative bg-gradient-to-br from-green-400 to-emerald-500 rounded-full p-6">
                  <CheckCircle2 className="w-14 h-14 text-white" strokeWidth={2.5} />
                </div>
              </div>
            </div>

            {/* Success Message */}
            <h1 className="text-4xl font-bold text-gray-800 mb-3">
              Thanh toán thành công!
            </h1>
            <p className="text-gray-500 text-lg mb-10">
              Giao dịch của bạn đã được xử lý thành công
            </p>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2">
                <Download className="w-5 h-5" />
                Tải hóa đơn
              </button>
              <button
              onClick={() => navigate('/')}
              className="w-full bg-gray-100 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300 flex items-center justify-center gap-2">
                <ArrowLeft className="w-5 h-5" />
                Về trang chủ
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}