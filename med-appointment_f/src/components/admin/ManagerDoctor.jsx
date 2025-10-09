import React from "react";

import dt2 from "../../assets/dt2.jpg";
export default function ManagerDoctor() {

    return (
        <>
            <div className='w-full h-screen '>
                <div className="w-full h-full  flex flex-col p-3">
                    <h1 className="text-blue-500 text-xl font-semibold py-5">Quản lí Bác sĩ</h1>
                    <div className="py-5">Thêm, chỉnh sửa, xóa bác sĩ trong hệ thống</div>
                    <div>
                        <h2>Thông tin bác sĩ</h2>
                        <form className="grid grid-cols-2 gap-4 mb-6">
                            {/* Cột trái */}
                            <div>
                                <label className="block mb-1 text-gray-700">Tên bác sĩ</label>
                                <input
                                    type="text"
                                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400"
                                />
                                <label className="block mt-4 mb-1 text-gray-700">Chọn Khoa</label>
                                <select
                                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400"
                                >
                                    <option value="">-- Chọn Khoa --</option>
                                    <option value="Tim mạch">Tim mạch</option>
                                    <option value="Tai mũi họng">Tai mũi họng</option>

                                </select>
                            </div>

                            {/* Cột phải */}
                            <div>
                                <label className="block mb-1 text-gray-700">Email</label>
                                <input
                                    type="email"
                                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400"
                                />

                                <label className="block mt-4 mb-1 text-gray-700">Ghi chú</label>
                                <label className="block mb-1 text-gray-700">Số điện thoại</label>
                                <input
                                    type="number"
                                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400"
                                />

                            </div>
                            <div className="col-span-2 py-2">
                                <label htmlFor="">Mô tả chuyên môn</label>
                                <textarea
                                    className="w-full border border-gray-300 rounded-lg p-2 min-h-[80px] resize-none focus:ring-2 focus:ring-blue-400"
                                />
                                <label htmlFor="">Tiểu sử</label>
                                <textarea
                                    className="w-full border border-gray-300 rounded-lg p-2 min-h-[80px] resize-none focus:ring-2 focus:ring-blue-400"
                                />
                            </div>
                            {/* Nút đặt lịch */}
                            <div className=" flex justify-start items-center">
                                <button
                                    type="submit"
                                    className="bg-blue-600 px-5  text-white  text-center py-3 justify-center rounded-lg flex items-center gap-2 font-semibold"
                                >
                                    Lưu bác sĩ
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="flex justify-between items-center py-2">
                        <form class="max-w-md ">
                            <label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                            <div class="relative">
                                <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                    <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                    </svg>
                                </div>
                                <input type="search" id="default-search" class="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-200" placeholder="Tìm kiếm Bác sĩ" />
                            </div>
                        </form>
                        <button className="bg-green-500 py-2 px-4 rounded-lg">Thêm Bác sĩ</button>
                    </div>

                    <div class="relative  pb-5 shadow-md ">
                        <table class="w-full text-sm text-gray-500">
                            <thead class="uppercase text-white   bg-blue-500">
                                <tr>
                                    <th scope="col" class="px-6 py-3">
                                        Ảnh
                                    </th>
                                    <th scope="col" class="px-6 py-3">
                                        Tên Bác sĩ
                                    </th>
                                    <th scope="col" class="px-6 py-3">
                                        Email
                                    </th>
                                    <th scope="col" class="px-6 py-3">
                                        Chuyên khoa
                                    </th>
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
                                        <img
                                            src={dt2}
                                            alt="doctor"
                                            className="w-24  h-24 bg-contain rounded-full bg-blue-100 p-2"
                                        />
                                    </th>
                                    <td class="px-6 py-4">
                                        Nguyễn Văn A
                                    </td>
                                    <td class="px-6 py-4">
                                        Nguyenvana@gmail.com
                                    </td>
                                    <td class="px-6 py-4">
                                        Tim mạch
                                    </td>
                                    <td class="px-6 py-4">
                                        <button className=" px-2 bg-green-200 rounded-lg">online</button>
                                    </td>
                                    <td class="px-6 py-4 space-x-2">
                                        <a href="#" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">Xem</a>
                                        <a href="#" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">Sửa</a>
                                        <a href="#" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">Xóa</a>
                                    </td>
                                </tr>
                                <tr class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200">
                                    <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        <img
                                            src={dt2}
                                            alt="doctor"
                                            className="w-24  h-24 bg-contain rounded-full bg-blue-100 p-2"
                                        />
                                    </th>
                                    <td class="px-6 py-4">
                                        Nguyễn Văn B
                                    </td>
                                    <td class="px-6 py-4">
                                        Nguyenvanb@gmail.com
                                    </td>
                                    <td class="px-6 py-4">
                                        Tai mũi họng
                                    </td>
                                    <td class="px-6 py-4">
                                        <button className=" px-2 bg-red-200 rounded-lg">offline</button>
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

                </div >
            </div > </>
    );
}
