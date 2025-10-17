import React, { useState } from "react";
import axios from "../../api/axios";
import { useNavigate } from "react-router-dom";

function FormRegister() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // 🟢 Cập nhật giá trị form
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // 🟢 Gửi request đăng ký
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      // Gửi POST đến API Laravel
      const res = await axios.post("http://127.0.0.1:8000/api/register", formData, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        }
      });

      // Kiểm tra kết quả trả về
      if (res.status === 201 && res.data.success) {
        setMessage("🎉 Đăng ký thành công! Đang chuyển hướng...");
        setTimeout(() => navigate("/login"), 1500);
      } else {  
        setMessage(res.data.message || "Đăng ký thất bại!");
      }
    } catch (error) {
      console.error("Lỗi đăng ký:", error);

      // Laravel trả lỗi validate (422)
      if (error.response && error.response.status === 422) {
        const errors = error.response.data.errors;
        const firstError = Object.values(errors)[0][0];
        setMessage(firstError);
      } 
      // Laravel trả lỗi server (500)
      else if (error.response && error.response.status === 500) {
        setMessage("❌ Lỗi máy chủ! Vui lòng thử lại sau.");
      } 
      // Không kết nối được API
      else {
        setMessage("⚠️ Không thể kết nối đến server!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex justify-center items-center bg-gray-50">
      <div className="rounded-2xl shadow-2xl bg-white w-[400px] px-10 py-8">
        <h1 className="text-blue-600 text-3xl font-bold text-center mb-6">
          Đăng ký
        </h1>

        {/* Thông báo */}
        {message && (
          <div className="text-center text-sm mb-4 text-red-500">
            {message}
          </div>
        )}

        {/* Form đăng ký */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex flex-col">
            <label className="font-medium">Họ và tên</label>
            <input
              type="text"
              name="name"
              placeholder="Nhập họ và tên..."
              value={formData.name}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="font-medium">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Nhập email..."
              value={formData.email}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="font-medium">Mật khẩu</label>
            <input
              type="password"
              name="password"
              placeholder="Nhập mật khẩu..."
              value={formData.password}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full p-2 rounded-lg text-white font-semibold transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {loading ? "Đang xử lý..." : "Đăng ký"}
          </button>
        </form>

        <div className="text-center mt-5 text-blue-700">
          <button onClick={() => navigate("/login")}>
            Đã có tài khoản? | Đăng nhập
          </button>
        </div>
      </div>
    </div>
  );
}

export default FormRegister;