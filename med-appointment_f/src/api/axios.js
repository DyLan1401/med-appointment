// import axios from "axios";

// const API = axios.create({
//     baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
// });

// // middleware: tự động gắn token vào header
// API.interceptors.request.use((config) => {
//     const token = localStorage.getItem("token");
//     if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
// });

// export default API;



import axios from "axios";

// ✅ Tạo một instance axios riêng biệt cho API
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
  timeout: 30000, // ⏱️ Giới hạn thời gian chờ (15 giây)
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true, // ⚠️ Quan trọng nếu dùng Laravel Sanctum
});

// ✅ REQUEST INTERCEPTOR
// (Tự động thêm token vào header Authorization trước khi gửi request)
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // token được lưu khi login
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("🚫 Lỗi cấu hình request:", error);
    return Promise.reject(error);
  }
);

// ✅ RESPONSE INTERCEPTOR
// (Xử lý lỗi chung cho toàn bộ ứng dụng)
API.interceptors.response.use(
  (response) => response, // ✅ Nếu thành công thì trả về luôn dữ liệu
  (error) => {
    if (!error.response) {
      alert("⚠️ Không thể kết nối tới máy chủ. Vui lòng kiểm tra lại API URL!");
      return Promise.reject(error);
    }

    const { status, data } = error.response;

    // ✅ Xử lý lỗi theo mã trạng thái HTTP
    switch (status) {
      case 400:
        console.warn("⚠️ Dữ liệu gửi lên không hợp lệ:", data.message || "");
        break;

      case 401:
        alert("🔐 Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
        break;

      case 403:
        alert("🚫 Bạn không có quyền truy cập chức năng này!");
        break;

      case 404:
        console.warn("❓ Không tìm thấy tài nguyên yêu cầu:", data.message || "");
        break;

      case 419:
        alert("⏳ Token CSRF đã hết hạn. Vui lòng tải lại trang!");
        break;

      case 422:
        console.warn("🧾 Lỗi xác thực dữ liệu:", data.errors || data.message);
        break;

      case 500:
        alert("💥 Lỗi máy chủ! Vui lòng thử lại sau.");
        break;

      default:
        console.error("❗ Lỗi không xác định:", status, data);
    }

    return Promise.reject(error);
  }
);

// ✅ Giữ nguyên cấu trúc cũ (nếu bạn đã import { API } ở nơi khác)
export { API };
export default API;

