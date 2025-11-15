// =====================================================
// 🧩 FormLogin.jsx — FULL FIX 2025
// ➤ Hỗ trợ login bác sĩ / admin
// ➤ Lưu token theo chuẩn Navbar.jsx
// ➤ Giữ đăng nhập sau khi F5
// ➤ Tự động load nhóm chat của bác sĩ
// =====================================================

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API, { login, getTokenUser } from "../../api/axios";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function FormLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // =====================================================
  // 🔁 CALLBACK LOGIN GOOGLE / FACEBOOK
  // =====================================================
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      (async () => {
        try {
          API.defaults.headers.common["Authorization"] = `Bearer ${token}`;

          const res = await getTokenUser();

          // Lưu theo chuẩn user thường
          localStorage.setItem(
            "user",
            JSON.stringify({
              user: res.data.user,
              token,
            })
          );

          window.dispatchEvent(new Event("storage"));
          navigate("/");
        } catch (err) {
          console.error("❌ Social Login Error:", err);
        }
      })();
    }
  }, []);

  // =====================================================
  // ✳️ LOGIN EMAIL + PASSWORD
  // =====================================================
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await login(email, password);

      const user = res.user;
      const doctor = res.doctor;
      const token = res.token;

      // =====================================================
      // 🧹 XÓA SẠCH KEY CŨ
      // =====================================================
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("admin_user");
      localStorage.removeItem("doctor_user");

      // =====================================================
      // 💾 LƯU THEO CHUẨN Navbar.jsx
      // =====================================================
      if (user.role === "doctor") {
        localStorage.setItem(
          "doctor_user",
          JSON.stringify({
            user,
            doctor,
            token,
          })
        );

        localStorage.setItem("doctor_token", token);
      } else if (user.role === "admin") {
        localStorage.setItem(
          "admin_user",
          JSON.stringify({
            user,
            token,
          })
        );

        localStorage.setItem("admin_token", token);
      } else {
        // User thường
        localStorage.setItem(
          "user",
          JSON.stringify({
            user,
            token,
          })
        );

        localStorage.setItem("token", token);
      }

      // Quan trọng: set token ngay lập tức
      API.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      toast.success(`🎉 Xin chào ${user.name}!`, {
        position: "top-center",
        autoClose: 1200,
      });

      // =====================================================
      // 📡 DOCTOR — LẤY DANH SÁCH GROUP CHAT
      // =====================================================
      if (user.role === "doctor") {
        try {
          const doctorToken = localStorage.getItem("doctor_token");

          API.defaults.headers.common["Authorization"] = `Bearer ${doctorToken}`;

          const result = await API.get("/doctor/groups");

          const groups = result.data.data || [];

          localStorage.setItem("doctor_groups", JSON.stringify(groups));
        } catch (err) {
          console.error("❌ Lỗi lấy nhóm:", err);
        }
      }

      // =====================================================
      // 🚀 ĐIỀU HƯỚNG
      // =====================================================
      setTimeout(() => {
        if (user.role === "admin") navigate("/dashboard");
        else if (user.role === "doctor") navigate("/doctor/dashboard");
        else navigate("/");
      }, 1200);
    } catch (err) {
      console.error("❌ Login Error:", err);

      toast.error(
        err.response?.data?.message || "Sai email hoặc mật khẩu!",
        { position: "top-center", autoClose: 2000 }
      );
    }
  };

  // =====================================================
  // 🌐 SOCIAL LOGIN
  // =====================================================
  const handleGoogleLogin = () => {
    window.location.href = "http://127.0.0.1:8000/auth/google/redirect";
  };

  const handleFacebookLogin = () => {
    window.location.href = "http://127.0.0.1:8000/auth/facebook/redirect";
  };

  // =====================================================
  // 🎨 UI FORM LOGIN
  // =====================================================
  return (
    <div className="w-full h-screen flex justify-center items-center bg-gray-100">
      <div className="rounded-2xl w-[400px] h-[600px] font-semibold shadow-2xl bg-white px-10 flex flex-col justify-center space-y-5">
        <h1 className="text-blue-500 text-3xl font-bold text-center py-2">
          Đăng nhập
        </h1>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="flex flex-col">
            <label>Email</label>
            <input
              className="rounded-lg outline outline-gray-300 focus:outline-blue-400 p-2"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col">
            <label>Mật khẩu</label>
            <input
              className="rounded-lg outline outline-gray-300 focus:outline-blue-400 p-2"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            className="w-full bg-blue-200 p-2 rounded-lg hover:bg-blue-400 transition-all"
            type="submit"
          >
            Đăng nhập
          </button>
        </form>

        {/* GOOGLE */}
        <button
          onClick={handleGoogleLogin}
          className="flex items-center justify-center w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-all"
        >
          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            className="w-5 h-5 mr-2 bg-white rounded-full"
          />
          Đăng nhập với Google
        </button>

        {/* FACEBOOK */}
        <button
          onClick={handleFacebookLogin}
          className="flex items-center justify-center w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all"
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/1/1b/Facebook_icon.svg"
            className="w-5 h-5 mr-2 bg-white rounded-full"
          />
          Đăng nhập với Facebook
        </button>

        <div className="text-center py-4 text-blue-700">
          <button onClick={() => navigate("/forgetPassword")}>
            Quên mật khẩu?
          </button>
          {" | "}
          <button onClick={() => navigate("/register")}>Đăng ký ngay</button>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}