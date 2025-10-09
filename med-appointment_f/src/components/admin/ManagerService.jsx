import React from "react";

export default function ManagerService() {

    return (

        <div className='w-full h-screen '>
            <h1 className="text-blue-500 text-xl font-semibold py-5">Quản lí Dịch vụ</h1>
            <h2 className="text-lg">Thêm dịch vụ mới</h2>
            <form className=" gap-5 mb-6">

                <label className="block mb-1 text-gray-700">Tên dịch vụ:</label>
                <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400"
                />
                <label htmlFor="">Mô tả:</label>
                <textarea
                    className="w-full border border-gray-300 rounded-lg p-2 min-h-[80px] resize-none focus:ring-2 focus:ring-blue-400"
                />

                <label className="block mb-1 text-gray-700">Giá(VND):</label>
                <input
                    type="number"
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400"
                />
                {/* Nút đặt lịch */}
                <div className=" flex justify-start items-center">
                    <button
                        type="submit"
                        className="bg-blue-600 px-5  mt-3 text-white  text-center py-3 justify-center rounded-lg flex items-center gap-2 font-semibold"
                    >
                        Thêm dịch vụ
                    </button>
                </div>
            </form>

            <div className="flex justify-between items-center py-2">
                <form class="max-w-md p-5  ">
                    <label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                    <div class="relative">
                        <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                            <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                            </svg>
                        </div>
                        <input type="search" id="default-search" class="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-200" placeholder="Tìm kiếm Dịch vụ" />
                    </div>
                </form>
                <button className="bg-green-500 py-2 px-4 rounded-lg">Thêm dịch vụ</button>
            </div>

            <h2 className="text-lg">Danh sách Dịch vụ</h2>
            <div class="relative  pb-5 shadow-md ">
                <table class="w-full text-sm text-gray-500">
                    <thead class="uppercase text-white   bg-blue-500">
                        <tr>
                            <th scope="col" class="px-6 py-3">
                                Tên dịch vụ
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Mô tả
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Giá
                            </th>

                            <th scope="col" class="px-6 py-3">
                                Thao tác
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200">
                            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                Khám tổng quát
                            </th>
                            <td class="px-6 py-4">
                                Kiểm tra sức khỏe tổng thể
                            </td>
                            <td class="px-6 py-4">
                                500,000 VND
                            </td>

                            <td class="px-6 py-4 space-x-2">
                                <a href="#" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">Xem</a>
                                <a href="#" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">Sửa</a>
                                <a href="#" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">Xóa</a>
                            </td>
                        </tr>
                        <tr class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200">
                            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                Khám tổng quát
                            </th>
                            <td class="px-6 py-4">
                                Kiểm tra sức khỏe tổng thể
                            </td>
                            <td class="px-6 py-4">
                                500,000 VND
                            </td>

                            <td class="px-6 py-4 space-x-2">
                                <a href="#" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">Xem</a>
                                <a href="#" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">Sửa</a>
                                <a href="#" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">Xóa</a>
                            </td>
                        </tr>
                        <tr class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200">
                            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                Khám tổng quát
                            </th>
                            <td class="px-6 py-4">
                                Kiểm tra sức khỏe tổng thể
                            </td>
                            <td class="px-6 py-4">
                                500,000 VND
                            </td>

                            <td class="px-6 py-4 space-x-2">
                                <a href="#" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">Xem</a>
                                <a href="#" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">Sửa</a>
                                <a href="#" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">Xóa</a>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

    )
};
