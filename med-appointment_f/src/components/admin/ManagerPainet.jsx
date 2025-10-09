
import React from "react";

export default function ManagerPainet() {

    return (
        <>
            <div className='w-full h-screen '>
                <div className="w-full h-full  flex flex-col p-3">
                    <h1 className="text-blue-500 text-xl font-semibold py-5">Quản lí bệnh nhân</h1>
                    <div className="py-5">Thêm, chỉnh sửa, xóa bệnh nhân và gửi ghi chú riêng tư.</div>
                    <div className="flex justify-between items-center py-2">
                        <form class="max-w-md ">
                            <label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                            <div class="relative">
                                <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                    <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                    </svg>
                                </div>
                                <input type="search" id="default-search" class="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-200" placeholder="Tìm kiếm bệnh nhân" />
                            </div>
                        </form>
                        <button className="bg-green-500 py-2 px-4 rounded-lg">Thêm Bệnh nhân</button>
                    </div>

                    <div class="relative overflow-x-auto shadow-md ">
                        <table class="w-full text-sm text-gray-500">
                            <thead class="uppercase text-white   bg-blue-500">
                                <tr>
                                    <th scope="col" class="px-6 py-3">
                                        ID
                                    </th>
                                    <th scope="col" class="px-6 py-3">
                                        Tên bệnh nhân
                                    </th>
                                    <th scope="col" class="px-6 py-3">
                                        Email
                                    </th>
                                    <th scope="col" class="px-6 py-3">
                                        Số điện thoại
                                    </th>
                                    <th scope="col" class="px-6 py-3">
                                        Thao tác
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200">
                                    <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        1
                                    </th>
                                    <td class="px-6 py-4">
                                        Nguyễn Văn A
                                    </td>
                                    <td class="px-6 py-4">
                                        Nguyenvana@gmail.com
                                    </td>
                                    <td class="px-6 py-4">
                                        1234567895
                                    </td>
                                    <td class="px-6 py-4 space-x-2">
                                        <a href="#" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">Xem</a>
                                        <a href="#" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">Sửa</a>
                                        <a href="#" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">Xóa</a>
                                    </td>
                                </tr>
                                <tr class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200">
                                    <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        2
                                    </th>
                                    <td class="px-6 py-4">
                                        Nguyễn Văn A
                                    </td>
                                    <td class="px-6 py-4">
                                        Nguyenvana@gmail.com
                                    </td>
                                    <td class="px-6 py-4">
                                        1234567895
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
            </div> </>
    );
}
