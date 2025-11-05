import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";
import { RefreshCw, User2, CheckCircle, XCircle, Clock } from "lucide-react";
import API from "../../api/axios";

export default function BHYTStatistics() {
  const [stats, setStats] = useState({
    total_patients: 0,
    with_insurance: 0,
    without_insurance: 0,
  });
  const [newestPatients, setNewestPatients] = useState([]);
  const [loading, setLoading] = useState(false);

  // Lọc theo thời gian
  const [period, setPeriod] = useState("all"); // all | this_month | this_quarter | this_year | custom
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);

      const params = {};
      if (period !== "all" && period !== "custom") params.period = period;
      if (period === "custom" && from && to) {
        params.from = from;
        params.to = to;
      }

      const [statsRes, newestRes] = await Promise.all([
        API.get(`/patients/statistics`, { params }),
        API.get(`/patients/newest`, { params: { limit: 3 } }),
      ]);

      setStats(statsRes.data);
      setNewestPatients(newestRes.data.newest_patients || []);
    } catch (error) {
      console.error("⚠️ Không thể kết nối API:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [period]);

  // Khi người dùng chọn khoảng thời gian custom
  useEffect(() => {
    if (period === "custom" && from && to) {
      fetchData();
    }
  }, [from, to]);

  const total = stats.total_patients || 1;
  const withPercent = ((stats.with_insurance / total) * 100).toFixed(1);
  const withoutPercent = ((stats.without_insurance / total) * 100).toFixed(1);

  const data = [
    { name: `Có BHYT (${withPercent}%)`, value: stats.with_insurance },
    { name: `Không BHYT (${withoutPercent}%)`, value: stats.without_insurance },
  ];
  const COLORS = ["#22c55e", "#ef4444"];

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center p-6">
      <div className="bg-white w-full max-w-6xl rounded-2xl shadow-md p-6">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
            📊 Thống Kê BHYT Bệnh Nhân
          </h1>
          <p className="text-gray-500 text-sm">
            Phân tích tỷ lệ bệnh nhân có và không có Bảo hiểm Y tế trong hệ thống.
          </p>
        </div>

        {/* Bộ lọc + thời gian cập nhật */}
        <div className="flex flex-wrap justify-between items-center bg-gray-50 p-4 rounded-xl mb-6">
          <div className="flex flex-col gap-2">
            <label className="text-gray-600 text-sm">Khoảng thời gian:</label>
            <div className="flex flex-wrap gap-2 items-center">
              <select
                className="border rounded-lg px-3 py-2 text-sm"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
              >
                <option value="all">Toàn bộ dữ liệu</option>
                <option value="this_month">Tháng này</option>
                <option value="this_quarter">Quý này</option>
                <option value="this_year">Năm nay</option>
                <option value="custom">Tùy chỉnh...</option>
              </select>

              {period === "custom" && (
                <>
                  <input
                    type="date"
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    className="border rounded-lg px-3 py-2 text-sm"
                  />
                  <span className="text-gray-500 text-sm">→</span>
                  <input
                    type="date"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    className="border rounded-lg px-3 py-2 text-sm"
                  />
                </>
              )}
            </div>
          </div>

          <div className="text-right mt-2 md:mt-0">
            <p className="text-gray-600 text-sm">Cập nhật lần cuối:</p>
            <div className="flex items-center justify-end gap-2 mt-1">
              <span className="text-gray-800 font-medium text-sm">
                {new Date().toLocaleString("vi-VN")}
              </span>
              <button
                onClick={fetchData}
                className="flex items-center gap-1 text-blue-600 hover:underline text-sm"
              >
                <RefreshCw size={16} /> Làm mới
              </button>
            </div>
          </div>
        </div>

        {/* Thẻ thống kê */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
          <div className="bg-white border rounded-xl p-5 shadow-sm flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">TỔNG SỐ BỆNH NHÂN</p>
              <p className="text-3xl font-semibold text-gray-800 mt-1">{stats.total_patients}</p>
            </div>
            <User2 className="text-blue-500" size={32} />
          </div>

          <div className="bg-white border rounded-xl p-5 shadow-sm flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">BỆNH NHÂN CÓ BHYT</p>
              <p className="text-3xl font-semibold text-green-600 mt-1">{stats.with_insurance}</p>
              <p className="text-xs text-green-500">{withPercent}%</p>
            </div>
            <CheckCircle className="text-green-500" size={32} />
          </div>

          <div className="bg-white border rounded-xl p-5 shadow-sm flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">BỆNH NHÂN KHÔNG BHYT</p>
              <p className="text-3xl font-semibold text-red-600 mt-1">{stats.without_insurance}</p>
              <p className="text-xs text-red-500">{withoutPercent}%</p>
            </div>
            <XCircle className="text-red-500" size={32} />
          </div>
        </div>

        {/* Biểu đồ + Phân tích */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Biểu đồ tròn */}
          <div className="col-span-2 bg-white border rounded-xl p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Biểu đồ Tỷ lệ Phân bố BHYT</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  innerRadius={60}
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Danh sách bệnh nhân mới nhất */}
          <div className="bg-white border rounded-xl p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-1 mb-2">
              <Clock size={14} /> Bệnh nhân mới nhất
            </h3>
            {loading ? (
              <p className="text-gray-400 text-sm italic">Đang tải...</p>
            ) : (
              <ul className="space-y-2 text-sm">
                {newestPatients.length > 0 ? (
                  newestPatients.map((p) => (
                    <li
                      key={p.id}
                      className="flex justify-between border-b pb-1 border-gray-100"
                    >
                      <span>
                        {p.name || `Bệnh nhân #${p.id}`}{" "}
                        {p.health_insurance ? "(Có BHYT)" : "(Không BHYT)"}
                      </span>
                      <span className="text-gray-400">
                        {new Date(p.created_at).toLocaleDateString("vi-VN")}
                      </span>
                    </li>
                  ))
                ) : (
                  <p className="text-gray-400 italic">Không có dữ liệu.</p>
                )}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
