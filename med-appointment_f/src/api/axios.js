// ===================================================== 
// 🧩 axios.js — Cấu hình Axios cho React + Laravel Sanctum
// FE: http://localhost:5173
// BE: http://127.0.0.1:8000
// =====================================================

import axios from "axios";

// =====================================================
// 🌐 CẤU HÌNH CƠ BẢN TOÀN CỤC
// =====================================================

// Cho phép gửi cookie cross-origin
axios.defaults.withCredentials = true;

// Base URL backend Laravel
export const API_BASE_URL = "http://127.0.0.1:8000";

// =====================================================
// ⚙️ TẠO INSTANCE CHÍNH CHO /api
// =====================================================
export const API = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

// =====================================================
// ⚙️ INSTANCE KHÁC — TỰ GẮN TOKEN
// =====================================================
export const API_WITH_TOKEN = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  withCredentials: true,
});

// Gắn token tự động
API_WITH_TOKEN.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("doctor_token") ||
    localStorage.getItem("admin_token");

  if (token) config.headers.Authorization = `Bearer ${token}`;
  config.headers["X-Requested-With"] = "XMLHttpRequest";
  return config;
});

// =====================================================
// 🧩 CSRF CHO SANCTUM
// =====================================================
export async function initSanctum() {
  try {
    await axios.get(`${API_BASE_URL}/sanctum/csrf-cookie`, {
      withCredentials: true,
    });
    console.log("✅ CSRF cookie initialized (Sanctum ready)");
  } catch (error) {
    console.error("❌ Lỗi khi khởi tạo Sanctum:", error);
  }
}

// =====================================================
// 🔐 LOGIN TOKEN-BASED — phiên bản CHÍNH XÁC
// =====================================================
export async function login(email, password) {
  try {
    const res = await axios.post(`${API_BASE_URL}/api/token-login`, {
      email,
      password,
    });

    const { token, user } = res.data;

    // Gắn token vào instance chung
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    // Trả về đúng cấu trúc FormLogin.jsx cần
    return { token, user };
  } catch (error) {
    console.error("❌ Lỗi token-login:", error.response?.data || error);
    throw error;
  }
}

// =====================================================
// 🚪 LOGOUT TOKEN
// =====================================================
export async function logout() {
  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("doctor_token") ||
    localStorage.getItem("admin_token");

  try {
    await axios.post(
      `${API_BASE_URL}/api/token-logout`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      }
    );

    console.log("👋 Đã logout token thành công");
  } catch (err) {
    console.warn("⚠️ Lỗi khi token logout:", err);
  } finally {
    localStorage.removeItem("token");
    localStorage.removeItem("doctor_token");
    localStorage.removeItem("admin_token");
    localStorage.removeItem("user");

    delete API.defaults.headers.common["Authorization"];
  }
}

// =====================================================
// 🧾 LẤY USER HIỆN TẠI TỪ TOKEN
// =====================================================
export async function getTokenUser() {
  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("doctor_token") ||
    localStorage.getItem("admin_token");

  try {
    const res = await axios.get(`${API_BASE_URL}/api/token-user`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return res.data; // luôn trả về dạng { user: {...} }
  } catch (err) {
    console.error("❌ Lỗi lấy token-user:", err);
    return null;
  }
}

// =====================================================
// TẠO API có token tự động
// =====================================================
export function getAuthorizedAPI() {
  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("doctor_token") ||
    localStorage.getItem("admin_token");

  return axios.create({
    baseURL: `${API_BASE_URL}/api`,
    headers: {
      Authorization: `Bearer ${token}`,
      "X-Requested-With": "XMLHttpRequest",
      Accept: "application/json",
    },
    withCredentials: true,
  });
}

// =====================================================
// 🔐 INTERCEPTOR — GẮN TOKEN CHO INSTANCE CHÍNH
// =====================================================
API.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("doctor_token") ||
    localStorage.getItem("admin_token");

  if (token) config.headers.Authorization = `Bearer ${token}`;

  config.headers["X-Requested-With"] = "XMLHttpRequest";
  return config;
});

// =====================================================
// 🚨 INTERCEPTOR — XỬ LÝ LỖI CHUNG
// =====================================================
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      alert("⚠️ Không thể kết nối máy chủ backend!");
      return Promise.reject(error);
    }

    const { status } = error.response;

    switch (status) {
      case 401:
        console.warn("🔐 Phiên đăng nhập hết hạn.");
        localStorage.clear();
        window.location.href = "/login";
        break;

      case 403:
        alert("🚫 Không có quyền truy cập.");
        break;

      case 404:
        console.warn("❓ API không tồn tại.");
        break;

      case 419:
        initSanctum();
        break;

      case 422:
        console.warn("🧾 Lỗi xác thực form.");
        break;

      case 500:
        console.error("💥 Lỗi máy chủ!");
        break;

      default:
        console.error("❌ Lỗi không xác định:", error);
        break;
    }

    return Promise.reject(error);
  }
);

// =====================================================
// 📦 EXPORT CHÍNH
// =====================================================
export default API;