import React from "react";
import { Routes, Route } from "react-router-dom";

/* ---------------------------------------------
 🧩 Components - Common
----------------------------------------------*/
import Navbar from "./components/common/Navbar";
import Header1 from "./components/common/Header1";
import Header2 from "./components/common/Header2";
import Section1 from "./components/common/section1";
import Section2 from "./components/common/Section2";
import MiniMap from "./components/common/maps";
import Footer from "./components/common/Footer";
import FormService from "./components/common/FormService";

/* ---------------------------------------------
 🧩 Components - Admin
----------------------------------------------*/
import ManagerDoctor from "./components/admin/ManagerDoctor";
import ManagerLichHen from "./components/admin/ManagerLichHen";
import ManagerChuyenKhoa from "./components/admin/ManagerChuyenKhoa";
import ManagerPainet from "./components/admin/ManagerPainet";
import ManagerUser from "./components/admin/ManagerUsers";
import ManagerService from "./components/admin/ManagerService";
import ManagerPosts from "./components/admin/ManagerPosts";
import ManagerHoaDon from "./components/admin/ManagerHoaDon";
import ManagerFeedBack from "./components/admin/ManagerFeedBack";
import ManagerContact from "./components/admin/ManagerContact";
import ManagerWork from "./components/admin/ManagerWork";
import FormDashboard from "./components/admin/FormDashboard";
import AppointmentStats from "./components/admin/AppointmentStats";
import BHYTStatistics from "./components/admin/BHYTStatistics";

/* ---------------------------------------------
 🧩 Components - Doctor
----------------------------------------------*/
import TopDoctors from "./components/doctor/TopDoctors";
import DoctorDetail from "./components/doctor/DoctorDetail";
import DoctorProfile from "./components/doctor/DoctorProfile";

/* ---------------------------------------------
 🧩 Components - Patient
----------------------------------------------*/
import InvoicePayment from "./components/patient/InvoicePayment";
import DepositConfirmation from "./components/patient/DepositConfirmation";

/* ---------------------------------------------
 🌍 Pages - Auth
----------------------------------------------*/
import Login from "./pages/auth/Login";
import PageRegister from "./pages/auth/PageRegister";
import PageForgetPassword from "./pages/auth/PageForgetPassword";

/* ---------------------------------------------
 🌍 Pages - Patient
----------------------------------------------*/
import PageSelectSchedule from "./pages/patient/PageSelectSchedule";
import PageDatLichKhamNhanh from "./pages/patient/PageDatLichKhamNhanh";
import PageDatLichKham from "./pages/patient/PageDatLichKham";
import PageFavoriteDoctors from "./pages/patient/PageFavoriteDoctors";
import PagePatientProfile from "./pages/patient/PagePatientProfile";
import PagePatientHistory from "./pages/patient/PagePatientHistory";

/* ---------------------------------------------
 🌍 Pages - Doctor
----------------------------------------------*/
import PageDoctorTeam from "./pages/doctor/PageDoctorTeam";
import PageDoctorProfile from "./pages/doctor/PageDoctorProfile";
import PageDoctorSchedule from "./pages/doctor/PageDoctorSchedule";

/* ---------------------------------------------
 🌍 Pages - Admin
----------------------------------------------*/
import Dashboard from "./pages/admin/Dashboard";

/* ---------------------------------------------
 🌍 Pages - General
----------------------------------------------*/
import PageContact from "./pages/general/PageContact";
import PagePosts from "./pages/general/PagePosts";
import PostDetail from "./pages/general/PostDetail";

export default function App() {
  return (
    <Routes>
      {/* 🌍 Trang chủ */}
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

      {/* 👩‍⚕️ Doctor pages */}
      <Route path="/doctor" element={<PageDoctorTeam />} />
      <Route path="/doctor/:name" element={<DoctorDetail />} />
      <Route path="/doctorprofile" element={<PageDoctorProfile />} />
      <Route path="/doctorschedule" element={<PageDoctorSchedule />} />

      {/* ✅ Route động: hiển thị profile bác sĩ */}
      <Route path="/doctor/:id/profile" element={<DoctorProfile />} />

      {/* 🧍 Patient pages */}
      <Route path="/deposit" element={<DepositConfirmation />} />
      <Route path="/invoice" element={<InvoicePayment />} />
      <Route path="/selectschedule" element={<PageSelectSchedule />} />
      <Route path="/datlichkhamnhanh" element={<PageDatLichKhamNhanh />} />
      <Route path="/datlichkham" element={<PageDatLichKham />} />
      <Route path="/selectservice" element={<FormService />} />
      <Route path="/favoritedoctors" element={<PageFavoriteDoctors />} />
      <Route path="/patientprofile" element={<PagePatientProfile />} />
      <Route path="/patienthistory" element={<PagePatientHistory />} />

      {/* 🔐 Auth pages */}
      <Route path="/login" element={<Login />} />
      <Route path="/forgetPassword" element={<PageForgetPassword />} />
      <Route path="/register" element={<PageRegister />} />

      {/* 📞 Public pages */}
      <Route path="/contact" element={<PageContact />} />
      <Route path="/blog" element={<PagePosts />} />
      <Route path="/blog/:id" element={<PostDetail />} />

      {/* 🧭 Dashboard (Admin) */}
      <Route path="/dashboard" element={<Dashboard />}>
        <Route index element={<FormDashboard />} />
        <Route path="doctors" element={<ManagerDoctor />} />
        <Route path="schedules" element={<ManagerLichHen />} />
        <Route path="chuyenKhoas" element={<ManagerChuyenKhoa />} />
        <Route path="painets" element={<ManagerPainet />} />
        <Route path="users" element={<ManagerUser />} />
        <Route path="services" element={<ManagerService />} />
        <Route path="posts" element={<ManagerPosts />} />
        <Route path="invoices" element={<ManagerHoaDon />} />
        <Route path="feedbacks" element={<ManagerFeedBack />} />
        <Route path="contacts" element={<ManagerContact />} />
        <Route path="works" element={<ManagerWork />} />
        <Route path="appointmentStats" element={<AppointmentStats />} />
        <Route path="BHYTStatistics" element={<BHYTStatistics />} />
        <Route path="TopDoctors" element={<TopDoctors />} />
      </Route>
    </Routes>
  );
}