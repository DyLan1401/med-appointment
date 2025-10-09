import React from "react";

export default function TopDoctors() {
    const doctors = [
        {
            rank: 1,
            name: "Dr. Đặng Thanh Phong",
            specialty: "Khoa Tai Mũi Họng",
            bookings: 150,
            avatar: "https://cdn-icons-png.flaticon.com/512/4140/4140048.png",
            color: "bg-yellow-400",
        },
        {
            rank: 2,
            name: "Dr. Vũ Đình Thiên",
            specialty: "Khoa Dinh Dưỡng",
            bookings: 120,
            avatar: "https://cdn-icons-png.flaticon.com/512/4140/4140051.png",
            color: "bg-gray-400",
        },
        {
            rank: 3,
            name: "Dr. Nguyễn Thanh Lân",
            specialty: "Khoa Xét Nghiệm",
            bookings: 95,
            avatar: "https://cdn-icons-png.flaticon.com/512/4140/4140061.png",
            color: "bg-amber-700",
        },
    ];

    return (
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-md p-6 mt-8">
            <h2 className="text-xl font-semibold text-blue-600 mb-2">
                Bác sĩ được đặt nhiều nhất
            </h2>
            <p className="text-gray-500 text-sm mb-6">
                Xếp hạng các bác sĩ dựa trên số lượng lịch hẹn đã được xác nhận.
            </p>

            {/* Bảng hiển thị */}
            <table className="w-full border border-gray-200 rounded-lg overflow-hidden text-sm">
                <thead className="bg-blue-600 text-white">
                    <tr>
                        <th className="py-2 px-4 text-left w-16">Hạng</th>
                        <th className="py-2 px-4 text-left">Bác sĩ</th>
                        <th className="py-2 px-4 text-left">Chuyên khoa</th>
                        <th className="py-2 px-4 text-left">Số lượt đặt lịch</th>
                    </tr>
                </thead>
                <tbody>
                    {doctors.map((doc) => (
                        <tr
                            key={doc.rank}
                            className="border-b hover:bg-blue-50 transition"
                        >
                            <td className="py-2 px-4">
                                <div
                                    className={`w-7 h-7 flex items-center justify-center rounded-full text-white font-semibold ${doc.color}`}
                                >
                                    {doc.rank}
                                </div>
                            </td>
                            <td className="py-2 px-4 flex items-center gap-2">
                                <img
                                    src={doc.avatar}
                                    alt={doc.name}
                                    className="w-8 h-8 rounded-full border"
                                />
                                <span className="font-medium text-blue-700">{doc.name}</span>
                            </td>
                            <td className="py-2 px-4">{doc.specialty}</td>
                            <td className="py-2 px-4 font-semibold text-blue-600">
                                {doc.bookings}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
