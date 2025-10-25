/* ---------------------------------------------
 🌍 App.jsx
----------------------------------------------*/
import React from "react";
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

/* 🧩 Trang yêu thích bác sĩ */
import LikeDoctor from "./components/doctor/LikeDoctor";

/* 🧩 Các trang khác */
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

/* ✅ Các trang quản lý admin */
import ManagerDoctor from "./components/admin/ManagerDoctor";
import ManagerLichHen from "./components/admin/ManagerLichHen";
import ManagerChuyenKhoa from "./components/admin/ManagerChuyenKhoa";
import ManagerPainet from "./components/admin/ManagerPainet";
import ManagerUser from "./components/admin/ManagerUsers";
import ManagerService from "./components/admin/ManagerService";
import ManagerCategoriesPost from "./components/admin/ManagerCategoriesPost";
import ManagerPosts from "./components/admin/ManagerPosts";
import ManagerHoaDon from "./components/admin/ManagerHoaDon";
import ManagerFeedBack from "./components/admin/ManagerFeedBack";
import ManagerContact from "./components/admin/ManagerContact";
import ManagerBanners from "./components/admin/ManagerBanner";
import ManagerWork from "./components/admin/ManagerWork";
import AppointmentStats from "./components/admin/AppointmentStats";
import BHYTStatistics from "./components/admin/BHYTStatistics";
import TopDoctors from "./components/doctor/TopDoctors";

/* ✅ Thêm mới component hiển thị ghi chú theo ID */
import PatientNotes from "./components/common/PatientNotes"; // ← thêm dòng này


import PaymentSuccess from "./components/payment/paysuccess";
import PaymentFailedV2 from "./components/payment/paycancel";
export default function App() {
  return (
    <Routes>
      {/* Trang chủ */}
      <Route
        path="/"
        element={
          <div className="w-full h-full px-1 space-y-8">
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

      {/* Trang bác sĩ */}
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

      {/* Chi tiết bác sĩ */}
      <Route path="/doctor/:name" element={<DoctorDetail />} />
      <Route path="/doctor/:id/profile" element={<DoctorProfile />} />
      <Route path="/doctorschedule" element={<PageDoctorSchedule />} />

      {/* Trang yêu thích */}
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

      {/* Patient */}
      <Route path="/deposit" element={<DepositConfirmation />} />
      <Route path="/invoice" element={<InvoicePayment />} />
      <Route path="/favoritedoctors" element={<PageFavoriteDoctors />} />
      <Route path="/patientprofile" element={<PagePatientProfile />} />
      <Route path="/patienthistory" element={<PagePatientHistory />} />

      {/* ✅ Trang thông báo bệnh nhân (toàn bộ) */}
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

      {/* ✅ Trang hiển thị ghi chú theo ID bệnh nhân */}
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

      {/* Đặt lịch & đăng nhập */}
      <Route path="/login" element={<Login />} />
      <Route path="/forgetPassword" element={<PageForgetPassword />} />
      <Route path="/changepassword" element={<PageChangePassword />} />
      <Route path="/register" element={<PageRegister />} />
      <Route path="/selectschedule" element={<PageSelectSchedule />} />
      <Route path="/datlichkhamnhanh" element={<PageDatLichKhamNhanh />} />
      <Route path="/datlichkham" element={<PageDatLichKham />} />
      <Route path="/selectservice" element={<FormService />} />

      {/* Public pages */}
      <Route path="/contact" element={<PageContact />} />
      <Route path="/blog" element={<PagePosts />} />
      <Route path="/blog/:id" element={<PostDetail />} />

      {/* Dashboard */}
      <Route path="/dashboard" element={<Dashboard />}>
        <Route index element={<FormDashboard />} />
        <Route path="doctors" element={<ManagerDoctor />} />
        <Route path="schedules" element={<ManagerLichHen />} />
        <Route path="chuyenKhoas" element={<ManagerChuyenKhoa />} />
        <Route path="painets" element={<ManagerPainet />} />
        <Route path="users" element={<ManagerUser />} />
        <Route path="services" element={<ManagerService />} />
        <Route path="categories" element={<ManagerCategoriesPost />} />
        <Route path="posts" element={<ManagerPosts />} />
        <Route path="invoices" element={<ManagerHoaDon />} />
        <Route path="feedbacks" element={<ManagerFeedBack />} />
        <Route path="contacts" element={<ManagerContact />} />
        <Route path="banners" element={<ManagerBanners />} />
        <Route path="works" element={<ManagerWork />} />
        <Route path="appointmentStats" element={<AppointmentStats />} />
        <Route path="BHYTStatistics" element={<BHYTStatistics />} />
        <Route path="TopDoctors" element={<TopDoctors />} />
      </Route>


       <Route path="/payment/success" element={<PaymentSuccess />} />
       <Route path="/payment/cancel" element={<PaymentFailedV2 />} />
    </Routes>
  );
}