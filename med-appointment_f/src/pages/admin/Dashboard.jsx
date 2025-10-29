import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

export default function Dashboard() {
    const location = useLocation();

    const menus = [
        { path: "/dashboard", label: "Dashboard" },
        { path: "doctors", label: "Quản lí bác sĩ" },
        { path: "schedules", label: "Quản lí lịch hẹn" },
        { path: "chuyenKhoas", label: "Quản lí chuyên khoa" },
        { path: "painets", label: "Quản lí bệnh nhân" },
        { path: "users", label: "Quản lí người dùng" },
        { path: "services", label: "Quản lí dịch vụ" },
        { path: "categories", label: "Quản lí danh mục bài viết" },
        { path: "posts", label: "Quản lí bài viết" },
        { path: "invoices", label: "Quản lí hóa đơn" },
        { path: "feedbackdoctors", label: "Quản lí phản hồi bác sĩ" },
        { path: "feedbackposts", label: "Quản lí phản hồi bài viết" },
        { path: "contacts", label: "Quản lí liên hệ" },
        { path: "banners", label: "Quản lí banners" },
        { path: "works", label: "Quản lí lịch làm việc" },
        { path: "appointmentStats", label: "Thống kê lịch khám" },
        { path: "BHYTStatistics", label: "Thống kê BHYT" },
        { path: "TopDoctors", label: "Thống kê bác sĩ" },
        { path: "/", label: "Thoát" },
    ];

    return (
        <div className="w-full h-screen flex overflow-hidden">
            {/* MENU BÊN TRÁI */}
            <div className="w-80 bg-white shadow-lg flex flex-col overflow-y-auto scrollbar-hide">
                <div className="p-4 text-xl font-bold text-center border-b sticky top-0 bg-white z-10">
                    Admin Dashboard
                </div>

                <div className="flex-1 flex flex-col justify-start">
                    {menus.map((item, i) => {
                        const active =
                            location.pathname === `/dashboard/${item.path}` ||
                            (item.path === "/dashboard" && location.pathname === "/dashboard");

                        return (
                            <Link
                                key={i}
                                to={item.path}
                                className={`py-3 px-4 border-b text-center font-semibold transition-all ${active
                                    ? "bg-blue-600 text-white"
                                    : "bg-blue-500 hover:bg-blue-600 text-white"
                                    }`}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* NỘI DUNG BÊN PHẢI */}
            <div className="flex-1 h-full bg-gray-50 p-6  overflow-y-auto">
                <div className=""></div>
                <Outlet />
            </div>
        </div>
    );
}
