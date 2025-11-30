import React, { useState, useEffect } from "react";
import API from "../../api/axios"; // ✅ đảm bảo bạn có file axios cấu hình sẵn baseURL

export default function Header1() {
    const [banners, setBanners] = useState([]);
    const [current, setCurrent] = useState(0);
    const [loading, setLoading] = useState(true);

    // ------------------- GỌI API -------------------
    const loadBanners = async () => {
        try {
            const res = await API.get("/banners");

            // Nếu API trả về mảng hoặc phân trang thì đều xử lý được
            const data = Array.isArray(res.data)
                ? res.data
                : res.data.data || [];

            // Chỉ hiển thị banner đang hoạt động (is_active = true)
            const activeBanners = data.filter((b) => b.is_active);

            setBanners(activeBanners);
            setLoading(false);
        } catch (err) {
            // Silent error - không cần thông báo
            setLoading(false);
        }
    };

    useEffect(() => {
        loadBanners();
    }, []);

    // ------------------- SLIDER TỰ ĐỘNG -------------------
    useEffect(() => {
        if (banners.length === 0) return;
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % banners.length);
        }, 5000); // 5 giây đổi ảnh
        return () => clearInterval(timer);
    }, [banners]);

    // ------------------- HIỂN THỊ -------------------
    if (loading) {
        return (
            <div className="flex justify-center items-center h-64 bg-gray-100 text-gray-600">
                Đang tải banner...
            </div>
        );
    }

    if (banners.length === 0) {
        return (
            <div className="flex justify-center items-center h-64 bg-gray-100 text-gray-600">
                Không có banner nào để hiển thị
            </div>
        );
    }

    return (
        <div className="relative w-full h-64 md:h-[500px] overflow-hidden">
            {/* Ảnh banner */}
            <div
                className="flex transition-transform duration-1000 ease-linear"
                style={{
                    transform: `translateX(-${current * 100}%)`,
                    width: `${banners.length * 100}%`,
                }}
            >
                {banners.map((banner, i) => (
                    <img
                        key={i}
                        src={
                            banner?.image
                                ? banner.image.startsWith("http")
                                    ? banner.image
                                    : `http://localhost:8000/storage/${banner.image}`
                                : "https://via.placeholder.com/1200x400?text=No+Image" // ảnh fallback
                        }
                        alt={banner.title || "Banner"}
                        className="w-full h-full object-fill flex-shrink-0"
                    />
                ))}
            </div>

            {/* Overlay nội dung */}
            <div className="absolute inset-0 flex flex-col justify-center items-center bg-black/40 text-white text-center px-4">
                <div className="text-3xl md:text-6xl font-bold mb-4 drop-shadow-md">
                    {banners[current].title || "—"}
                </div>

                {banners[current].link && (
                    <a
                        href={banners[current].link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-2 bg-white text-blue-600 font-semibold rounded-3xl shadow-md hover:bg-blue-100 transition"
                    >
                        Xem chi tiết
                    </a>
                )}
            </div>

            {/* Nút chọn banner */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3">
                {banners.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrent(i)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${current === i ? "bg-white scale-125" : "bg-gray-400"
                            }`}
                    ></button>
                ))}
            </div>
        </div>
    );
}
