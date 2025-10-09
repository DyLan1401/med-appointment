import React, { useState, useEffect } from "react";

export default function Header1() {
    const banners = [
        {
            url: "https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=1600&q=80",
            title: "Chăm sóc sức khỏe toàn diện",
            subtitle: "Nơi sức khỏe của bạn được ưu tiên hàng đầu.",
        },
        {
            url: "https://images.unsplash.com/photo-1588776814546-3121b78a005d?auto=format&fit=crop&w=1600&q=80",
            title: "Đặt lịch khám nhanh chóng",
            subtitle: "Chỉ vài cú nhấp chuột, bác sĩ đã sẵn sàng.",
        },
        {
            url: "https://images.unsplash.com/photo-1550831107-1553da8c8464?auto=format&fit=crop&w=1600&q=80",
            title: "Dịch vụ y tế chuyên nghiệp",
            subtitle: "Tận tâm – Chính xác – Hiện đại.",
        },
    ];

    const [current, setCurrent] = useState(0);

    // Auto slide loop
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % banners.length);
        }, 2000); // đổi ảnh mỗi 5s
        return () => clearInterval(timer);
    }, [banners.length]);

    return (
        <div className="relative w-full h-64 md:h-[500px] overflow-hidden">
            {/* Các ảnh banner */}
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
                        src={banner.url}
                        alt={`banner-${i}`}
                        className="w-full h-full object-cover flex-shrink-0"
                    />
                ))}
            </div>

            {/* Overlay nội dung */}
            <div className="absolute inset-0 flex flex-col justify-center items-center bg-black/40 text-white text-center px-4">
                <div className="text-4xl md:text-6xl font-bold mb-4">
                    {banners[current].title}
                </div>
                <div className="text-lg mb-6">{banners[current].subtitle}</div>
                <button className="px-6 py-2 bg-white text-blue-600 font-semibold rounded-3xl shadow-md hover:bg-blue-100">
                    Đặt lịch ngay
                </button>
            </div>

            {/* Nút chọn banner (dấu chấm tròn) */}
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
