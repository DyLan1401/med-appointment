import { Link, Outlet, useLocation } from "react-router-dom";
import { FcManager, FcFeedback, FcStatistics } from "react-icons/fc";
import { FaHome, FaUser, FaChartPie } from "react-icons/fa";
import { FaUserDoctor, FaHeadSideCough, FaFileInvoiceDollar } from "react-icons/fa6";
import { RiCalendarScheduleFill, RiTeamFill } from "react-icons/ri";
import { MdMedicalServices, MdLocalPostOffice, MdWorkHistory } from "react-icons/md";
import { GiPostOffice } from "react-icons/gi";
import { VscFeedback } from "react-icons/vsc";
import { PiContactlessPaymentFill, PiFlagBannerFill } from "react-icons/pi";
import { HiChartBar } from "react-icons/hi";
import { HiOutlineArrowLeftOnRectangle } from "react-icons/hi2";

export default function Dashboard() {
    const location = useLocation();

    const menus = [
        {
            icon: <FaHome />
            , path: "/dashboard", label: "Dashboard"
        },
        {
            icon: <FaUserDoctor />
            , path: "doctors", label: "Quản lí bác sĩ"
        },
        {
            icon: <RiCalendarScheduleFill />
            , path: "schedules", label: "Quản lí lịch hẹn"
        },
        {
            icon: <RiTeamFill />
            , path: "chuyenKhoas", label: "Quản lí chuyên khoa"
        },
        {
            icon: <FaHeadSideCough />
            , path: "painets", label: "Quản lí bệnh nhân"
        },
        {
            icon: <FaUser />
            , path: "users", label: "Quản lí người dùng"
        },
        {
            icon: <MdMedicalServices />
            , path: "services", label: "Quản lí dịch vụ"
        },
        {
            icon: <GiPostOffice />
            , path: "categories", label: "Quản lí danh mục bài viết"
        },
        {
            icon: <MdLocalPostOffice />
            , path: "posts", label: "Quản lí bài viết"
        },
        {
            icon: <FaFileInvoiceDollar />
            , path: "invoices", label: "Quản lí hóa đơn"
        },
        {
            icon: <VscFeedback />
            , path: "feedbackdoctors", label: "Quản lí phản hồi từ bệnh nhân"
        },
        {
            icon: <FcFeedback />
            , path: "feedbackposts", label: "Quản lí phản hồi bài viết"
        },
        {
            icon: <PiContactlessPaymentFill />
            , path: "contacts", label: "Quản lí liên hệ"
        },
        {
            icon: <PiFlagBannerFill />
            , path: "banners", label: "Quản lí banners"
        },
        {
            icon: <MdWorkHistory />
            , path: "works", label: "Quản lí lịch làm việc"
        },
        {
            icon: <FcStatistics />
            , path: "appointmentStats", label: "Thống kê lịch khám"
        },
        {
            icon: <FaChartPie />
            , path: "BHYTStatistics", label: "Thống kê BHYT"
        },
        {
            icon: <HiChartBar />
            , path: "TopDoctors", label: "Thống kê bác sĩ"
        },
        {
            icon: <HiOutlineArrowLeftOnRectangle />
            , path: "/", label: "Thoát"
        },
    ];

    return (
        <div className="w-full h-screen flex overflow-hidden">

            {/* MENU BÊN TRÁI */}
            <div className="w-64 bg-blue-600 shadow-lg flex flex-col overflow-y-auto scrollbar-hide">
                <div className="p-4 bg-blue-600 text-xl font-bold flex flex-row justify-center text-white gap-2 items-center text-center border-b-2 border-b-white sticky top-0  z-10">
                    <FcManager /> Admin Dashboard
                </div>
                <div className="flex-1 flex flex-col p-1 justify-start">
                    {menus.map((item, i) => {
                        const active =
                            location.pathname === `/dashboard/${item.path}` ||
                            (item.path === "/dashboard" && location.pathname === "/dashboard");

                        return (
                            <Link
                                key={i}
                                to={item.path}
                                className={`py-2 px-3  flex flex-row items-center gap-2 transition-all ${active
                                    ? " text-white bg-blue-100/50 rounded-lg "
                                    : " hover:bg-blue-200 hover:rounded-lg  text-white"
                                    }`}
                            >
                                {item.icon}
                                {item.label}
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* NỘI DUNG BÊN PHẢI */}
            <div className="flex-1 h-full bg-gray-50 p-6  overflow-y-auto">
                <Outlet />
            </div>
        </div>
    );
}
