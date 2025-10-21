import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Formlogin from "../../components/common/Formlogin";
import Navbar from "../../components/common/Navbar";

export default function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    // 🧩 Kiểm tra xem URL có chứa token không
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      // ✅ Lưu token vào localStorage
      localStorage.setItem("token", token);

      // (Tuỳ chọn) gọi API để lấy thông tin user nếu muốn
      // hoặc chuyển hướng về trang chủ
      alert("Đăng nhập Google thành công!");
      navigate("/"); // chuyển về trang chính
    }
  }, [navigate]);

  return (
    <>
      <Navbar />
      <Formlogin />
    </>
  );
}
