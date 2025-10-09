import React from "react";

export default function FormDashboard() {
    const stats = [
        { label: "Tổng bệnh nhân", value: 1250, icon: "👤", color: "bg-blue-100 text-blue-600" },
        { label: "Lịch hẹn mới", value: 65, icon: "📅", color: "bg-green-100 text-green-600" },
        { label: "Lịch hẹn đã xác nhận", value: 890, icon: "✅", color: "bg-purple-100 text-purple-600" },
    ];

    const appointments = [
        { title: "Khám tổng quát", doctor: "BS. Phạm Hoài Hiếu", date: "19/08/2025", location: "TP. Hồ Chí Minh" },
        { title: "Tư vấn dinh dưỡng", doctor: "BS. Nguyễn Thị Kiều Giang", date: "25/08/2025", location: "Cần Thơ" },
        { title: "Chụp X-quang", doctor: "BS. Trần Thế Giang", date: "28/08/2025", location: "Tiền Giang" },
    ];

    const feedbacks = [
        { name: "Nguyễn Tuấn Kiệt", rating: 5, comment: "Bác sĩ rất thân thiện và chuyên nghiệp. Tôi rất hài lòng." },
        { name: "Nguyễn Thanh Tuấn", rating: 5, comment: "Trải nghiệm tuyệt vời! Mọi thứ đều rất nhanh chóng." },
    ];

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h2 className="text-2xl font-bold text-blue-700 mb-2">Bảng Điều Khiển Tổng Quan</h2>
            <p className="text-gray-600 mb-6">Chào mừng bạn trở lại! Dưới đây là tóm tắt các hoạt động chính.</p>

            {/* --- Tổng quan --- */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {stats.map((item, index) => (
                    <div
                        key={index}
                        className="flex items-center justify-between bg-white p-5 rounded-2xl shadow hover:shadow-lg transition"
                    >
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-full ${item.color} text-xl`}>{item.icon}</div>
                            <div>
                                <p className="text-gray-500 text-sm">{item.label}</p>
                                <p className="text-xl font-semibold">{item.value.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* --- Lịch hẹn & Phản hồi --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Lịch hẹn gần đây */}
                <div className="bg-white p-6 rounded-2xl shadow">
                    <h3 className="text-lg font-semibold text-blue-600 mb-4 border-b pb-2">Lịch hẹn gần đây</h3>
                    <ul className="space-y-3">
                        {appointments.map((item, index) => (
                            <li key={index} className="border-b pb-2">
                                <p className="font-medium">{item.title}</p>
                                <p className="text-sm text-gray-500">{item.doctor}</p>
                                <p className="text-sm text-gray-400">
                                    📍 {item.location} — 🕒 {item.date}
                                </p>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Phản hồi mới nhất */}
                <div className="bg-white p-6 rounded-2xl shadow">
                    <h3 className="text-lg font-semibold text-blue-600 mb-4 border-b pb-2">Phản hồi mới nhất</h3>
                    <ul className="space-y-4">
                        {feedbacks.map((fb, index) => (
                            <li key={index}>
                                <div className="flex gap-1 text-yellow-400 mb-1">
                                    {Array.from({ length: fb.rating }).map((_, i) => (
                                        <span key={i}>★</span>
                                    ))}
                                </div>
                                <p className="text-gray-700 italic">"{fb.comment}"</p>
                                <p className="text-sm text-gray-500 mt-1">- {fb.name}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
