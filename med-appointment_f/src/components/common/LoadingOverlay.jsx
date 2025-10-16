// src/components/common/LoadingOverlay.jsx
import React from "react";

export default function LoadingOverlay({ show, message = "Đang xử lý..." }) {
    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white p-5 rounded-lg shadow-lg flex items-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                <p>{message}</p>
            </div>
        </div>
    );
}
