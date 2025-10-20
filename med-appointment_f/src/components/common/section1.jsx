import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, AlertTriangle, Stethoscope } from "lucide-react";
import heart from "../../assets/heart.png";
import avatarDefault from "../../assets/avatar.jpg";
import API from "../../api/axios";

export default function Section1() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("search");

  const [doctors, setDoctors] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [filter, setFilter] = useState("Tất cả");
  const [loading, setLoading] = useState(false);
  const [liked, setLiked] = useState(null);
  const [notFound, setNotFound] = useState(false);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user")) || null;

  useEffect(() => {
    if (searchQuery) handleSearch(searchQuery);
    else fetchDoctors();
    fetchSpecializations();
  }, [searchQuery]);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const res = await API.get("/doctors");
      const list = res.data.data || res.data;
      setDoctors(list);
      setNotFound(list.length === 0);
    } catch (err) {
      console.error(err);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const fetchSpecializations = async () => {
    try {
      const res = await API.get("/departments");
      setSpecializations(res.data.data || res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = async (query) => {
    setLoading(true);
    try {
      const res = await API.get(`/doctors/search?query=${query}`);
      const results = res.data?.data || res.data || [];
      setDoctors(results);
      setNotFound(results.length === 0);

      setTimeout(() => {
        const section = document.getElementById("doctor-results");
        if (section) section.scrollIntoView({ behavior: "smooth" });
      }, 300);
    } catch (err) {
      console.error("❌ Lỗi tìm kiếm:", err);
      setDoctors([]);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const getDoctorAvatar = (doctor) => {
    const baseURL =
      import.meta.env.VITE_API_URL?.replace("/api", "") ||
      "http://localhost:8000";
    const avatar =
      doctor?.user?.avatar ||
      doctor?.avatar ||
      doctor?.avatar_url ||
      avatarDefault;

    if (avatar.startsWith("http")) return avatar;
    return `${baseURL}/storage/${avatar}`;
  };

  const handleFavorite = async (doctor) => {
    if (!doctor?.id) return alert("⚠️ Thiếu thông tin bác sĩ!");
    setLiked(doctor.id);
    setTimeout(() => setLiked(null), 800);

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
    }
  };

  const filteredDoctors =
    filter === "Tất cả"
      ? doctors
      : doctors.filter((d) => d.specialization?.name === filter);

  return (
    <motion.div
      className="w-full min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-blue-50 to-white animate-fadeIn"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      
      <div className="w-full bg-gradient-to-r from-blue-500 to-blue-700 py-16 text-center shadow-inner">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl sm:text-5xl font-extrabold text-white mb-4"
        >
          Tìm Kiếm & Khám Phá Bác Sĩ Phù Hợp Cho Bạn
        </motion.h1>
        <p className="text-white/90 text-lg max-w-2xl mx-auto leading-relaxed">
          Hơn 100+ bác sĩ chuyên khoa uy tín sẵn sàng hỗ trợ bạn mọi lúc, mọi nơi 💙
        </p>
      </div>

      {/* ======= CÁC CHUYÊN KHOA ======= */}
      <div className="w-full py-10 bg-white flex flex-col items-center space-y-6 shadow-sm">
        <h2 className="text-3xl font-bold text-blue-700 flex items-center gap-2">
          <Stethoscope size={30} /> Các Chuyên Khoa
        </h2>

        <div className="flex flex-wrap justify-center gap-3 px-4">
          <button
            onClick={() => setFilter("Tất cả")}
            className={`py-2 px-5 rounded-full font-semibold shadow-md transition-all ${
              filter === "Tất cả"
                ? "bg-blue-700 text-white scale-105"
                : "bg-gray-100 text-blue-800 hover:bg-blue-600 hover:text-white"
            }`}
          >
            Tất cả
          </button>

          {specializations.map((sp) => (
            <button
              key={sp.id}
              onClick={() => setFilter(sp.name)}
              className={`py-2 px-5 rounded-full font-semibold shadow-md transition-all ${
                filter === sp.name
                  ? "bg-blue-700 text-white scale-105"
                  : "bg-gray-100 text-blue-800 hover:bg-blue-600 hover:text-white"
              }`}
            >
              {sp.name}
            </button>
          ))}
        </div>
      </div>

      {/* ======= DANH SÁCH BÁC SĨ ======= */}
      <div
        id="doctor-results"
        className="w-full flex flex-col justify-center items-center py-16 space-y-10"
      >
        <h2 className="text-3xl font-bold text-blue-700">
          {searchQuery
            ? `🔍 Kết quả tìm kiếm cho “${searchQuery}”`
            : "Danh Sách Bác Sĩ"}
        </h2>

        {/* ⏳ Loading */}
        {loading && (
          <motion.div
            className="text-blue-600 font-semibold flex items-center gap-2 animate-pulse"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Search className="w-5 h-5 animate-spin" />
            Đang tìm kiếm bác sĩ...
          </motion.div>
        )}

        {/* 🩺 Danh sách hoặc Thông báo */}
        <AnimatePresence mode="wait">
          {!loading && filteredDoctors.length > 0 ? (
            <motion.div
              key="list"
              layout
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              {filteredDoctors.map((d) => (
                <motion.div
                  key={d.id}
                  layout
                  whileHover={{ scale: 1.04 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="bg-white border border-gray-100 shadow-xl rounded-2xl p-6 flex flex-col items-center space-y-4 relative hover:shadow-blue-200 hover:-translate-y-1 transition-all duration-300"
                >
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

                  <img
                    className="rounded-full object-cover w-[160px] h-[160px] border-4 border-blue-100 shadow-md"
                    src={getDoctorAvatar(d)}
                    alt={`Ảnh bác sĩ ${d.user?.name || ""}`}
                    onError={(e) => (e.target.src = avatarDefault)}
                  />

                  <div className="text-center space-y-1">
                    <div className="text-lg font-semibold text-gray-800">
                      BS. {d.user?.name || "Chưa rõ"}
                    </div>
                    <div className="text-blue-600 font-medium">
                      {d.specialization?.name || "Chưa có chuyên khoa"}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            !loading && (
              <motion.div
                key="notfound"
                className="flex flex-col items-center justify-center text-center text-gray-600 animate-fadeIn"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <AlertTriangle className="w-12 h-12 text-blue-600 mb-3" />
                <p className="text-lg font-medium">
                  Không tìm thấy bác sĩ nào phù hợp
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Hãy thử tìm với tên hoặc chuyên khoa khác nhé 💡
                </p>
              </motion.div>
            )
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}