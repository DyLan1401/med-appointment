"use client";
import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import API from "../../api/axios";
import { Link } from "react-router-dom";
export default function PatientHistory() {
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        API.get("/patient/history", {
            withCredentials: true,
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`, // nếu dùng Sanctum/JWT
            },
        })
            .then(res => setAppointments(res.data))
            .catch(err => console.error("Lỗi tải lịch sử:", err));
    }, []);

    return (
        <div className="max-w-3xl mx-auto mt-10 bg-white shadow-md rounded-2xl p-6">
            <h2 className="text-2xl font-semibold text-blue-600 mb-6 text-center">
                Lịch sử khám bệnh
            </h2>

            {appointments.length === 0 ? (
                <p className="text-center text-gray-500">Không có lịch sử khám nào.</p>
            ) : (
                appointments.map((item) => (
                    <div key={item.id} className="border border-gray-200 rounded-xl p-5 mb-6">
                        <h3 className="text-lg font-semibold text-blue-500 mb-3">
                            🩺 {item.service}
                        </h3>

                        <div className="text-gray-700 space-y-1 mb-3">
                            <p><strong>Ngày:</strong> {item.date}</p>
                            <p><strong>Bác sĩ:</strong> {item.doctor}</p>
                            <p><strong>Chuyên khoa:</strong> {item.department}</p>
                            <p><strong>Dịch vụ:</strong> {item.service}</p>
                        </div>

                        <div className="mb-3">
                            <strong>Đánh giá:</strong>{" "}
                            {item.rating > 0 ? (
                                <div className="inline-flex">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Star
                                            key={i}
                                            size={18}
                                            className={i < item.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <span className="text-gray-400 ml-1">Chưa có</span>
                            )}
                        </div>

                        {item.comment && (
                            <p className="text-gray-600 italic mb-4">Bình luận: {item.comment}</p>
                        )}
                        <Link to={`/rebook/${item.id}`} state={{ appointment: item }}>
                            <button className="bg-green-500 text-white px-4 py-2 rounded-md">
                                Tái khám
                            </button>
                        </Link>

                    </div>
                ))
            )}
        </div>
    );
}
