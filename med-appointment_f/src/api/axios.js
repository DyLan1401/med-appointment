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
import { toast } from "react-toastify";

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
    return Promise.reject(error);
  }
);

// ✅ RESPONSE INTERCEPTOR
// (Xử lý lỗi chung cho toàn bộ ứng dụng)
API.interceptors.response.use(
  (response) => response, // ✅ Nếu thành công thì trả về luôn dữ liệu
  (error) => {
    if (!error.response) {
      toast.error("⚠️ Không thể kết nối tới máy chủ. Vui lòng kiểm tra lại API URL!");
      return Promise.reject(error);
    }

    const { status, data } = error.response;

    // ✅ Xử lý lỗi theo mã trạng thái HTTP
    switch (status) {
      case 400:
        toast.warning(data.message || "⚠️ Dữ liệu gửi lên không hợp lệ!");
        break;

      case 401:
        toast.warning("🔐 Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
        break;

      case 403:
        toast.error("🚫 Bạn không có quyền truy cập chức năng này!");
        break;

      case 404:
        toast.warning(data.message || "❓ Không tìm thấy tài nguyên yêu cầu!");
        setTimeout(() => {
          window.location.href = "/404";
        }, 800);
        break;

      case 419:
        toast.warning("⏳ Token CSRF đã hết hạn. Vui lòng tải lại trang!");
        break;

      case 422:
        const errorMsg = data.errors ? Object.values(data.errors)[0]?.[0] : data.message;
        toast.error(errorMsg || "🧾 Lỗi xác thực dữ liệu!");
        break;

      case 500:
        toast.error("💥 Lỗi máy chủ! Vui lòng thử lại sau.");
        break;

      default:
        toast.error(data.message || `❗ Lỗi không xác định (${status})`);
    }

    return Promise.reject(error);
  }
);

// ✅ Giữ nguyên cấu trúc cũ (nếu bạn đã import { API } ở nơi khác)
export { API };
export default API;

