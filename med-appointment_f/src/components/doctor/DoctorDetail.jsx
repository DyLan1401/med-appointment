import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Star, Phone, Mail, Calendar } from "lucide-react";

// Đây là danh sách bác sĩ giống như trong DoctorTeam
const allDoctors = [

    {
        name: "BS. Võ Thành Trung",
        specialty: "Nội Tiết",
        experience: "15 năm kinh nghiệm",
        img: "https://via.placeholder.com/150",
        phone: "0901 123 456",
        email: "vo.trung@hospital.com",
        rating: 4.8,
        feedbacks: [
            { id: 1, name: "Nguyễn Văn A", comment: "Rất tận tâm", rating: 5 },
            { id: 2, name: "Trần Thị B", comment: "Giải thích rõ ràng", rating: 4 },
        ],
    },
    {
        name: "BS. Đồng Thị Thu Thắm",
        specialty: "Nội Tiết",
        experience: "10 năm kinh nghiệm",
        img: "https://via.placeholder.com/150",
        phone: "0902 123 456",
        email: "dong.tham@hospital.com",
        rating: 4.5,
        feedbacks: [
            { id: 1, name: "Nguyễn Văn C", comment: "Chu đáo và nhẹ nhàng", rating: 5 },
        ],
    },
    // ... thêm tất cả bác sĩ khác ở đây
];
export default function DoctorDetail() {
    const navigate = useNavigate();

    const { name } = useParams();
    const doctor = allDoctors.find((d) => d.name === decodeURIComponent(name));

    if (!doctor) return <div className="p-6"></div>;

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-md p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* LEFT: Doctor Info */}
                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <img
                            src={doctor.img}
                            alt={doctor.name}
                            className="w-28 h-28 object-cover rounded-full shadow-lg"
                        />
                        <div>
                            <h2 className="text-2xl font-bold">{doctor.name}</h2>
                            <p className="text-blue-600 font-medium">{doctor.specialty}</p>
                            <p className="text-gray-600">{doctor.experience}</p>
                            <div className="flex items-center mt-2 text-yellow-500">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        size={18}
                                        fill={i < Math.round(doctor.rating) ? "gold" : "none"}
                                    />
                                ))}
                                <span className="ml-2 text-gray-700">{doctor.rating.toFixed(1)} / 5.0</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3 text-gray-700">
                        <p className="flex items-center gap-2">
                            <Phone size={18} /> {doctor.phone}
                        </p>
                        <p className="flex items-center gap-2">
                            <Mail size={18} /> {doctor.email}
                        </p>
                    </div>

                    <button
                        onClick={() => navigate("/doctor")} // <--- dùng navigate từ hook
                        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-blue-700 transition">
                        Quay lại
                    </button>
                </div>

                {/* RIGHT: Reviews & Feedback */}
                <div>
                    <h3 className="text-xl font-semibold mb-4">Đánh giá & Nhận xét</h3>
                    <div className="space-y-4">
                        {doctor.feedbacks.map((fb) => (
                            <div
                                key={fb.id}
                                className="p-4 border rounded-xl bg-gray-50 hover:bg-gray-100 transition"
                            >
                                <div className="flex justify-between items-center">
                                    <p className="font-medium text-gray-800">{fb.name}</p>
                                    <div className="flex text-yellow-500">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={16} fill={i < fb.rating ? "gold" : "none"} />
                                        ))}
                                    </div>
                                </div>
                                <p className="text-gray-600 mt-2">{fb.comment}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
