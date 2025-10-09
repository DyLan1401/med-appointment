import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
    const navigate = useNavigate();
    const [language, setLanguage] = useState("EN");
    const [openLang, setOpenLang] = useState(false);
    const [openUser, setOpenUser] = useState(false);
    const [openDoctor, setOpenDoctor] = useState(false); // 🔹 Thêm state dropdown cho mục Bác sĩ
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("user");
        setUser(null);
        navigate("/login");
    };

    const handleLanguageChange = (lang) => {
        setLanguage(lang);
        setOpenLang(false);
    };

    return (
        <div className="w-full h-full pt-2">
            <div className="w-full h-full flex justify-between items-center font-semibold">
                {/* Logo */}
                <div
                    className="w-full text-center cursor-pointer text-2xl font-bold text-blue-600"
                    onClick={() => navigate("/")}
                >
                    Logo
                </div>

                {/* Menu */}
                <div className="w-full flex items-center justify-between relative">
                    {["Trang chủ", "Liên hệ", "Bài viết", "Bác sĩ", "Đặt lịch khám"].map((label, i) => {
                        // Nếu là mục "Bác sĩ" thì tạo dropdown riêng
                        if (label === "Bác sĩ") {
                            return (
                                <div
                                    key={i}
                                    className="relative"
                                    onMouseEnter={() => setOpenDoctor(true)}
                                    onMouseLeave={() => setOpenDoctor(false)}
                                >
                                    <button
                                        className="text-gray-700 hover:text-blue-500 cursor-pointer"
                                    >
                                        {label} ▾
                                    </button>

                                    {/* Dropdown Bác sĩ */}
                                    {openDoctor && (
                                        <div className="absolute top-full left-0  bg-white shadow-lg border rounded-lg w-48 z-50">
                                            <button
                                                onClick={() => navigate("/doctor")}
                                                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                            >
                                                Tất cả bác sĩ
                                            </button>
                                            <button
                                                onClick={() => navigate("/favoritedoctors")}
                                                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                            >
                                                Bác sĩ yêu thích
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        }

                        // Các menu khác
                        return (
                            <div
                                key={i}
                                onClick={() => {
                                    if (label === "Trang chủ") navigate("/");
                                    else if (label === "Liên hệ") navigate("/contact");
                                    else if (label === "Bài viết") navigate("/blog");
                                    else if (label === "Đặt lịch khám") navigate("/selectschedule");
                                }}
                                className="text-gray-700 hover:text-blue-500 cursor-pointer"
                            >
                                {label}
                            </div>
                        );
                    })}
                </div>

                {/* Search + Language + Login/User */}
                <div className="w-full space-x-5 flex justify-center items-center relative">
                    {/* Dropdown Language */}
                    <div className="relative z-50">
                        <button
                            onClick={() => setOpenLang(!openLang)}
                            className="p-2 bg-gray-500 text-white rounded-2xl flex items-center space-x-1"
                        >
                            <span>{language}</span>
                            <svg
                                className={`w-4 h-4 transition-transform duration-200 ${openLang ? "rotate-180" : ""}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M19 9l-7 7-7-7"
                                />
                            </svg>
                        </button>

                        {openLang && (
                            <div className="absolute right-0 mt-2 w-24 bg-white rounded-lg shadow-lg border border-gray-200">
                                <button onClick={() => handleLanguageChange("EN")} className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                                    English
                                </button>
                                <button onClick={() => handleLanguageChange("VI")} className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                                    Tiếng Việt
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Nếu chưa đăng nhập */}
                    {!user ? (
                        <button
                            onClick={() => navigate("/login")}
                            className="p-2 rounded-2xl bg-blue-600 text-white"
                        >
                            Đăng nhập
                        </button>
                    ) : (
                        // Nếu đã đăng nhập → dropdown user
                        <div className="relative z-50">
                            <button
                                onClick={() => setOpenUser(!openUser)}
                                className="p-2 bg-blue-500 text-white rounded-2xl"
                            >
                                {user.name}
                            </button>

                            {openUser && (
                                <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg border border-gray-200">
                                    {/* Role = patient */}
                                    {user.role === "patient" && (
                                        <>
                                            <button
                                                onClick={() => { navigate("/patientprofile") }}
                                                className="block w-full px-4 py-2 hover:bg-gray-100 text-left">
                                                Hồ sơ cá nhân
                                            </button>
                                            <button
                                                onClick={() => { navigate("/patienthistory") }}

                                                className="block w-full px-4 py-2 hover:bg-gray-100 text-left">
                                                Lịch sử khám bệnh
                                            </button>
                                        </>
                                    )}

                                    {/* Role = doctor */}
                                    {user.role === "doctor" && (
                                        <>
                                            <button
                                                onClick={() => { navigate("/doctorprofile") }}

                                                className="block w-full px-4 py-2 hover:bg-gray-100 text-left">
                                                Hồ sơ bác sĩ
                                            </button>
                                            <button
                                                onClick={() => { navigate("/doctorschedule") }}

                                                className="block w-full px-4 py-2 hover:bg-gray-100 text-left">
                                                Lịch làm việc
                                            </button>
                                        </>
                                    )}

                                    {/* Role = admin */}
                                    {user.role === "admin" && (
                                        <button
                                            onClick={() => navigate("/dashboard")}
                                            className="block w-full px-4 py-2 hover:bg-gray-100 text-left"
                                        >
                                            Vào Dashboard
                                        </button>
                                    )}

                                    <button
                                        onClick={handleLogout}
                                        className="block w-full px-4 py-2 hover:bg-gray-100 text-left text-red-600"
                                    >
                                        Thoát
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
