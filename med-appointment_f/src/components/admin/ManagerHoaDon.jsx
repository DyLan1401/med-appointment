
// import React from "react";

// export default function ManagerHoaDon() {

//     return (
//         <>
//             <div className='w-full h-screen'>
//                 <div className="w-full h-full  flex flex-col p-3">
//                     <h1 className="text-blue-500 text-xl font-semibold py-5">Quản lí Hóa đơn</h1>
//                     <div className="py-5">Đây là danh sách hóa đơn của bạn. Vui lòng xem và có thể tải xuống khi cần.</div>
//                     <div className="flex justify-between items-center py-2">
//                         <form class="max-w-md ">
//                             <label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
//                             <div class="relative">
//                                 <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
//                                     <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
//                                         <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
//                                     </svg>
//                                 </div>
//                                 <input type="search" id="default-search" class="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-200" placeholder="Tìm kiếm Hóa đơn" />
//                             </div>
//                         </form>
//                         <button className="bg-green-500 py-2 px-4 rounded-lg">Thêm Hóa đơn</button>
//                     </div>

//                     <div class="relative overflow-x-auto shadow-md ">
//                         <table class="w-full text-sm text-gray-500">
//                             <thead class="uppercase text-white   bg-blue-500">
//                                 <tr>
//                                     <th scope="col" class="px-6 py-3">
//                                         Mã hóa đơn
//                                     </th>
//                                     <th scope="col" class="px-6 py-3">
//                                         Ngày                                    </th>
//                                     <th scope="col" class="px-6 py-3">
//                                         Bác sĩ                                    </th>
//                                     <th scope="col" class="px-6 py-3">
//                                         Số tiền                                    </th>
//                                     <th scope="col" class="px-6 py-3">
//                                         Trạng thái
//                                     </th>
//                                     <th scope="col" class="px-6 py-3">
//                                         Thao tác
//                                     </th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 <tr class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200">
//                                     <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
//                                         hd1
//                                     </th>
//                                     <td class="px-6 py-4">
//                                         29/02/2025
//                                     </td>
//                                     <td class="px-6 py-4">
//                                         Dr. Nguyễn Văn A
//                                     </td>
//                                     <td class="px-6 py-4">
//                                         500,000 VND
//                                     </td>
//                                     <td class="px-6 py-4">
//                                         <button className="bg-green-300 text-green-600 px-3 rounded-2xl"> Đã thanh toán</button>
//                                     </td>
//                                     <td class="px-6 py-4 space-x-2">
//                                         Tải xuống
//                                     </td>
//                                 </tr>

//                                 <tr class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200">
//                                     <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
//                                         hd2
//                                     </th>
//                                     <td class="px-6 py-4">
//                                         29/02/2025
//                                     </td>
//                                     <td class="px-6 py-4">
//                                         Dr. Nguyễn Văn B
//                                     </td>
//                                     <td class="px-6 py-4">
//                                         500,000 VND
//                                     </td>
//                                     <td class="px-6 py-4">
//                                         <button className="bg-red-300 text-red-600 px-3 rounded-2xl"> Chưa thanh toán</button>
//                                     </td>
//                                     <td class="px-6 py-4 space-x-2">
//                                         Xem
//                                     </td>
//                                 </tr>
//                             </tbody>
//                         </table>
//                     </div>

//                 </div>
//             </div> </>
//     );
// }
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "../../api/axios";

export default function InvoicePayment() {
    const [invoices, setInvoices] = useState([]);
    const [pagination, setPagination] = useState({ current_page: 1, last_page: 1 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchInvoices = async (page = 1) => {
        try {
            setLoading(true);
            const res = await axios.get(`http://localhost:8000/api/invoices?page=${page}`);
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

            {/* Thanh tìm kiếm */}
            <div className="flex justify-between items-center py-2">
                <form class="max-w-md ">
                    <label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                    <div class="relative">
                        <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                            <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                            </svg>
                        </div>
                        <input type="search" id="default-search" class="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-200" placeholder="Tìm kiếm Hóa đơn" />
                    </div>
                </form>

            </div>

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
