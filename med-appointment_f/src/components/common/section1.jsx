import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import heart from "../../assets/heart.png";
import avatarDefault from "../../assets/avatar.jpg";
import API from "../../api/axios";

export default function Section1() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [filter, setFilter] = useState("Tất cả");
  const [loading, setLoading] = useState(false);
  const [liked, setLiked] = useState(null); // 👈 animation tim

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user")) || null;

  useEffect(() => {
    fetchDoctors();
    fetchSpecializations();
  }, []);

  // ===== Lấy danh sách bác sĩ =====
  const fetchDoctors = async () => {
    try {
      const res = await API.get("/doctors");
      setDoctors(res.data.data || res.data);
    } catch (err) {
      console.error(err);
      alert("❌ Không thể tải danh sách bác sĩ!");
    }
  };

  // ===== Lấy danh sách chuyên khoa =====
  const fetchSpecializations = async () => {
    try {
      const res = await API.get("/departments");
      setSpecializations(res.data.data || res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // ===== Hàm lấy ảnh bác sĩ =====
  const getDoctorAvatar = (doctor) => {
    const baseURL =
      import.meta.env.VITE_API_URL?.replace("/api", "") ||
      "http://localhost:8000";

    if (doctor?.user?.avatar) {
      if (doctor.user.avatar.startsWith("http")) return doctor.user.avatar;
      return `${baseURL}/storage/${doctor.user.avatar}`;
    }
    if (doctor?.avatar) {
      if (doctor.avatar.startsWith("http")) return doctor.avatar;
      return `${baseURL}/storage/${doctor.avatar}`;
    }
    if (doctor?.avatar_url) return doctor.avatar_url;

    return avatarDefault;
  };

  // ===== Thêm yêu thích =====
  const handleFavorite = async (doctor) => {
    if (!doctor?.id) return alert("⚠️ Thiếu thông tin bác sĩ!");
    setLiked(doctor.id); // 👈 hiệu ứng tim rung
    setTimeout(() => setLiked(null), 1000);

    setLoading(true);
    try {
      if (token) {
        await API.post(
          "/favorites",
          { doctor_id: doctor.id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert(`💖 Đã thêm bác sĩ ${doctor.user?.name} vào danh sách yêu thích!`);
      } else {
        const localFavs = JSON.parse(localStorage.getItem("favorites")) || [];
        const exists = localFavs.some((f) => f.doctor_id === doctor.id);
        if (!exists) {
          localFavs.push({
            id: doctor.id,
            doctor_id: doctor.id,
            doctor_name: doctor.user?.name || "Chưa rõ tên",
            specialization: doctor.specialization?.name || "Chưa rõ chuyên khoa",
            avatar_url: getDoctorAvatar(doctor),
          });
          localStorage.setItem("favorites", JSON.stringify(localFavs));
        }
        alert(`💖 Đã thêm bác sĩ ${doctor.user?.name} vào yêu thích tạm thời!`);
      }

      navigate("/like-doctor");
    } catch (err) {
      console.error("❌ Lỗi khi thêm yêu thích:", err);
      alert("⚠️ Không thể thêm bác sĩ yêu thích!");
    } finally {
      setLoading(false);
    }
  };

  // ===== Lọc danh sách =====
  const filteredDoctors =
    filter === "Tất cả"
      ? doctors
      : doctors.filter((d) => d.specialization?.name === filter);

  return (
    <div className="w-full h-full flex flex-col justify-center items-center bg-gray-50">
      {/* ======= CÁC CHUYÊN KHOA ======= */}
      <div className="w-full py-10 bg-gradient-to-r from-blue-300 to-blue-400 flex flex-col items-center space-y-6 shadow-inner">
        <h2 className="text-3xl font-bold text-white drop-shadow-lg">
          Các Chuyên Khoa
        </h2>
        <div className="flex space-x-3 flex-wrap justify-center">
          <button
            onClick={() => setFilter("Tất cả")}
            className={`py-2 px-4 rounded-xl font-medium shadow-md transition-all ${
              filter === "Tất cả"
                ? "bg-blue-700 text-white scale-105"
                : "bg-white text-blue-700 hover:bg-blue-600 hover:text-white"
            }`}
          >
            Tất cả
          </button>

          {specializations.map((sp) => (
            <button
              key={sp.id}
              onClick={() => setFilter(sp.name)}
              className={`py-2 px-4 rounded-xl font-medium shadow-md transition-all ${
                filter === sp.name
                  ? "bg-blue-700 text-white scale-105"
                  : "bg-white text-blue-700 hover:bg-blue-600 hover:text-white"
              }`}
            >
              {sp.name}
            </button>
          ))}
        </div>
      </div>

      {/* ======= DANH SÁCH BÁC SĨ THEO CHUYÊN KHOA ======= */}
      <div className="w-full flex flex-col justify-center items-center py-12 space-y-10">
        <h2 className="text-3xl font-bold text-blue-600">
          Danh Sách Bác Sĩ Theo Chuyên Khoa
        </h2>

        <AnimatePresence>
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-6"
          >
            {filteredDoctors.length > 0 ? (
              filteredDoctors.map((d) => (
                <motion.div
                  key={d.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white shadow-2xl rounded-2xl p-6 flex flex-col items-center space-y-4 relative hover:shadow-blue-200 transition-all hover:-translate-y-1"
                >
                  {/* Nút tim có animation */}
                  <motion.img
                    src={heart}
                    onClick={() => handleFavorite(d)}
                    className="absolute top-3 right-3 cursor-pointer"
                    width={30}
                    height={30}
                    alt="heart"
                    animate={
                      liked === d.id
                        ? { scale: [1, 1.5, 1], rotate: [0, 20, -20, 0] }
                        : {}
                    }
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                  />

                  {/* Ảnh bác sĩ */}
                  <img
                    className="rounded-full object-cover w-[200px] h-[200px] border-4 border-blue-200 shadow-md"
                    src={getDoctorAvatar(d)}
                    alt={`Ảnh bác sĩ ${d.user?.name || ""}`}
                    onError={(e) => (e.target.src = avatarDefault)}
                  />

                  {/* Thông tin bác sĩ */}
                  <div className="text-center">
                    <div className="text-xl font-semibold text-gray-800">
                      BS. {d.user?.name || "Chưa rõ"}
                    </div>
                    <div className="text-gray-600">
                      {d.specialization?.name || "Chưa có chuyên khoa"}
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="text-gray-500 col-span-3 text-center">
                Không có bác sĩ nào để hiển thị.
              </p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/*  ĐỘI NGŨ BÁC SĨ NỔI BẬT */}
      <div className="w-full flex flex-col justify-center items-center py-10 bg-white">
        <div className="text-3xl font-bold py-5 text-blue-600">
          Đội Ngũ Bác Sĩ Nổi Bật
        </div>
        <div className="w-full flex justify-center items-center space-x-7 flex-wrap">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-[300px] bg-white p-5 shadow-2xl rounded-2xl flex flex-col items-center space-y-4 hover:shadow-blue-300 transition-transform hover:-translate-y-1"
            >
              <img
                className="self-end cursor-pointer hover:scale-110 transition-transform"
                src={heart}
                width={25}
                height={25}
                alt="heart"
              />
              <div className="flex flex-col items-center gap-y-2">
                <img
                  className="rounded-3xl object-cover shadow-md"
                  src={avatarDefault}
                  alt="avatar"
                  width={250}
                />
                <div className="text-center">
                  <div className="text-xl font-semibold">Tên Bác Sĩ</div>
                  <div className="text-lg text-gray-600">Khoa</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}