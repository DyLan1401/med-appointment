import React, { useState } from "react";
import { toast } from "react-toastify";
import { Mail, FileText, CheckCircle, XCircle } from "lucide-react";

export default function SendInvoice() {
    const [email, setEmail] = useState("nguyenvana@example.com");
    const [subject, setSubject] = useState("[Hệ thống Y tế] Hóa đơn thanh toán dịch vụ khám chữa bệnh");
    const [content, setContent] = useState(
        `Kính gửi Quý khách Nguyễn Văn A,\n\nChúng tôi xin gửi hóa đơn thanh toán cho dịch vụ khám chữa bệnh của Quý khách. Tổng số tiền là 5.500.000đ.\n\nTrân trọng,\nHệ thống Y tế.`
    );
    const [sendCopy, setSendCopy] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        toast.success("✅ Gửi email hóa đơn thành công!");
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-50">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-md p-6">
                {/* Header */}
                <div className="border-b pb-3 mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                        <Mail className="text-blue-500" size={22} />
                        Gửi Hóa đơn <span className="text-gray-400 text-base">(ID: <span className="text-blue-600 font-semibold">INV-1021</span>)</span>
                    </h2>
                </div>

                {/* Chi tiết hóa đơn */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-5">
                    <h3 className="font-semibold text-gray-700 mb-2">Chi tiết Hóa đơn</h3>
                    <div className="text-sm text-gray-700 space-y-1">
                        <p><b>Bệnh nhân:</b> Nguyễn Văn A</p>
                        <p><b>Tổng tiền:</b> <span className="text-green-600 font-semibold">5.500.000₫</span></p>
                        <p className="flex items-center gap-1">
                            <b>Trạng thái:</b>
                            <span className="flex items-center gap-1 text-yellow-600 font-medium bg-yellow-100 px-2 py-0.5 rounded-md text-xs">
                                <XCircle size={14} /> Chưa thanh toán
                            </span>
                        </p>
                        <p>
                            <b>File Hóa đơn:</b>{" "}
                            <a href="#" className="text-blue-600 hover:underline flex items-center gap-1">
                                <FileText size={14} /> Xem file PDF
                            </a>
                        </p>
                    </div>
                </div>

                {/* Form gửi Email */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Email nhận */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Địa chỉ Email Nhận <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Mặc định là email của bệnh nhân (từ bảng <code>users</code>). Có thể thay đổi.
                        </p>
                    </div>

                    {/* Chủ đề Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Chủ đề Email <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {/* Nội dung Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nội dung Email (Tùy chọn)
                        </label>
                        <textarea
                            rows={5}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Hóa đơn PDF sẽ tự động đính kèm ở cuối email.
                        </p>
                    </div>

                    {/* Gửi bản sao */}
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={sendCopy}
                            onChange={(e) => setSendCopy(e.target.checked)}
                            className="h-4 w-4 text-blue-600 rounded"
                        />
                        <label className="text-sm text-gray-700">
                            Gửi bản sao (CC) đến địa chỉ email của Quản trị viên
                        </label>
                    </div>

                    {/* Nút hành động */}
                    <div className="flex justify-end gap-3 mt-5">
                        <button
                            type="button"
                            className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 flex items-center gap-2"
                        >
                            <CheckCircle size={18} /> Gửi Email Hóa đơn
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
