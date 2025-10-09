
import React from "react";

export default function ManagerHoaDon() {

    return (
        <>
            <div className='w-full h-screen'>
                <div className="w-full h-full  flex flex-col p-3">
                    <h1 className="text-blue-500 text-xl font-semibold py-5">Quản lí Hóa đơn</h1>
                    <div className="py-5">Đây là danh sách hóa đơn của bạn. Vui lòng xem và có thể tải xuống khi cần.</div>
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
                        <button className="bg-green-500 py-2 px-4 rounded-lg">Thêm Hóa đơn</button>
                    </div>

                    <div class="relative overflow-x-auto shadow-md ">
                        <table class="w-full text-sm text-gray-500">
                            <thead class="uppercase text-white   bg-blue-500">
                                <tr>
                                    <th scope="col" class="px-6 py-3">
                                        Mã hóa đơn
                                    </th>
                                    <th scope="col" class="px-6 py-3">
                                        Ngày                                    </th>
                                    <th scope="col" class="px-6 py-3">
                                        Bác sĩ                                    </th>
                                    <th scope="col" class="px-6 py-3">
                                        Số tiền                                    </th>
                                    <th scope="col" class="px-6 py-3">
                                        Trạng thái
                                    </th>
                                    <th scope="col" class="px-6 py-3">
                                        Thao tác
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200">
                                    <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        hd1
                                    </th>
                                    <td class="px-6 py-4">
                                        29/02/2025
                                    </td>
                                    <td class="px-6 py-4">
                                        Dr. Nguyễn Văn A
                                    </td>
                                    <td class="px-6 py-4">
                                        500,000 VND
                                    </td>
                                    <td class="px-6 py-4">
                                        <button className="bg-green-300 text-green-600 px-3 rounded-2xl"> Đã thanh toán</button>
                                    </td>
                                    <td class="px-6 py-4 space-x-2">
                                        Tải xuống
                                    </td>
                                </tr>

                                <tr class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200">
                                    <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        hd2
                                    </th>
                                    <td class="px-6 py-4">
                                        29/02/2025
                                    </td>
                                    <td class="px-6 py-4">
                                        Dr. Nguyễn Văn B
                                    </td>
                                    <td class="px-6 py-4">
                                        500,000 VND
                                    </td>
                                    <td class="px-6 py-4">
                                        <button className="bg-red-300 text-red-600 px-3 rounded-2xl"> Chưa thanh toán</button>
                                    </td>
                                    <td class="px-6 py-4 space-x-2">
                                        Xem
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                </div>
            </div> </>
    );
}
