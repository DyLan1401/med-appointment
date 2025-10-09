import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function PostDetail() {
    const { state } = useLocation();
    const navigate = useNavigate();

    if (!state) {
        return (
            <div className="h-screen flex items-center justify-center text-gray-600">
                <div className="text-center">
                    <p className="text-xl mb-4">Không tìm thấy bài viết.</p>
                    <button
                        onClick={() => navigate("/posts")}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Quay lại danh sách
                    </button>
                </div>
            </div>
        );
    }

    const { title, author, date, image, content } = state;

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6">
                <img src={image} alt={title} className="w-full h-80 object-cover rounded-lg mb-6" />
                <h1 className="text-3xl font-bold text-blue-700 mb-2">{title}</h1>
                <div className="text-sm text-gray-500 mb-6 flex justify-between">
                    <span>{author}</span>
                    <span>{date}</span>
                </div>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{content}</p>

                <div className="mt-8">
                    <button
                        onClick={() => navigate("/blog")}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        ← Quay lại
                    </button>
                </div>
            </div>
        </div>
    );
}
