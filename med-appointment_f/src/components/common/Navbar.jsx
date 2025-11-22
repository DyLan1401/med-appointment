"use client";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Bell, X } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import logo from "../../assets/logo.jpg";

export default function Navbar() {
  const navigate = useNavigate();

  const [language, setLanguage] = useState("EN");
  const [openLang, setOpenLang] = useState(false);
  const [openUser, setOpenUser] = useState(false);
  const [openDoctor, setOpenDoctor] = useState(false);
  const [user, setUser] = useState(null);
  const [doctorId, setDoctorId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Thông báo
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // 🩺 Lấy doctor_id tương ứng nếu user là bác sĩ
  useEffect(() => {
    const loadDoctorId = async () => {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser?.role === "doctor") {
        try {
          const res = await axios.get(
            `http://localhost:8000/api/doctors?email=${storedUser.email}`
          );
          if (res.data?.data && res.data.data.length > 0) {
            const doctor = res.data.data.find(
              (d) => d.user.email === storedUser.email
            );
            if (doctor) setDoctorId(doctor.id);
          }
        } catch (error) {
          // Silent error - không cần thông báo
        }
      }
    };
    loadDoctorId();
  }, []);

  // Lấy thông tin user
  useEffect(() => {
    const loadUser = () => {

      const storedUser = localStorage.getItem("user");

      if (storedUser) setUser(JSON.parse(storedUser));
      else setUser(null);
    };

    loadUser();
    window.addEventListener("storage", loadUser);
    return () => window.removeEventListener("storage", loadUser);
  }, []);

  // Lấy thông báo từ API Laravel
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("patient"));
        const patientId =
          (user && user.id) || localStorage.getItem("patient_id_temp");

        if (!patientId) return;

        const res = await axios.get(
          `http://localhost:8000/api/notes/${patientId}`
        );

        const mapped = res.data.map((note) => ({
          id: note.id,
          title: note.title || "Ghi chú từ Admin",
          time: new Date(note.created_at).toLocaleString(),
          is_read: note.is_read,
        }));

        setNotifications(mapped);
      } catch (err) {
        // Silent error - không cần thông báo
      }
    };

    fetchNotes();
    const interval = setInterval(fetchNotes, 30000);
    return () => clearInterval(interval);
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

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim() === "") return;
    navigate(`/doctor?search=${encodeURIComponent(searchTerm.trim())}`);
    setSearchTerm("");
  };
  return (
    <div className="w-full bg-white shadow-md top-0  sticky z-50 animate-fadeIn ">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-3 font-semibold">
        {/* Logo */}
        <div
          onClick={() => navigate("/")}
          className="flex items-center cursor-pointer hover:scale-105 transition-transform"
        >
          <img src={logo} alt="Logo" className="w-12 h-12 object-contain mr-2" />
          <span className="text-2xl font-bold text-blue-600 hidden sm:block">
            MedCare
          </span>
        </div>

        {/* Menu trung tâm */}
        <div className="flex items-center space-x-8">
          {["Trang chủ", "Liên hệ", "Bài viết", "Bác sĩ", "Đặt lịch khám"].map(
            (label, i) => {
              if (label === "Bác sĩ") {
                return (
                  <div
                    key={i}
                    className="relative"
                    onMouseEnter={() => setOpenDoctor(true)}
                    onMouseLeave={() => setOpenDoctor(false)}
                  >
                    <button className="text-gray-700 hover:text-blue-500 cursor-pointer transition">
                      {label} ▾
                    </button>

                    {openDoctor && (
                      <div className="absolute top-full left-0 bg-white shadow-lg border rounded-lg w-48 z-50 animate-fadeIn">
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

              return (
                <div
                  key={i}
                  onClick={() => {
                    if (label === "Trang chủ") navigate("/");
                    else if (label === "Liên hệ") navigate("/contact");
                    else if (label === "Bài viết") navigate("/blog");
                    else if (label === "Đặt lịch khám")
                      navigate("/selectschedule");
                  }}
                  className="text-gray-700 hover:text-blue-500 cursor-pointer transition"
                >
                  {label}
                </div>
              );
            }
          )}
        </div>

        {/* Search + Ngôn ngữ + Thông báo + User */}
        <div className="flex items-center space-x-5 relative">
          {/* Tìm kiếm */}
          <form
            onSubmit={handleSearch}
            className="flex items-center bg-gray-100 rounded-full px-3 py-1 shadow-sm border border-gray-200 focus-within:ring-2 focus-within:ring-blue-400 transition animate-fadeIn"
          >
            <input
              type="text"
              placeholder="Tìm bác sĩ hoặc chuyên khoa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent outline-none text-sm px-2 w-44 sm:w-56"
            />
            <button
              type="submit"
              className="text-gray-500 hover:text-blue-600 transition"
            >
              <Search size={18} />
            </button>
          </form>

          {/* Ngôn ngữ */}
          <div className="relative z-50">
            <button
              onClick={() => setOpenLang(!openLang)}
              className="p-2 bg-gray-500 text-white rounded-2xl flex items-center space-x-1 hover:bg-gray-600 transition"
            >
              <span>{language}</span>
              <svg
                className={`w-4 h-4 transition-transform duration-200 ${openLang ? "rotate-180" : ""
                  }`}
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
              <div className="absolute right-0 mt-2 w-24 bg-white rounded-lg shadow-lg border border-gray-200 animate-fadeIn">
                <button
                  onClick={() => handleLanguageChange("EN")}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  English
                </button>
                <button
                  onClick={() => handleLanguageChange("VI")}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Tiếng Việt
                </button>
              </div>
            )}
          </div>

          {/* 🔔 Thông báo */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-full hover:bg-gray-200 transition"
            >
              <Bell className="w-6 h-6 text-gray-700" />
              {notifications.length > 0 && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                  {notifications.filter((n) => !n.is_read).length}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white shadow-xl rounded-lg overflow-hidden border border-gray-200 z-50 animate-fadeIn">
                <div className="flex justify-between items-center px-4 py-2 bg-blue-600 text-white">
                  <span className="font-semibold">Thông báo từ hệ thống</span>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="hover:text-gray-200"
                  >
                    <X size={18} />
                  </button>
                </div>

                {notifications.length === 0 ? (
                  <div className="p-4 text-gray-500 text-center">
                    Không có thông báo
                  </div>
                ) : (
                  <ul className="max-h-64 overflow-y-auto">
                    {notifications.map((n) => (
                      <li
                        key={n.id}
                        onClick={() => {
                          setShowNotifications(false);
                          const user = JSON.parse(localStorage.getItem("user"));
                          if (user?.id) navigate(`/notifications/${user.id}`);
                          else toast.warning("Không tìm thấy thông tin bệnh nhân!");
                        }}
                        className={`px-4 py-3 hover:bg-gray-50 border-b border-gray-100 cursor-pointer ${n.is_read ? "bg-gray-50" : "bg-blue-50"
                          }`}
                      >
                        <p className="text-gray-800 font-medium">{n.title}</p>
                        <p className="text-gray-500 text-xs">{n.time}</p>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="px-4 py-2 text-center bg-gray-50 border-t">
                  <button
                    onClick={() => {
                      setShowNotifications(false);
                      const user = JSON.parse(localStorage.getItem("user"));
                      if (user?.id) navigate(`/notifications/${user.id}`);
                      else toast.warning("Không tìm thấy thông tin bệnh nhân!");
                    }}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Xem tất cả thông báo
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 👤 User */}
          {!user ? (
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-2 rounded-2xl bg-blue-600 text-white hover:bg-blue-700 transition animate-fadeIn"
            >
              Đăng nhập
            </button>
          ) : (
            <div className="relative z-50">
              <button
                onClick={() => setOpenUser(!openUser)}
                className="p-2 bg-blue-500 text-white rounded-2xl"
              >
                {user.name}
              </button>

              {openUser && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg border border-gray-200 animate-fadeIn">
                  <button
                    onClick={() => {
                      setOpenUser(false);
                      const u = JSON.parse(localStorage.getItem("user"));
                      if (u?.id) navigate(`/notifications/${u.id}`);
                      else toast.warning("Không tìm thấy thông tin bệnh nhân!");
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
                        onClick={() => {
                          setOpenUser(false);
                          if (doctorId) navigate(`/doctorprofile/${doctorId}`);
                          else navigate("/doctorprofile");
                        }}
                        className="block w-full px-4 py-2 hover:bg-gray-100 text-left"
                      >
                        Hồ sơ bác sĩ
                      </button>
                      <button
                        onClick={() => navigate("/doctorschedule")}
                        className="block w-full px-4 py-2 hover:bg-gray-100 text-left"
                      >
                        Lịch làm việc
                      </button>
                    </>
                  )}

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
      <marquee behavior="scroll" direction="left" scrollamount="4" className="bg-amber-200 font-bold text-lg">
        🌹Tận tâm chăm sóc, nhiệt tình lắng nghe🌹 - 🌹Chăm sóc tận tình, hết mình vì sức khỏe🌹 - 🌹Hãy từ bỏ thuốc lá trước khi quá muộn🌹
      </marquee>
    </div>
  );
}