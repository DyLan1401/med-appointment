import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Formlogin from "../../components/common/Formlogin";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer"
export default function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);

      // Xác định nguồn login dựa vào URL trước khi redirect
      const previousURL = document.referrer; // URL trước khi tới trang login
      if (previousURL.includes("facebook.com")) {
        toast.success("Đăng nhập Facebook thành công!");
      } else if (previousURL.includes("accounts.google.com")) {
        toast.success("Đăng nhập Google thành công!");
      } else {
        toast.success("Đăng nhập thành công!");
      }

      // Xoá token khỏi URL và điều hướng về trang chính
      window.history.replaceState({}, document.title, "/");
      navigate("/");
    }
  }, [navigate]);


  return (
    <>
      <Navbar />
      <Formlogin />
      <Footer />
    </>
  );
}
