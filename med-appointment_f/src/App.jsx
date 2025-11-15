/* --------------------------------------------- 
 🌍 App.jsx - Phiên bản hoàn chỉnh & an toàn
----------------------------------------------*/
import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";

/* 🧩 Import các component cần thiết */
import Navbar from "./components/common/Navbar";
import Header1 from "./components/common/Header1";
import Header2 from "./components/common/Header2";
import Section1 from "./components/common/section1";
import Section2 from "./components/common/Section2";
import MiniMap from "./components/common/maps";
import Footer from "./components/common/Footer";
import FormService from "./components/common/FormService";
import PatientNotifications from "./components/common/PatientNotifications";
import PatientNotes from "./components/common/PatientNotes";

/* Trang yêu thích bác sĩ */
import LikeDoctor from "./components/doctor/LikeDoctor";

/* Các trang khác */
import DoctorDetail from "./components/doctor/DoctorDetail";
import DoctorProfile from "./components/doctor/DoctorProfile";
import PageDoctorSchedule from "./pages/doctor/PageDoctorSchedule";
import Login from "./pages/auth/Login";
import PageRegister from "./pages/auth/PageRegister";
import PageForgetPassword from "./pages/auth/PageForgetPassword";
import PageChangePassword from "./pages/auth/PageChangepPassword";
import PageSelectSchedule from "./pages/patient/PageSelectSchedule";
import PageDatLichKhamNhanh from "./pages/patient/PageDatLichKhamNhanh";
import PageDatLichKham from "./pages/patient/PageDatLichKham";
import PageFavoriteDoctors from "./pages/patient/PageFavoriteDoctors";
import PagePatientProfile from "./pages/patient/PagePatientProfile";
import PagePatientHistory from "./pages/patient/PagePatientHistory";
import DepositConfirmation from "./components/patient/DepositConfirmation";
import InvoicePayment from "./components/patient/InvoicePayment";
import PageContact from "./pages/general/PageContact";
import PagePosts from "./pages/general/PagePosts";
import PostDetail from "./pages/general/PostDetail";
import Dashboard from "./pages/admin/Dashboard";
import FormDashboard from "./components/admin/FormDashboard";

/* Các trang quản lý admin */
import ManagerDoctor from "./components/admin/ManagerDoctor";
import ManagerLichHen from "./components/admin/ManagerLichHen";
import ManagerChuyenKhoa from "./components/admin/ManagerChuyenKhoa";
import ManagerPainet from "./components/admin/ManagerPainet";
import ManagerUser from "./components/admin/ManagerUsers";
import ManagerService from "./components/admin/ManagerService";
import ManagerCategoriesPost from "./components/admin/ManagerCategoriesPost";
import ManagerPosts from "./components/admin/ManagerPosts";
import ManagerHoaDon from "./components/admin/ManagerHoaDon";
import ManagerFeedBackDoctor from "./components/admin/ManagerFeedBackDoctor";
import ManagerFeedBackPost from "./components/admin/ManagerFeedBackPost";
import ManagerContact from "./components/admin/ManagerContact";
import ManagerBanners from "./components/admin/ManagerBanner";
import ManagerWork from "./components/admin/ManagerWork";
import AppointmentStats from "./components/admin/AppointmentStats";
import BHYTStatistics from "./components/admin/BHYTStatistics";
import TopDoctors from "./components/doctor/TopDoctors";

/* Thêm Feedback */
import FeedBackDoctor from "./components/common/FeedBackDoctor";

/* 💬 Chatbot nổi */
import ChatBot from "./components/common/ChatBot";

import PaymentOptions from "./components/payment/Paymain";
import PaymentSuccess from "./components/payment/paysuccess";
import PaymentFailedV2 from "./components/payment/paycancel";
<<<<<<< HEAD
import DepositPage from "./components/payment/DepositPage";
import PayfullPage from "./components/payment/PayfullPage";
=======

/* ✅✅✅ Thêm chat components */
import AdminChat from "./components/admin/AdminChat";
import DoctorGroupChat from "./components/common/DoctorGroupChat";

/* ---------------------------------------------
 ✅ Laravel Echo / Pusher setup (fix lỗi Pusher)
----------------------------------------------*/
import Echo from "laravel-echo";
import Pusher from "pusher-js";

// Tạo instance Pusher trước
const pusher = new Pusher("local", {
  wsHost: "127.0.0.1",
  wsPort: 6001,
  forceTLS: false,
  disableStats: true
});

// Tạo Echo client
export const EchoClient = new Echo({
  broadcaster: "pusher",
  key: "local", // trùng với PUSHER_APP_KEY trong .env
  client: pusher
});

/* ---------------------------------------------
 🛡️ SafeRender: Chống trắng trang nếu component lỗi
----------------------------------------------*/
function SafeRender({ children }) {
  try {
    return children;
  } catch (err) {
    console.error("Render error:", err);
    return (
      <div className="text-center mt-20 text-red-600 text-lg font-semibold">
        ⚠️ Có lỗi khi hiển thị trang. Kiểm tra console để biết thêm chi tiết.
      </div>
    );
  }
}

/* --------------------------------------------- */
>>>>>>> DangThanhPhong/15-ChatRealtime
export default function App() {
  useEffect(() => {
    // Bọc trong try/catch để không làm trắng trang khi lỗi Echo
    try {
      EchoClient.channel("chat-doctor.1").listen("MessageSent", (e) => {
        console.log("📨 New message:", e);
      });
    } catch (err) {
      console.warn("⚠️ Echo client failed:", err);
    }
  }, []);

  return (
    <SafeRender>
      <Routes>
        {/* 🌐 Trang chủ */}
        <Route
          path="/"
          element={
            <div className="w-full h-full px-1 space-y-8">
              {console.log("🏠 Render home page")}
              <div className="w-full h-14">
                <Navbar />
              </div>
              <Header1 />
              <Header2 />
              <Section1 />
              <div className="w-full h-full px-5">
                <Section2 />
              </div>
              <MiniMap />
              <Footer />
            </div>
          }
        />

        {/* 👨‍⚕️ Trang bác sĩ */}
        <Route
          path="/doctor"
          element={
            <div className="w-full min-h-screen bg-gray-50">
              <Navbar />
              <div className="pt-20">
                <Section1 />
              </div>
              <Footer />
            </div>
          }
        />

        {/* Hồ sơ bác sĩ */}
        <Route path="/doctorprofile" element={<DoctorProfile />} />
        <Route path="/doctorprofile/:id" element={<DoctorProfile />} />

        {/* Chi tiết bác sĩ */}
        <Route path="/doctor/:name" element={<DoctorDetail />} />
        <Route path="/doctor/:id/profile" element={<DoctorProfile />} />
        <Route path="/doctorschedule" element={<PageDoctorSchedule />} />

        {/* Feedback bác sĩ */}
        <Route
          path="/doctor/:id/feedbackdoctor"
          element={
            <div className="w-full min-h-screen bg-gray-50">
              <Navbar />
              <div className="pt-24 px-6">
                <FeedBackDoctor />
              </div>
              <Footer />
            </div>
          }
        />

        {/* Chi tiết bác sĩ theo ID */}
        <Route
          path="/doctor-detail/:id"
          element={
            <div className="w-full min-h-screen bg-gray-50">
              <Navbar />
              <div className="pt-24 px-6">
                <DoctorDetail />
                <FeedBackDoctor />
              </div>
              <Footer />
            </div>
          }
        />

        {/* 💖 Trang yêu thích bác sĩ */}
        <Route
          path="/like-doctor"
          element={
            <div className="w-full min-h-screen bg-gray-50">
              <Navbar />
              <div className="pt-24 px-6">
                <LikeDoctor />
              </div>
              <Footer />
            </div>
          }
        />

        {/* 👩‍⚕️ Trang bệnh nhân */}
        <Route path="/deposit" element={<DepositConfirmation />} />
        <Route path="/invoice" element={<InvoicePayment />} />
        <Route path="/favoritedoctors" element={<PageFavoriteDoctors />} />
        <Route path="/patientprofile" element={<PagePatientProfile />} />
        <Route path="/patienthistory" element={<PagePatientHistory />} />

        {/* 🔔 Thông báo bệnh nhân */}
        <Route
          path="/notifications"
          element={
            <div className="w-full min-h-screen bg-gray-50">
              <Navbar />
              <div className="pt-24 px-6">
                <PatientNotifications />
              </div>
              <Footer />
            </div>
          }
        />

        {/* 📝 Ghi chú chi tiết bệnh nhân (theo ID) */}
        <Route
          path="/notifications/:id"
          element={
            <div className="w-full min-h-screen bg-gray-50">
              <Navbar />
              <div className="pt-24 px-6">
                <PatientNotes />
              </div>
              <Footer />
            </div>
          }
        />

        {/* 🧾 Đặt lịch & đăng nhập */}
        <Route path="/login" element={<Login />} />
        <Route path="/forgetPassword" element={<PageForgetPassword />} />
        <Route path="/changepassword" element={<PageChangePassword />} />
        <Route path="/register" element={<PageRegister />} />
        <Route path="/selectschedule" element={<PageSelectSchedule />} />
        <Route path="/rebook/:id" element={<PageDatLichKhamNhanh />} />
        <Route path="/datlichkham" element={<PageDatLichKham />} />
        <Route path="/selectservice" element={<FormService />} />

        {/* 📞 Public pages */}
        <Route path="/contact" element={<PageContact />} />
        <Route path="/blog" element={<PagePosts />} />
        <Route path="/blog/:id" element={<PostDetail />} />

        {/* 🧭 Dashboard */}
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<FormDashboard />} />
          <Route path="chat" element={<AdminChat />} />
          <Route path="doctors" element={<ManagerDoctor />} />
          <Route path="schedules" element={<ManagerLichHen />} />
          <Route path="chuyenKhoas" element={<ManagerChuyenKhoa />} />
          <Route path="painets" element={<ManagerPainet />} />
          <Route path="users" element={<ManagerUser />} />
          <Route path="services" element={<ManagerService />} />
          <Route path="categories" element={<ManagerCategoriesPost />} />
          <Route path="posts" element={<ManagerPosts />} />
          <Route path="invoices" element={<ManagerHoaDon />} />
          <Route path="feedbackdoctors" element={<ManagerFeedBackDoctor />} />
          <Route path="feedbackposts" element={<ManagerFeedBackPost />} />
          <Route path="contacts" element={<ManagerContact />} />
          <Route path="banners" element={<ManagerBanners />} />
          <Route path="works" element={<ManagerWork />} />
          <Route path="appointmentStats" element={<AppointmentStats />} />
          <Route path="BHYTStatistics" element={<BHYTStatistics />} />
          <Route path="TopDoctors" element={<TopDoctors />} />
        </Route>

        {/* ✅ Route chat doctor */}
        <Route path="/doctor/group-chat" element={<DoctorGroupChat />} />

        {/* 💳 Thanh toán */}
        <Route path="/payment/success" element={<PaymentSuccess />} />
        <Route path="/payment/cancel" element={<PaymentFailedV2 />} />
        <Route path="/payment/options/:id" element={<PaymentOptions />} />
        <Route path="/payment/deposit/:appointmentId" element={<DepositPage />} />
        <Route path="/payment/payfull/:appointmentId" element={<PayfullPage />} />
      </Routes>

      {/* 💬 Chatbot nổi */}
      <ChatBot />
    </SafeRender>
  );
}