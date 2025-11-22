import React, { useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Navbar from "../../components/common/Navbar";
import axios from "../../api/axios";
import { toast } from "react-toastify";
import Footer from "../../components/common/Footer"

const position = [10.8514, 106.7581]; // ví dụ: HCM

export default function ContactPage() {
  // 🔹 Trạng thái lưu form
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [loading, setLoading] = useState(false);

  // 🟢 Gửi form liên hệ
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name) {
      toast.warning("⚠️ Vui lòng nhập tên!");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8000/api/contacts", form);
      if (res.data.success) {
        toast.success("✅ Gửi liên hệ thành công!");
        setForm({ name: "", email: "", phone: "", message: "" }); // reset form
      } else {
        toast.error("❌ Gửi thất bại, vui lòng thử lại!");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Lỗi kết nối server!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full">
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center py-16 px-4">
        <h1 className="text-4xl font-bold text-blue-700 mb-6">Liên hệ với chúng tôi</h1>
       

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl w-full">
          {/* 🧩 Form liên hệ */}
          <div className="bg-white shadow-lg rounded-2xl p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Họ và tên</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                  placeholder="Nhập họ và tên"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Email</label>
                <input
                  type="email"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                  placeholder="Nhập email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Số điện thoại</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                  placeholder="Nhập số điện thoại"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Tin nhắn</label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                  rows="5"
                  placeholder="Nhập nội dung cần liên hệ..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"} text-white font-semibold rounded-lg py-2 transition-all`}
              >
                {loading ? "Đang gửi..." : "Gửi liên hệ"}
              </button>
            </form>
          </div>

          {/* 🧭 Thông tin liên hệ */}
          <div className="bg-blue-600 text-white shadow-lg rounded-2xl p-8 flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Thông tin liên hệ</h2>
              <p className="mb-6 text-blue-100">
                Bạn có thể đến trực tiếp hoặc liên hệ qua các kênh dưới đây để được hỗ trợ nhanh nhất.
              </p>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5" />
                  <span>123 Đường Sức Khỏe, Quận 1, TP.HCM</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5" />
                  <span>+84 123 456 789</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5" />
                  <span>support@cliniccare.vn</span>
                </div>
              </div>
            </div>

            <div className="mt-10">
              <MapContainer
                center={position}
                zoom={15}
                style={{
                  width: "450px",
                  height: "200px",
                  borderRadius: "12px",
                  boxShadow: "2px 2px 2px 2px",
                }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={position}>
                  <Popup>Đây là vị trí của bạn 🚩</Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
