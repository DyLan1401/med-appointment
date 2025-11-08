import { XCircle, RefreshCw, ArrowLeft, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function PaymentFailedV2() {
  const [isLoading, setIsLoading] = useState(false);
  const [cancelStatus, setCancelStatus] = useState('idle'); // 'idle' | 'success' | 'error'
  const [message, setMessage] = useState('');

  // Lấy các tham số từ URL
  const getUrlParams = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return {
      orderCode: urlParams.get('orderCode'),
      status: urlParams.get('status'),
      cancel: urlParams.get('cancel'),
      code: urlParams.get('code'),
      id: urlParams.get('id')
    };
  };

  const validateOrderCode = (orderCode) => {
    if (!orderCode) return false;
    // Kiểm tra orderCode có phải là số và có ít nhất 6 ký tự
    return /^\d{6,}$/.test(orderCode);
  };

  const handleCancelInvoice = async () => {
    const { orderCode, status, cancel } = getUrlParams();
    
    // Kiểm tra orderCode có hợp lệ không
    if (!validateOrderCode(orderCode)) {
      setCancelStatus('error');
      setMessage('Mã đơn hàng không hợp lệ');
      return;
    }

    // Kiểm tra trạng thái thanh toán có phải là CANCELLED không
    if (status !== 'CANCELLED' && cancel !== 'true') {
      setCancelStatus('error');
      setMessage('Giao dịch chưa được xác nhận hủy');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/api/invoices/cancel-invoice?order_code=${orderCode}`);
      const data = await response.json();

      if (data.success) {
        setCancelStatus('success');
        setMessage(data.message || 'Đã hủy hóa đơn thành công');
      } else {
        setCancelStatus('error');
        setMessage(data.message || 'Hủy hóa đơn thất bại');
      }
    } catch (error) {
      setCancelStatus('error');
      setMessage('Lỗi kết nối đến server');
      console.error('API Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    // Chuyển hướng đến trang thanh toán lại
    const { orderCode } = getUrlParams();
    if (orderCode) {
      window.location.href = `/payment?orderCode=${orderCode}`;
    } else {
      window.location.href = '/';
    }
  };

  const handleBackToHome = () => {
    window.location.href = '/';
  };

  // Tự động hủy invoice khi component mount
  useEffect(() => {
    handleCancelInvoice();
  }, []);

  const { orderCode, status, cancel, code, id } = getUrlParams();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-5">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          
          {/* Header */}
          <div className={`p-6 text-center ${
            cancelStatus === 'success' ? 'bg-green-500' : 'bg-red-500'
          }`}>
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-full mb-4">
              {cancelStatus === 'success' ? (
                <CheckCircle className="w-8 h-8 text-white" />
              ) : (
                <XCircle className="w-8 h-8 text-white" />
              )}
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              {cancelStatus === 'success' 
                ? 'Đã hủy hóa đơn' 
                : cancelStatus === 'error'
                ? 'Xử lý thất bại'
                : 'Thanh toán không thành công'
              }
            </h1>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="text-center mb-6">
              {isLoading ? (
                <div className="space-y-2">
                  <p className="text-gray-600">Đang xử lý hủy hóa đơn...</p>
                  <div className="flex justify-center">
                    <RefreshCw className="w-5 h-5 animate-spin text-gray-400" />
                  </div>
                </div>
              ) : (
                <p className="text-gray-600">{message}</p>
              )}
            </div>

            {/* Hiển thị thông tin chi tiết */}
            <div className="bg-gray-100 rounded-lg p-4 mb-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Mã đơn hàng:</span>
                <span className="font-mono font-bold text-gray-800">
                  {orderCode || 'Không có'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Trạng thái:</span>
                <span className={`font-semibold ${
                  status === 'CANCELLED' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {status || 'Không xác định'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Mã giao dịch:</span>
                <span className="font-mono text-gray-800 text-xs truncate max-w-[120px]">
                  {id || 'Không có'}
                </span>
              </div>
            </div>

            {/* Buttons */}
            <div className="space-y-3">
              {cancelStatus !== 'success' && (
                <button
                  onClick={handleRetry}
                  disabled={isLoading}
                  className="w-full bg-red-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-600 transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <RefreshCw className="w-5 h-5" />
                  Thử lại thanh toán
                </button>
              )}

              <button
                onClick={handleBackToHome}
                className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-50 transition duration-200 flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                Quay lại trang chủ
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}