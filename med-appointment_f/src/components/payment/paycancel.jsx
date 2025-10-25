import { XCircle, RefreshCw, ArrowLeft, AlertTriangle } from 'lucide-react';

export default function PaymentFailedV2() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-red-50 to-orange-50 flex items-center justify-center p-5">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-red-500 to-rose-600 p-8 text-center relative">
            <div className="absolute inset-0 bg-black opacity-5"></div>
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white bg-opacity-20 rounded-full backdrop-blur-sm mb-4">
                <XCircle className="w-12 h-12 text-white" strokeWidth={2.5} />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Thanh toán thất bại
              </h1>
              <p className="text-red-100 text-sm">
                Đã có lỗi xảy ra trong quá trình xử lý
              </p>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8">
            {/* Error Alert */}
            <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-red-800 mb-1">
                    Giao dịch không thành công
                  </h3>
                  <p className="text-sm text-red-600">
                    Vui lòng kiểm tra lại thông tin và thử lại sau
                  </p>
                </div>
              </div>
            </div>

              
              <button className="w-full border-2 border-gray-200 text-gray-700 py-4 px-6 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 flex items-center justify-center gap-2">
                <ArrowLeft className="w-5 h-5" />
                Quay lại trang chủ
              </button>
            </div>
        </div>
        </div>
    </div>
  );
}