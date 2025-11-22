import React, { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { API } from "../../api/axios";

export default function ManagerFeedBackDoctor() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ratingFilter, setRatingFilter] = useState("");
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
  });

  const fetchFeedbacks = async (page = 1, rating = "") => {
    try {
      setLoading(true);
      const params = { page, per_page: 10 };
      if (rating) params.rating = rating;

      const res = await API.get("/feedbacks", { params });
      setFeedbacks(res.data.data);
      setPagination({
        current_page: res.data.current_page,
        last_page: res.data.last_page,
      });
    } catch (error) {
      console.error("❌ Lỗi khi lấy feedback:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const handleRatingChange = (e) => {
    const value = e.target.value;
    setRatingFilter(value);
    fetchFeedbacks(1, value); // lọc lại từ trang 1
  };

  const handlePageChange = (page) => {
    fetchFeedbacks(page, ratingFilter);
  };

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-500">
        ⏳ Đang tải danh sách feedback...
      </div>
    );
  }

  return (
    <div className=" p-6">
      {/* Header */}

      <h2 className="text-2xl font-bold text-blue-700 mb-2">
        Quản lý Feedback bác sĩ
      </h2>



      {/* Bộ lọc rating */}
      <div className="flex items-center gap-2">
        <label htmlFor="rating" className="text-sm text-gray-600">
          Lọc theo rating:
        </label>
        <select
          id="rating"
          value={ratingFilter}
          onChange={handleRatingChange}
          className="border rounded-md px-2 py-1 text-sm"
        >
          <option value="">Tất cả</option>
          <option value="5">5 sao</option>
          <option value="4">4 sao</option>
          <option value="3">3 sao</option>
          <option value="2">2 sao</option>
          <option value="1">1 sao</option>
        </select>
      </div>

      {feedbacks.length === 0 ? (
        <p className="text-center text-gray-400">Không có phản hồi nào.</p>
      ) : (
        <div className="space-y-4">
          {feedbacks.map((fb, index) => (
            <div
              key={index}
              className="border border-gray-100 rounded-xl p-4 flex items-start gap-4 hover:shadow-sm transition"
            >
              <img
                src={
                  fb.patient_avatar ||
                  "https://cdn-icons-png.flaticon.com/512/4140/4140048.png"
                }
                alt={fb.patient_name}
                className="w-12 h-12 rounded-full border"
              />
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-blue-700">
                    {fb.patient_name}
                  </h3>
                  <span className="text-xs text-gray-400">
                    {new Date(fb.created_at).toLocaleDateString("vi-VN")}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mt-1">"{fb.comment}"</p>

                <div className="flex items-center justify-between mt-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < fb.rating
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                          }`}
                      />
                    ))}
                  </div>

                  <div className="text-xs text-gray-500 text-right">
                    <p>Bác sĩ: {fb.doctor_name}</p>
                    <p>Phòng ban: {fb.department_name || "Chưa có"}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ✅ Phân trang */}
      <div className="flex justify-center mt-6 gap-2">
        {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map(
          (page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-1 text-sm rounded-md border ${pagination.current_page === page
                ? "bg-blue-600 text-white"
                : "bg-white text-blue-600 border-blue-300 hover:bg-blue-50"
                }`}
            >
              {page}
            </button>
          )
        )}
      </div>
    </div>
  );
}
