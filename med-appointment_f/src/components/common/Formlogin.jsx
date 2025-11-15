import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";

// ✅ Thêm import react-toastify
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function FormLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // lấy token và thông tin user từ URL sau khi đăng nhập xã hội (Google/Facebook)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      (async () => {
        try {
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          const res = await axios.get("http://localhost:8000/api/user");

          localStorage.setItem("user", JSON.stringify(res.data));
          localStorage.setItem("token", token);

          // 🔔 Bắn sự kiện để Navbar biết có user mới
          window.dispatchEvent(new Event("storage"));

          navigate("/");
        } catch (err) {
          console.error("Lỗi khi lấy thông tin user:", err);
        }
      })();
    }
  }, []);


  // ===========================
  // ✅ Hàm xử lý đăng nhập
  // ===========================
  const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const response = await axios.post("http://localhost:8000/api/login", {
      email,
      password,
    });

    const { user, token, role, doctor_id } = response.data; // ✅ lấy doctor_id từ backend

    // Lưu vào localStorage
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);

<<<<<<< HEAD
      // ✅ Gắn token vào header mặc định của axios
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // ✅ Thêm mới: lưu riêng user_id và user_name để hiển thị trong feedback
      localStorage.setItem("user_id", user?.id || "");
      localStorage.setItem("user_name", user?.name || "Người dùng ẩn danh");

      alert("Đăng nhập thành công!");
      navigate("/"); // chuyển trang chính      // ✅ Hiển thị thông báo thành công
      toast.success("🎉 Đăng nhập thành công!", {
        position: "top-center",
        autoClose: 1500,
      });

      // ✅ Điều hướng theo role
      setTimeout(() => {
        if (role === "admin") {
          navigate("/dashboard"); // 👉 Trang quản trị hệ thống
        } else if (role === "doctor") {
          navigate("/doctor/dashboard"); // 👉 Trang quản lý của bác sĩ
        } else {
          navigate("/"); // 👉 Trang người dùng bình thường
        }
      }, 1500);

    } catch (error) {
      console.error("❌ Lỗi đăng nhập:", error);

      // ✅ Hiển thị thông báo lỗi
      toast.error(
        error.response?.data?.message ||
        "❌ Có lỗi xảy ra, vui lòng thử lại!",
        {
          position: "top-center",
          autoClose: 3000,
        }
      );
=======
    // ✅ Lưu riêng doctor_id nếu role là doctor
    if (role === "doctor" && doctor_id) {
      localStorage.setItem("doctor_id", doctor_id);
>>>>>>> DinhThanhToan/6-QuanLyLichRanhDoctor
    }

    // Gắn token mặc định cho axios
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    toast.success("🎉 Đăng nhập thành công!", { position: "top-center", autoClose: 1500 });

    // Điều hướng theo role
    setTimeout(() => {
      if (role === "admin") navigate("/dashboard");
      else if (role === "doctor") navigate("/doctor/dashboard");
      else navigate("/");
    }, 1500);
  } catch (error) {
    toast.error(error.response?.data?.message || "❌ Đăng nhập thất bại", {
      position: "top-center",
      autoClose: 3000,
    });
  }
};

  // 🧩 Hàm đăng nhập với Google

  // ===========================
  // 🧩 Đăng nhập bằng Google
  // ===========================
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
            (window.location.href =
              "http://localhost:8000/auth/facebook/redirect")
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

      {/* ✅ Thêm container hiển thị toast */}
      <ToastContainer />
    </div>
  );
}

export default FormLogin;
