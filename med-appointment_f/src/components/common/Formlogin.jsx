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

      // ✅ Lưu user + token vào localStorage
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);

      // ✅ Gắn token vào header mặc định của axios (rất quan trọng)
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      alert("Đăng nhập thành công!");
      navigate("/"); // chuyển trang chính
    } catch (error) {
      console.error("❌ Lỗi đăng nhập:", error);
      alert(
        error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại!"
      );
    }
  };

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="rounded-lg w-[400px] h-[500px] font-semibold shadow-2xl bg-white px-10 flex flex-col justify-center">
        <h1 className="text-blue-300 text-3xl font-bold text-center py-5">
          Đăng nhập
        </h1>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="flex flex-col">
            <label>Email</label>
            <input
              className="rounded-lg outline-1 outline-gray-500 p-2"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required // ✅ thêm required
            />
          </div>

          <div className="flex flex-col">
            <label>Mật khẩu</label>
            <input
              className="rounded-lg outline-1 outline-gray-500 p-2"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required // ✅ thêm required
            />
          </div>

          <button
            className="w-full bg-gray-200 p-2 rounded-lg hover:bg-blue-200"
            type="submit"
          >
            Đăng nhập
          </button>
        </form>

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