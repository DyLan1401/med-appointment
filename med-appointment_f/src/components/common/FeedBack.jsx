"use client";
import { useState } from "react";
import { Star } from "lucide-react";

export default function FeedBack() {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState("");

    const feedbacks = [
        {
            name: "Trần Thị C",
            date: "21/09/2025",
            rating: 4.5,
            comment: "Bác sĩ rất tận tình và chu đáo. Tôi cảm thấy yên tâm khi được tư vấn và điều trị.",
        },
        {
            name: "Lê Văn D",
            date: "18/09/2025",
            rating: 4,
            comment: "Phòng khám sạch sẽ, trang thiết bị hiện đại. Quy trình thăm khám nhanh chóng.",
        },
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log({ rating, comment });
        alert("Cảm ơn bạn đã gửi feedback!");
        setComment("");
        setRating(0);
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-md mt-8">
            <h2 className="text-xl font-bold text-blue-600 mb-1">Đánh giá và Bình luận</h2>
            <p className="text-gray-500 mb-4 text-sm">
                Chia sẻ trải nghiệm của bạn về dịch vụ khám chữa bệnh.
            </p>

            <form onSubmit={handleSubmit}>
                <h3 className="font-semibold mb-2">Viết Feedback của bạn</h3>

                {/* Stars */}
                <div className="flex items-center mb-3">
                    <span className="mr-3 text-sm text-gray-700">Mức độ hài lòng của bạn:</span>
                    {[1, 2, 3, 4, 5].map((index) => (
                        <Star
                            key={index}
                            size={22}
                            className={`cursor-pointer transition-colors ${index <= (hover || rating)
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }`}
                            onClick={() => setRating(index)}
                            onMouseEnter={() => setHover(index)}
                            onMouseLeave={() => setHover(0)}
                        />
                    ))}
                </div>

                {/* Comment */}
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Bình luận của bạn"
                    className="w-full border border-gray-300 rounded-md p-2 mb-4 focus:ring-2 focus:ring-blue-400 outline-none"
                    rows="3"
                    required
                />

                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                >
                    Gửi Feedback
                </button>
            </form>

            {/* Recent Feedback */}
            <div className="mt-6 border-t pt-4">
                <h3 className="font-semibold text-gray-700 mb-3">Các Feedback gần đây</h3>

                {feedbacks.map((fb, idx) => (
                    <div
                        key={idx}
                        className="bg-gray-50 p-4 rounded-lg shadow-sm mb-3 border border-gray-200"
                    >
                        <div className="flex justify-between items-center mb-1">
                            <div>
                                <p className="font-semibold text-gray-800">{fb.name}</p>
                                <p className="text-sm text-gray-400">{fb.date}</p>
                            </div>
                            <div className="flex items-center gap-1">
                                {Array.from({ length: 5 }, (_, i) => (
                                    <Star
                                        key={i}
                                        size={16}
                                        className={
                                            i < Math.round(fb.rating)
                                                ? "fill-yellow-400 text-yellow-400"
                                                : "text-gray-300"
                                        }
                                    />
                                ))}
                                <span className="text-sm font-medium text-gray-600 ml-1">
                                    {fb.rating}/5
                                </span>
                            </div>
                        </div>
                        <p className="text-gray-600 text-sm">{fb.comment}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
