import React, { useState } from "react";
import { toast } from "react-toastify";
import { FileDown, FileSpreadsheet } from "lucide-react";

export default function PatientReport() {
    const [year, setYear] = useState(2024);

    const data = [
        { month: "Tháng 1", patients: 150 },
        { month: "Tháng 2", patients: 180 },
        { month: "Tháng 3", patients: 210 },
        { month: "Tháng 4", patients: 250 },
    ];

    const handleExportExcel = () => {
        toast.success("Đã xuất báo cáo Excel!");
    };

    const handleExportPDF = () => {
        toast.success("Đã xuất báo cáo PDF!");
    };

    return (
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-md p-6 mt-8">
            <h2 className="text-xl font-semibold text-blue-600 text-center mb-2">
                Báo cáo số lượng bệnh nhân
            </h2>
            <p className="text-gray-500 text-center text-sm mb-6">
                Thống kê số lượng bệnh nhân mới theo từng tháng trong năm.
            </p>

            {/* Bộ chọn năm */}
            <div className="flex items-center justify-center gap-3 mb-5">
                <label className="text-gray-700 text-sm font-medium">Chọn năm:</label>
                <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                >
                    {[2022, 2023, 2024, 2025].map((y) => (
                        <option key={y} value={y}>
                            {y}
                        </option>
                    ))}
                </select>
            </div>

            {/* Bảng thống kê */}
            <table className="w-full border border-gray-200 rounded-lg overflow-hidden text-sm">
                <thead className="bg-blue-600 text-white">
                    <tr>
                        <th className="py-2 px-4 text-left">Tháng</th>
                        <th className="py-2 px-4 text-left">Số lượng bệnh nhân</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, i) => (
                        <tr
                            key={i}
                            className={`border-b hover:bg-blue-50 ${i % 2 === 0 ? "bg-white" : "bg-gray-50"
                                }`}
                        >
                            <td className="py-2 px-4">{row.month}</td>
                            <td className="py-2 px-4">{row.patients}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Nút hành động */}
            <div className="flex justify-center gap-4 mt-6">
                <button
                    onClick={handleExportExcel}
                    className="bg-green-600 text-white flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-green-700"
                >
                    <FileSpreadsheet size={18} /> Xuất Excel
                </button>
                <button
                    onClick={handleExportPDF}
                    className="bg-red-600 text-white flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-red-700"
                >
                    <FileDown size={18} /> Xuất PDF
                </button>
            </div>
        </div>
    );
}
