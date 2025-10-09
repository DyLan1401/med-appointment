"use client";
import { useState } from "react";
import { Star } from "lucide-react";

export default function PatientHistory() {
    const [appointments] = useState([
        {
            id: 1,
            title: "Khám tổng quát",
            date: "23/09/2025",
            doctor: "Dr. Đặng Thanh Phong",
            department: "Khoa Khám bệnh",
            service: "Khám tổng quát",
            rating: 4,
            comment: "Bác sĩ nhiệt tình.",
        },
        {
            id: 2,
            title: "Tư vấn dinh dưỡng",
            date: "10/07/2025",
            doctor: "Dr. Vũ Đình Thiện",
            department: "Khoa Dinh dưỡng",
            service: "Tư vấn dinh dưỡng",
            rating: 0,
            comment: "",
        },
    ]);

    return (
        <div className="max-w-3xl mx-auto mt-10 bg-white shadow-md rounded-2xl p-6">
            <h2 className="text-2xl font-semibold text-blue-600 mb-6 text-center">
                Lịch sử khám bệnh
            </h2>
            <p className="text-gray-600 mb-6 text-center">
                Tổng quan về các lần khám bệnh trước đây của bạn.
            </p>

            {appointments.map((item) => (
                <div
                    key={item.id}
                    className="border border-gray-200 rounded-xl p-5 mb-6 hover:shadow-lg transition-all"
                >
                    <h3 className="text-lg font-semibold text-blue-500 mb-3 flex items-center gap-2">
                        🩺 {item.title}
                    </h3>

                    <div className="text-gray-700 space-y-1 mb-3">
                        <p>
                            <strong>Ngày:</strong> {item.date}
                        </p>
                        <p>
                            <strong>Bác sĩ:</strong> {item.doctor}
                        </p>
                        <p>
                            <strong>Chuyên khoa:</strong> {item.department}
                        </p>
                        <p>
                            <strong>Dịch vụ:</strong> {item.service}
                        </p>
                    </div>
                    <div className=" p-2">
                        <hr />
                    </div>
                    <div className="mb-3">
                        <strong>Đánh giá:</strong>{" "}
                        {item.rating > 0 ? (
                            <div className="inline-flex">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                        key={i}
                                        size={18}
                                        className={
                                            i < item.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                                        }
                                    />
                                ))}
                            </div>
                        ) : (
                            <span className="text-gray-400 ml-1">Chưa có</span>
                        )}
                    </div>

                    {item.comment && (
                        <p className="text-gray-600 italic mb-4">Bình luận: {item.comment}</p>
                    )}

                    <div className="flex gap-3">
                        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
                            Xem chi tiết
                        </button>
                        <button className="px-4 py-2 bg-sky-100 text-blue-600 border border-blue-300 rounded-lg hover:bg-sky-200 transition">
                            Đặt lịch tái khám
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
