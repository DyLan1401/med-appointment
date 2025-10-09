import React from "react";
import { Star } from "lucide-react";

const feedbacks = [
    {
        id: 1,
        name: "Trần Thị Trúc Giang",
        avatar: "https://cdn-icons-png.flaticon.com/512/4140/4140048.png",
        comment: "Bác sĩ nhiệt tình, tuyệt vời.",
        rating: 5,
        date: "24/06/2025",
    },
    {
        id: 2,
        name: "Trần Thị Thu Hiền",
        avatar: "https://cdn-icons-png.flaticon.com/512/4140/4140037.png",
        comment: "Tạm ổn, cũng được thôi.",
        rating: 2,
        date: "23/09/2025",
    },
];

export default function FeedbackList() {
    return (
        <div className="max-w-2xl mx-auto bg-white shadow-md rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-blue-600 mb-2">
                Quản lý Feedback
            </h2>
            <p className="text-gray-500 text-sm mb-6">
                Tổng quan về các phản hồi từ bệnh nhân của bạn.
            </p>

            <div className="space-y-4">
                {feedbacks.map((fb) => (
                    <div
                        key={fb.id}
                        className="border border-gray-100 rounded-xl p-4 flex items-start gap-4 hover:shadow-sm transition"
                    >
                        <img
                            src={fb.avatar}
                            alt={fb.name}
                            className="w-12 h-12 rounded-full border"
                        />
                        <div className="flex-1">
                            <h3 className="font-semibold text-blue-700">{fb.name}</h3>
                            <p className="text-gray-600 text-sm mt-1">"{fb.comment}"</p>
                            <div className="flex items-center justify-between mt-2">
                                <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-4 h-4 ${i < fb.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                                                }`}
                                        />
                                    ))}
                                </div>
                                <span className="text-xs text-gray-400">Ngày: {fb.date}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
