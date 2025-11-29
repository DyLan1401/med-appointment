import React from "react";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
            <h1 className="text-7xl font-bold text-blue-600 mb-4">404</h1>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                Trang không tồn tại
            </h2>
            <p className="text-gray-500 mb-6 text-center max-w-md">
                Trang bạn đang tìm không tồn tại hoặc bạn không có quyền truy cập.
            </p>
            <button
                onClick={() => navigate("/")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
            >
                Quay về trang chủ
            </button>
        </div>
    );
}
