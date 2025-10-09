import React from "react";
import { Link } from "react-router-dom";

const teams = [
    {
        title: "Khoa Nội Tiết",
        description: "Thiết lập lịch trình hoạt động của khoa Tiết Nội.",
        members: [
            {
                name: "BS. Võ Thành Trung",
                role: "Trưởng Khoa",
                img: "https://via.placeholder.com/150",
                specialty: "Nội Tiết",
                experience: "15 năm kinh nghiệm",
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
                role: "Thư Ký",
                img: "https://via.placeholder.com/150",
                specialty: "Nội Tiết",
                experience: "10 năm kinh nghiệm",
                phone: "0902 123 456",
                email: "dong.tham@hospital.com",
                rating: 4.5,
                feedbacks: [
                    { id: 1, name: "Nguyễn Văn C", comment: "Chu đáo và nhẹ nhàng", rating: 5 },
                ],
            },
        ],
    },
    {
        title: "Khoa Tiểu Phẫu",
        description: "Trau dồi kỹ năng và phát triển ứng dụng trong y tế.",
        members: [
            {
                name: "BS. Nguyễn Huy Hoàng",
                role: "Trưởng Bộ Môn",
                img: "https://via.placeholder.com/150",
                specialty: "Tiểu Phẫu",
                experience: "12 năm kinh nghiệm",
                phone: "0903 123 456",
                email: "nguyen.hoang@hospital.com",
                rating: 4.6,
                feedbacks: [
                    { id: 1, name: "Phạm Thị D", comment: "Khám kỹ và tận tâm", rating: 5 },
                ],
            },
            {
                name: "BS. Ngô Minh Anh Thư",
                role: "Giảng Viên",
                img: "https://via.placeholder.com/150",
                specialty: "Tiểu Phẫu",
                experience: "8 năm kinh nghiệm",
                phone: "0904 123 456",
                email: "ngo.minhthu@hospital.com",
                rating: 4.4,
                feedbacks: [
                    { id: 1, name: "Trần Văn E", comment: "Rất nhiệt tình", rating: 5 },
                ],
            },
            // ... bạn có thể thêm các bác sĩ khác tương tự
        ],
    },
];

export default function DoctorTeam() {
    return (
        <div className="w-full h-full">
            <div className="w-full h-full flex justify-center flex-col items-center p-5">
                <h1 className="text-blue-600 font-semibold text-3xl self-start">
                    Danh sách tất cả các bác sĩ
                </h1>
                <div className="px-6 py-10 bg-gray-50 min-h-screen">
                    {teams.map((team, index) => (
                        <div key={index} className="mb-16">
                            <h2 className="text-3xl font-bold text-blue-900 mb-2">{team.title}</h2>
                            <p className="text-gray-600 max-w-3xl mb-8">{team.description}</p>

                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
                                {team.members.map((member, i) => (
                                    <Link key={i} to={`/doctor/${encodeURIComponent(member.name)}`}>
                                        <div className="flex flex-col items-center bg-white p-4 rounded-2xl shadow-sm hover:shadow-md transition">
                                            <img
                                                src={member.img}
                                                alt={member.name}
                                                className="w-28 h-28 object-cover rounded-full border-4 border-blue-200 mb-3"
                                            />
                                            <h3 className="text-blue-800 font-semibold text-center">{member.name}</h3>
                                            <p className="text-gray-500 text-sm">{member.role}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
