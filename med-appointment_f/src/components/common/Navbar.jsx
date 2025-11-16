"use client";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Bell, X } from "lucide-react";
import dayjs from "dayjs";
import { socket } from "../../socket.js";
import logo from "../../assets/logo.jpg";
import  API  from "../../api/axios.js";

export default function Navbar() {
  const navigate = useNavigate();

  const [language, setLanguage] = useState("EN");
  const [openLang, setOpenLang] = useState(false);
  const [openUser, setOpenUser] = useState(false);
  const [openDoctor, setOpenDoctor] = useState(false);
  const [user, setUser] = useState(null);
  const [doctorId, setDoctorId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // =====================================================
  // 1️⃣ LẤY USER ĐÚNG TỪ LOCALSTORAGE
  // =====================================================
  // useEffect(() => {
  //   const doctorUser = JSON.parse(localStorage.getItem("doctor_user") || "null");
  //   const adminUser = JSON.parse(localStorage.getItem("admin_user") || "null");
  //   const normalUser = JSON.parse(localStorage.getItem("user") || "null");
  //   const patientId = (user && user.id) || localStorage.getItem("patient_id_temp");
  //   const user = JSON.parse(localStorage.getItem("patient"));

  // })

  // Lấy thông tin user
  useEffect(() => {
    const loadUser = () => {
    
      const storedUser = localStorage.getItem("user");
   
      if (storedUser) setUser(JSON.parse(storedUser));
      else setUser(null);

    const currentUser = doctorUser || adminUser || normalUser;
    setUser(currentUser?.user || null);
    }
    const handleStorage = () => {
      const d = JSON.parse(localStorage.getItem("doctor_user") || "null");
      const a = JSON.parse(localStorage.getItem("admin_user") || "null");
      const u = JSON.parse(localStorage.getItem("user") || "null");
      setUser((d?.user || a?.user || u?.user) || null);

    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);


  // =====================================================
  // 2️⃣ LOAD DOCTOR ID
  // =====================================================
  useEffect(() => {
    const doctorUser = JSON.parse(localStorage.getItem("doctor_user") || "null");
    if (doctorUser?.doctor?.id) setDoctorId(doctorUser.doctor.id);
  }, []);

  // =====================================================
  // 3️⃣ LOAD THÔNG BÁO — THEO USER ROLE
  // =====================================================
  useEffect(() => {
    const loadNotifications = async () => {

      try {


        const doctorUser = JSON.parse(localStorage.getItem("doctor_user") || "null");
        const adminUser = JSON.parse(localStorage.getItem("admin_user") || "null");
        const normalUser = JSON.parse(localStorage.getItem("user") || "null");


        const current = doctorUser || adminUser || normalUser;
        if (!current?.token || !current?.user?.id) return;

        // Gắn token đúng theo role
        API.defaults.headers.common["Authorization"] = `Bearer ${current.token}`;

        const patientId = current.user.id;
        const res = await API.get(`/notes/${patientId}`);

        const mapped = res.data.map((n) => ({
          id: n.id,
          title: n.title || "Thông báo mới",
          time: new Date(n.created_at).toLocaleString(),
          is_read: n.is_read,
        }));

        setNotifications(mapped);
      } catch (err) {
        console.error("Lỗi khi load thông báo:", err);
      }
    };

    loadNotifications();
    const interval = setInterval(loadNotifications, 15000);
    return () => clearInterval(interval);
  }, []);

  // =====================================================
  // 4️⃣ SOCKET CHO BÁC SĨ THEO NHÓM CHUYÊN KHOA
  // =====================================================
  useEffect(() => {
    if (!user || user.role !== "doctor") return;

    const groups = JSON.parse(localStorage.getItem("doctor_groups") || "[]");
    const channels = groups.map((gid) => socket.channel(`chat-group.${gid}`));

    channels.forEach((ch) => {
      ch.listen(".message.new", (payload) => {
        setNotifications((prev) => [
          {
            id: payload.id,
            title: `${payload.sender_name}: ${payload.content}`,
            time: dayjs(payload.created_at).format("HH:mm DD/MM"),
            is_read: false,
          },
          ...prev,
        ]);
      });
    });

    return () => channels.forEach((c) => c.stopListening(".message.new"));
  }, [user]);

  // =====================================================
  // 5️⃣ LOGOUT CHUẨN — XÓA TOKEN ĐÚNG ROLE
  // =====================================================
  const handleLogout = () => {
    localStorage.removeItem("doctor_user");
    localStorage.removeItem("admin_user");
    localStorage.removeItem("user");

    // Token bác sĩ
    localStorage.removeItem("doctor_token");
    localStorage.removeItem("doctor_groups");

    setUser(null);
    navigate("/login");
  };

  // =====================================================
  // 6️⃣ SEARCH BÁC SĨ
  // =====================================================
  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    navigate(`/doctor?search=${encodeURIComponent(searchTerm.trim())}`);
  };

console.log("user in navbar:", user);


  // =====================================================
  // 7️⃣ MỞ NHÓM CHAT CHUYÊN KHOA
  // =====================================================
  const handleOpenGroupChat = () => {
    const doctorUser = JSON.parse(localStorage.getItem("doctor_user") || "null");

    const departmentId = doctorUser?.user?.id;

    if (!departmentId) {
      alert("Không tìm thấy chuyên khoa của bác sĩ!");
      return;
    }

    navigate(`/doctor/group-chat?department_id=${departmentId}`);
  };

  // =====================================================
  // 8️⃣ JSX RENDER
  // =====================================================

  return (
    <div className="w-full bg-white shadow-md fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-3">

        {/* LOGO */}
        <div
          onClick={() => navigate("/")}
          className="flex items-center cursor-pointer hover:scale-105 transition"
        >
          <img src={logo} className="w-12 h-12 object-contain mr-2" />
          <span className="text-2xl font-bold text-blue-600 hidden sm:block">
            MedCare
          </span>
        </div>

        {/* MENU */}
        <div className="flex items-center space-x-8">
          <div onClick={() => navigate("/")} className="cursor-pointer hover:text-blue-500">Trang chủ</div>
          <div onClick={() => navigate("/contact")} className="cursor-pointer hover:text-blue-500">Liên hệ</div>
          <div onClick={() => navigate("/blog")} className="cursor-pointer hover:text-blue-500">Bài viết</div>

          {/* Dropdown Bác sĩ */}
          <div
            className="relative"
            onMouseEnter={() => setOpenDoctor(true)}
            onMouseLeave={() => setOpenDoctor(false)}
          >
            <button className="hover:text-blue-500">Bác sĩ ▾</button>
            {openDoctor && (
              <div className="absolute bg-white shadow-xl w-48 rounded-md border z-50">
                <button onClick={() => navigate("/doctor")} className="w-full text-left px-4 py-2 hover:bg-gray-100">Tất cả bác sĩ</button>
                <button onClick={() => navigate("/favoritedoctors")} className="w-full text-left px-4 py-2 hover:bg-gray-100">Bác sĩ yêu thích</button>
              </div>
            )}
          </div>

          <div onClick={() => navigate("/selectschedule")} className="cursor-pointer hover:text-blue-500">Đặt lịch khám</div>
        </div>

        {/* SEARCH + USER */}
        <div className="flex items-center space-x-5 relative">

          {/* SEARCH */}
          <form onSubmit={handleSearch} className="bg-gray-100 border px-3 py-1 rounded-full flex items-center">
            <input
              className="bg-transparent outline-none px-2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm bác sĩ..."
            />
            <Search size={18} />
          </form>

          {/* NOTIFICATIONS */}
          <div className="relative">
            <button onClick={() => setShowNotifications(!showNotifications)} className="p-2 hover:bg-gray-200 rounded-full">
              <Bell />
              {notifications.filter((n) => !n.is_read).length > 0 && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full px-1">
                  {notifications.filter((n) => !n.is_read).length}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 bg-white w-80 shadow-xl rounded-lg border z-50">
                <div className="flex justify-between px-4 py-2 bg-blue-600 text-white">
                  <span>Thông báo</span>
                  <X onClick={() => setShowNotifications(false)} className="cursor-pointer" />
                </div>

                {notifications.length === 0 ? (
                  <div className="p-4 text-gray-500">Không có thông báo</div>
                ) : (
                  <ul className="max-h-64 overflow-y-auto">
                    {notifications.map((n) => (
                      <li key={n.id} className="px-4 py-2 border-b hover:bg-gray-100 cursor-pointer">
                        <div className="font-medium">{n.title}</div>
                        <div className="text-xs text-gray-500">{n.time}</div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          {/* USER MENU */}
          {!user ? (
            <button onClick={() => navigate("/login")} className="px-4 py-2 bg-blue-600 text-white rounded-xl">
              Đăng nhập
            </button>
          ) : (
            <div className="relative">
              <button onClick={() => setOpenUser(!openUser)} className="px-4 py-2 bg-blue-500 rounded-xl text-white">
                {user.name}
              </button>

              {openUser && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg border border-gray-200 animate-fadeIn">
                  <button
                    onClick={() => {
                      setOpenUser(false);
                      const u = JSON.parse(localStorage.getItem("user"));
                      if (u?.id) navigate(`/notifications/${u.id}`);
                      else alert("Không tìm thấy thông tin bệnh nhân!");
                    }}
                    className="block w-full px-4 py-2 hover:bg-gray-100 text-left text-blue-600"
                  >
                    🔔 Thông báo từ hệ thống
                  </button>

                  {user.role === "patient" && (
                    <>
                      <button
                        onClick={() => navigate("/patientprofile")}
                        className="block w-full px-4 py-2 hover:bg-gray-100 text-left"
                      >
                        Hồ sơ cá nhân
                      </button>
                      <button
                        onClick={() => navigate("/patienthistory")}
                        className="block w-full px-4 py-2 hover:bg-gray-100 text-left"
                      >
                        Lịch sử khám bệnh
                      </button>
                      <button
                        onClick={() => navigate("/changepassword")}
                        className="block w-full px-4 py-2 hover:bg-gray-100 text-left"
                      >
                        Đổi mật khẩu
                      </button>
                    </>
                  )}

                  {user.role === "doctor" && (
                    <>
                      <button
                        onClick={() => navigate(`/doctorprofile/${doctorId}`)}
                        className="w-full px-4 py-2 hover:bg-gray-100 text-left"
                      >
                        🩺 Hồ sơ bác sĩ
                      </button>

                      <button
                        onClick={() => navigate("/doctorschedule")}
                        className="w-full px-4 py-2 hover:bg-gray-100 text-left"
                      >
                        🗓️ Lịch làm việc
                      </button>

                      <button
                        onClick={handleOpenGroupChat}
                        className="w-full px-4 py-2 hover:bg-gray-100 text-left text-blue-600"
                      >
                        💬 Nhóm Chat Chuyên Khoa
                      </button>
                    </>
                  )}

                  {user.role === "user" && (
                    <>
                      <button onClick={() => navigate("/patientprofile")} className="w-full px-4 py-2 hover:bg-gray-100 text-left">
                        👤 Hồ sơ cá nhân
                      </button>
                      <button onClick={() => navigate("/patienthistory")} className="w-full px-4 py-2 hover:bg-gray-100 text-left">
                        📋 Lịch sử khám
                      </button>
                    </>
                  )}

                  {user.role === "admin" && (
                    <button onClick={() => navigate("/dashboard")} className="w-full px-4 py-2 hover:bg-gray-100 text-left">
                      📊 Dashboard
                    </button>
                  )}

                  <button onClick={handleLogout} className="w-full px-4 py-2 hover:bg-gray-100 text-left text-red-600">
                    ↩️ Thoát
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )};