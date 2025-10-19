import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import avatarDefault from "../../assets/avatar.jpg";

export default function LikeDoctor() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user")) || null;
  const patientId = user?.id || null;

  useEffect(() => {
    fetchFavorites();
  }, []);

  // ====== Lấy danh sách yêu thích ======
  const fetchFavorites = async () => {
    setLoading(true);
    try {
      if (patientId) {
        const res = await API.get(`/favorites/${patientId}`);
        setFavorites(res.data.data || res.data);
      } else {
        const localFavs = JSON.parse(localStorage.getItem("favorites")) || [];
        setFavorites(localFavs);
      }
    } catch (err) {
      console.error("❌ Lỗi khi tải danh sách yêu thích:", err);
      alert("Không thể tải danh sách bác sĩ yêu thích!");
    } finally {
      setLoading(false);
    }
  };

  // ====== Xóa bác sĩ yêu thích ======
  const handleRemove = async (favoriteId) => {
    if (!window.confirm("Bạn có chắc muốn xóa bác sĩ này khỏi danh sách yêu thích?")) return;

    try {
      if (patientId) {
        await API.delete(`/favorites/${favoriteId}`);
        setFavorites((prev) => prev.filter((f) => f.id !== favoriteId));
      } else {
        const newFavs = favorites.filter(
          (f) => f.id !== favoriteId && f.doctor_id !== favoriteId
        );
        setFavorites(newFavs);
        localStorage.setItem("favorites", JSON.stringify(newFavs));
      }

      alert("❌ Đã xóa khỏi danh sách yêu thích!");
    } catch (err) {
      console.error("❌ Lỗi khi xóa bác sĩ:", err);
      alert("Lỗi khi xóa bác sĩ!");
    }
  };

  // ====== Xử lý ảnh đại diện ======
  const getDoctorAvatar = (fav) => {
    const baseURL =
      import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:8000";

    if (fav?.doctor?.user?.avatar_url) return fav.doctor.user.avatar_url;
    if (fav?.doctor?.user?.avatar) return `${baseURL}/storage/${fav.doctor.user.avatar}`;
    if (fav?.doctor?.avatar_url) return fav.doctor.avatar_url;
    if (fav?.doctor?.avatar) return `${baseURL}/storage/${fav.doctor.avatar}`;
    if (fav?.avatar_url)
      return fav.avatar_url.startsWith("http")
        ? fav.avatar_url
        : `${baseURL}/storage/${fav.avatar_url}`;
    if (fav?.avatar)
      return fav.avatar.startsWith("http")
        ? fav.avatar
        : `${baseURL}/storage/${fav.avatar}`;

    return avatarDefault;
  };

  // ====== Giao diện ======
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-50 py-12 px-6">
      <h1 className="text-4xl font-bold text-center text-blue-700 mb-10">
        💙 Danh Sách Bác Sĩ Yêu Thích
      </h1>

      {loading ? (
        <div className="text-center text-gray-500 animate-pulse text-lg">
          ⏳ Đang tải danh sách...
        </div>
      ) : favorites.length === 0 ? (
        <div className="text-center text-gray-500 text-lg mt-20">
          Bạn chưa thêm bác sĩ nào vào danh sách yêu thích.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
          {favorites.map((fav, index) => {
            const id = fav.id || fav.doctor_id;
            const name =
              fav.doctor?.user?.name ||
              fav.doctor_name ||
              "Chưa rõ tên";
            const specialization =
              fav.doctor?.specialization?.name ||
              fav.specialization ||
              "Chưa có chuyên khoa";

            return (
              <div
                key={id || index}
                className="relative bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 flex flex-col items-center space-y-4 border border-gray-100"
              >
                {/* Hiệu ứng nền động */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-100 via-transparent to-transparent opacity-0 hover:opacity-100 transition-all duration-500 pointer-events-none"></div>

                {/* Ảnh bác sĩ */}
                <div className="relative">
                  <img
                    src={getDoctorAvatar(fav)}
                    alt="Doctor Avatar"
                    className="w-36 h-36 rounded-full object-cover border-4 border-blue-200 shadow-md transition-all duration-300 hover:scale-105"
                    onError={(e) => (e.target.src = avatarDefault)}
                  />
                  <div className="absolute bottom-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full shadow">
                    {specialization}
                  </div>
                </div>

                {/* Thông tin */}
                <div className="text-center space-y-1">
                  <h2 className="text-xl font-semibold text-gray-800">
                    BS. {name}
                  </h2>
                </div>

                {/* Nút hành động */}
                <div className="flex w-full gap-3 mt-2">
                  <button
                    onClick={() =>
                      alert(`👨‍⚕️ Hồ sơ chi tiết của ${name} sẽ được bổ sung sau`)
                    }
                    className="flex-1 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl shadow transition-all duration-300 hover:scale-105 active:scale-95"
                  >
                    Xem hồ sơ
                  </button>
                  <button
                    onClick={() => handleRemove(id)}
                    className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl shadow transition-all duration-300 hover:scale-105 active:scale-95"
                  >
                    Bỏ yêu thích
                  </button>
                </div>

                {/* Hiệu ứng khi hover */}
                <div className="absolute -top-2 -right-2 bg-white border border-blue-300 text-blue-500 px-2 py-1 text-xs font-semibold rounded-full shadow-sm">
                  ❤️
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}