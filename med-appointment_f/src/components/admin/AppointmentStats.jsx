import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { API } from "../../api/axios";
export default function AppointmentStats() {

  const [data, setData] = useState([]);
  const [completedCount, setCompletedCount] = useState(0);
  const [patientCount, setPatientCount] = useState(0);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // load tổng stats
  const loadBasicStats = async () => {
    const resCompleted = await API.get("/appointments/completed/count");
    setCompletedCount(resCompleted.data.count);

    const resPatients = await API.get("/patients/count");
    setPatientCount(resPatients.data.count);
  };

  // load biểu đồ
  const loadChart = async () => {
    const res = await API.get("/appointments/completed/daily-summary", {
      params: { from: fromDate, to: toDate },
    });

    const chartData = res.data.map((item) => ({
      name: new Date(item.day).toLocaleDateString("vi-VN"),
      value: item.count,
    }));

    setData(chartData);
  };

  // load default ngay lần đầu
  useEffect(() => {
    loadBasicStats();
    loadChart(); // sẽ dùng default 7 ngày gần nhất
  }, []);


  return (
    <div className="p-6 ">
      {/* Tiêu đề  */}
      <h2 className="text-2xl font-bold text-blue-700 mb-2">
        Thống kê Lịch khám
      </h2>

      {/* 2 ô stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="p-4 bg-blue-50 rounded-xl border shadow-sm">
          <p className="text-gray-500 text-sm">Lịch đã hoàn thành</p>
          <p className="text-2xl font-semibold">
            {completedCount.toLocaleString()}
          </p>
        </div>
        <div className="p-4 bg-green-50 rounded-xl border shadow-sm">
          <p className="text-gray-500 text-sm">Tổng số bệnh nhân</p>
          <p className="text-2xl font-semibold">
            {patientCount.toLocaleString()}
          </p>
        </div>
      </div>
      {/* Filter date */}
      <div className="flex gap-4 items-end mb-6">
        <div>
          <label>Từ ngày</label>
          <input
            type="date"
            className="border p-2 rounded w-full"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>

        <div>
          <label>Đến ngày</label>
          <input
            type="date"
            className="border p-2 rounded w-full"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={loadChart}
        >
          Lọc
        </button>
      </div>

      {/* Biểu đồ */}
      <div className="p-6 bg-gray-50 border rounded-xl shadow-sm">
        <h3 className="text-center text-lg font-semibold text-blue-600 mb-4">
          Số lịch khám đã hoàn thành theo ngày
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#60a5fa" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}
