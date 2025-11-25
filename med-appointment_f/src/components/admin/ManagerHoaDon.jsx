
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "../../api/axios";
import API from "../../api/axios";
export default function InvoicePayment() {
    const [invoices, setInvoices] = useState([]);
    const [pagination, setPagination] = useState({ current_page: 1, last_page: 1 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchInvoices = async (page = 1) => {
        try {
            setLoading(true);
            const res = await API.get(`/invoices?page=${page}`);
            if (res.data.status) {
                setInvoices(res.data.data.data); // Laravel paginate => data.data
                setPagination({
                    current_page: res.data.data.current_page,
                    last_page: res.data.data.last_page,
                });
            } else {
                setError(res.data.msg || "Không thể tải danh sách hóa đơn");
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    const handleDownload = async (invoiceId, status) => {
        if (status !== "paid") {
            toast.warning("❌ Chỉ có thể tải hóa đơn đã thanh toán!");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(
                `http://localhost:8000/api/invoices/${invoiceId}/download`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                    responseType: "blob", // Quan trọng để tải file
                }
            );

            // Tạo file từ blob
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `invoice_${invoiceId}.pdf`);
            document.body.appendChild(link);
            link.click();

            // Dọn dẹp URL
            window.URL.revokeObjectURL(url);
            toast.success("Đã tải hóa đơn thành công!");
        } catch (error) {
            if (error.response?.status === 403) {
                toast.warning("⚠️ Hóa đơn chưa thanh toán, không thể tải!");
            } else if (error.response?.status === 404) {
                toast.error("⚠️ Không tìm thấy hóa đơn!");
            } else {
                toast.error("Đã xảy ra lỗi khi tải hóa đơn!");
            }
        }
    };


    useEffect(() => {
        fetchInvoices(pagination.current_page);
    }, [pagination.current_page]);

    if (loading) return <p className="text-center text-gray-500 mt-10">Đang tải dữ liệu...</p>;
    if (error) return <p className="text-center text-red-600 mt-10">Lỗi: {error}</p>;

    return (

        <div className=" p-6">
            {/* Header */}

            <h1 className="text-2xl font-bold text-blue-700 mb-2">Quản lí Hóa đơn</h1>

          

            {/* Bảng giữ nguyên giao diện cũ */}
            <table className="w-full text-sm text-center text-gray-700">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="border p-2">#</th>
                        <th className="border p-2">Bệnh nhân</th>
                        <th className="border p-2">Bác sĩ</th>
                        <th className="border p-2">Số tiền</th>
                        <th className="border p-2">Loại</th>
                        <th className="border p-2">Trạng thái</th>
                        <th className="border p-2">Ngày tạo</th>
                        <th className="border p-2">Tải hóa đơn</th>
                    </tr>
                </thead>
                <tbody>
                    {invoices.map((invoice, index) => (
                        <tr key={invoice.id} className=" hover:bg-gray-50">
                            <td className="border p-2">{index + 1}</td>
                            <td className="border p-2">{invoice.patient_name}</td>
                            <td className="border p-2">{invoice.doctor_name}</td>
                            <td className="border p-2 text-right pr-4">
                                {parseFloat(invoice.amount).toLocaleString()}đ
                            </td>
                            <td className="border p-2">{invoice.type}</td>
                            <td
                                className={`border p-2 font-semibold ${invoice.status === "paid"
                                    ? "text-green-600"
                                    : "text-red-600"
                                    }`}
                            >
                                {invoice.status}
                            </td>
                            <td className="border p-2">
                                {new Date(invoice.created_at).toLocaleDateString()}
                            </td>
                            <td className="border p-2">
                                <button
                                    onClick={() => handleDownload(invoice.id, invoice.status)}
                                    disabled={invoice.status !== "paid"}
                                    className={`px-3 py-1 rounded text-white font-medium transition ${invoice.status === "paid"
                                        ? "bg-blue-600 hover:bg-blue-700"
                                        : "bg-gray-400 cursor-not-allowed"
                                        }`}
                                >
                                    ⬇ Tải Hóa Đơn
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Phân trang (thêm vào, không đổi style cũ) */}
            <div className="flex justify-center gap-3 mt-4">
                <button
                    onClick={() =>
                        setPagination((p) => ({
                            ...p,
                            current_page: p.current_page - 1,
                        }))
                    }
                    disabled={pagination.current_page <= 1}
                    className="bg-gray-300 px-3 py-1 rounded disabled:opacity-50"
                >
                    Trước
                </button>
                <span>
                    Trang {pagination.current_page} / {pagination.last_page}
                </span>
                <button
                    onClick={() =>
                        setPagination((p) => ({
                            ...p,
                            current_page: p.current_page + 1,
                        }))
                    }
                    disabled={pagination.current_page >= pagination.last_page}
                    className="bg-gray-300 px-3 py-1 rounded disabled:opacity-50"
                >
                    Sau
                </button>
            </div>
        </div>

    );
}
