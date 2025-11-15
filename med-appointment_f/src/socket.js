// ======================================================
// 🔌 socket.js — cấu hình Laravel Echo + Socket.io/Pusher (fix require error)
// ======================================================

import Echo from "laravel-echo";
import Pusher from "pusher-js";
import { io } from "socket.io-client";

// ======================================================
// ⚙️ SOCKET.IO CONFIG (giữ nguyên code cũ của bạn)
// ======================================================
window.io = io;

export const socket = new Echo({
  broadcaster: "socket.io",
  host: "http://127.0.0.1:6001",
  transports: ["websocket"],
  forceNew: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 2000,

  // ✅ BỔ SUNG phần auth token để backend nhận Bearer token
  auth: {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  },
});

// ======================================================
// ⚙️ PUSHER / LARAVEL ECHO CONFIG (thêm phần mới)
// ======================================================
window.Pusher = Pusher;

window.Echo = new Echo({
  broadcaster: "pusher",
  key: "local",             // 🔹 trùng PUSHER_APP_KEY trong .env
  wsHost: "127.0.0.1",      // 🔹 địa chỉ Laravel Echo Server
  wsPort: 6001,
  wssPort: 6001,
  forceTLS: false,
  encrypted: false,
  disableStats: true,
  enabledTransports: ["ws", "wss"],

  // ✅ Thêm header Bearer token để xác thực realtime
  auth: {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  },
});

// ======================================================
// 🧩 TEST KẾT NỐI
// ======================================================
if (window.Echo.connector && window.Echo.connector.socket) {
  window.Echo.connector.socket.on("connect", () => {
    console.log("✅ Kết nối realtime thành công tới Laravel Echo Server!");
  });

  window.Echo.connector.socket.on("disconnect", () => {
    console.warn("⚠️ Mất kết nối realtime — đang thử kết nối lại...");
  });
}

// ======================================================
// 🧠 Hỗ trợ export Echo instance để dùng ở component khác
// ======================================================
export default window.Echo;