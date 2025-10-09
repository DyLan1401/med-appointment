"use client";
import { useState } from "react";
import { Upload, Trash2, FileText } from "lucide-react";

export default function DoctorProfile() {
    const [doctor, setDoctor] = useState({
        name: "Đặng Thanh Phong",
        email: "dangthanhphong@example.com",
        phone: "0987654321",
        specialty: "Tim mạch",
        bio: "Chuyên gia trong chẩn đoán và điều trị các bệnh về tim mạch...",
    });

    const [avatar, setAvatar] = useState(null);
    const [certificates, setCertificates] = useState([
        { name: "Chứng chỉ Hội Tim mạch Việt Nam", type: "PNG" },
        { name: "Bằng tốt nghiệp Bác sĩ Y khoa", type: "PDF" },
    ]);

    const handleFileUpload = (e) => {
        const files = Array.from(e.target.files).map((file) => ({
            name: file.name,
            type: file.type.split("/")[1].toUpperCase(),
        }));
        setCertificates((prev) => [...prev, ...files]);
    };

    const handleDeleteFile = (index) => {
        setCertificates(certificates.filter((_, i) => i !== index));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDoctor({ ...doctor, [name]: value });
    };

    const handleSave = () => {
        alert("Đã lưu thay đổi hồ sơ!");
        console.log(doctor);
    };

    return (
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-md p-6 mt-10">
            <h2 className="text-xl font-bold text-blue-600 mb-4">Hồ sơ cá nhân Bác sĩ</h2>
            <p className="text-sm text-gray-500 mb-6">
                Cập nhật thông tin cá nhân và quản lý các chứng chỉ của bạn.
            </p>

            {/* Avatar */}
            <div className="flex flex-col items-center mb-6">
                <img
                    src={
                        avatar
                            ? URL.createObjectURL(avatar)
                            : "https://cdn-icons-png.flaticon.com/512/4140/4140048.png"
                    }
                    alt="Avatar"
                    className="w-28 h-28 rounded-full border-4 border-blue-100 object-cover mb-3"
                />
                <label className="cursor-pointer text-blue-600 text-sm hover:underline">
                    <Upload size={16} className="inline mr-1" />
                    Tải ảnh đại diện mới
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => setAvatar(e.target.files[0])}
                    />
                </label>
            </div>

            {/* Info Form */}
            <div className="space-y-4">
                <div>
                    <label className="text-sm font-semibold text-gray-600">Họ và tên</label>
                    <input
                        name="name"
                        value={doctor.name}
                        onChange={handleChange}
                        className="w-full border rounded-md p-2 mt-1"
                    />
                </div>

                <div>
                    <label className="text-sm font-semibold text-gray-600">Email</label>
                    <input
                        name="email"
                        value={doctor.email}
                        onChange={handleChange}
                        className="w-full border rounded-md p-2 mt-1 bg-gray-100"
                        disabled
                    />
                </div>

                <div>
                    <label className="text-sm font-semibold text-gray-600">Số điện thoại</label>
                    <input
                        name="phone"
                        value={doctor.phone}
                        onChange={handleChange}
                        className="w-full border rounded-md p-2 mt-1"
                    />
                </div>

                <div>
                    <label className="text-sm font-semibold text-gray-600">Chuyên khoa</label>
                    <input
                        name="specialty"
                        value={doctor.specialty}
                        onChange={handleChange}
                        className="w-full border rounded-md p-2 mt-1"
                    />
                </div>

                <div>
                    <label className="text-sm font-semibold text-gray-600">Tiểu sử</label>
                    <textarea
                        name="bio"
                        value={doctor.bio}
                        onChange={handleChange}
                        className="w-full border rounded-md p-2 mt-1"
                        rows="3"
                    />
                </div>
            </div>

            <button
                onClick={handleSave}
                className="mt-5 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
                Lưu thay đổi
            </button>

            {/* Certificates Section */}
            <div className="mt-10">
                <h3 className="font-bold text-gray-700 mb-3">Chứng chỉ và Bằng cấp</h3>
                <p className="text-sm text-gray-500 mb-3">
                    Quản lý các chứng chỉ chuyên môn của bạn.
                </p>

                <label className="border-2 border-dashed border-blue-300 p-4 rounded-lg flex flex-col items-center cursor-pointer hover:bg-blue-50 transition">
                    <Upload size={20} className="text-blue-500 mb-1" />
                    <span className="text-sm text-blue-600">Tải lên chứng chỉ mới</span>
                    <input
                        type="file"
                        multiple
                        className="hidden"
                        onChange={handleFileUpload}
                    />
                </label>

                {/* List of Files */}
                <div className="mt-4 space-y-2">
                    {certificates.map((file, index) => (
                        <div
                            key={index}
                            className="flex justify-between items-center bg-gray-50 p-3 rounded-md border"
                        >
                            <div className="flex items-center gap-2">
                                <FileText className="text-blue-500" />
                                <span className="font-medium text-gray-700">{file.name}</span>
                                <span className="text-xs text-gray-400">({file.type})</span>
                            </div>
                            <Trash2
                                className="text-red-500 cursor-pointer hover:text-red-700"
                                size={18}
                                onClick={() => handleDeleteFile(index)}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
