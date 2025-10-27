import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";

function FormLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8000/api/login", {
        email,
        password,
      });

      const { user, token } = response.data;

      // ✅ Giữ nguyên: lưu user + token vào localStorage
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);

      // ✅ Gắn token vào header mặc định của axios
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // ✅ Thêm mới: lưu riêng user_id và user_name để hiển thị trong feedback
      localStorage.setItem("user_id", user?.id || "");
      localStorage.setItem("user_name", user?.name || "Người dùng ẩn danh");

      alert("Đăng nhập thành công!");
      navigate("/"); // chuyển trang chính
    } catch (error) {
      console.error("❌ Lỗi đăng nhập:", error);
      alert(
        error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại!"
      );
    }
  };

  // 🧩 Hàm đăng nhập với Google
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8000/auth/google/redirect";
  };

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="rounded-lg w-[400px] h-[550px] font-semibold shadow-2xl bg-white px-10 flex flex-col justify-center space-y-5">
        <h1 className="text-blue-300 text-3xl font-bold text-center py-2">
          Đăng nhập
        </h1>

        {/* Form đăng nhập truyền thống */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="flex flex-col">
            <label>Email</label>
            <input
              className="rounded-lg outline-1 outline-gray-500 p-2"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col">
            <label>Mật khẩu</label>
            <input
              className="rounded-lg outline-1 outline-gray-500 p-2"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            className="w-full bg-gray-200 p-2 rounded-lg hover:bg-blue-200"
            type="submit"
          >
            Đăng nhập
          </button>
        </form>

        {/* 🔹 Nút đăng nhập bằng Google */}
        <div className="flex justify-center mt-2">
          <button
            onClick={handleGoogleLogin}
            className="flex items-center justify-center w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-all"
          >
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="Google logo"
              className="w-5 h-5 mr-2 bg-white rounded-full"
            />
            Đăng nhập với Google
          </button>
        </div>

        {/* 🔹 Nút đăng nhập bằng Facebook */}
        <div className="flex justify-center mt-2">
          <button
            onClick={() =>
              (window.location.href = "http://localhost:8000/auth/facebook/redirect")
            }
            className="flex items-center justify-center w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/1/1b/Facebook_icon.svg"
              alt="Facebook logo"
              className="w-5 h-5 mr-2 bg-white rounded-full"
            />
            Đăng nhập với Facebook
          </button>
        </div>

        {/* Link phụ */}
        <div className="text-center py-5 text-blue-700">
          <button onClick={() => navigate("/forgetPassword")}>
            Quên mật khẩu?
          </button>{" "}
          |{" "}
          <button onClick={() => navigate("/register")}>Đăng ký ngay</button>
        </div>
      </div>
    </div>
  );
}

export default FormLogin;