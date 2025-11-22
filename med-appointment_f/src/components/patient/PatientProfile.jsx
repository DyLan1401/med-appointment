"use client";
import { useState } from "react";
import { toast } from "react-toastify";
import { Upload, Trash2 } from "lucide-react";

export default function PatientProfile() {
    const [avatar, setAvatar] = useState(null);
    const [patient, setPatient] = useState({
        name: "Nguyễn Văn A",
        email: "nguyenvana@example.com",
        phone: "0912345678",
        address: "Số 123, đường ABC, Phường 1, Quận 1, TP. Hồ Chí Minh",
        insurance: "Bảo hiểm y tế quốc gia",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPatient({ ...patient, [name]: value });
    };

    const handleSave = () => {
        toast.success("Đã lưu thay đổi hồ sơ bệnh nhân!");
    };

    const handleUpload = (e) => {
        const file = e.target.files[0];
        setAvatar(file);
    };

    const handleRemoveAvatar = () => {
        setAvatar(null);
    };

    return (
        <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-md p-8 mt-10">
            <h2 className="text-2xl font-bold text-blue-600 text-center mb-2">
                Hồ sơ của tôi
            </h2>
            <p className="text-center text-sm text-gray-500 mb-6">
                Cập nhật thông tin cá nhân và quản lý tài khoản của bạn.
            </p>

            {/* Avatar */}
            <div className="flex flex-col items-center mb-6">
                <img
                    src={
                        avatar
                            ? URL.createObjectURL(avatar)
                            : "https://cdn-icons-png.flaticon.com/512/706/706818.png"
                    }
                    alt="Avatar"
                    className="w-28 h-28 rounded-full border-4 border-blue-100 object-cover mb-3"
                />
                <div className="flex gap-3">
                    <label className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition">
                        <Upload size={18} />
                        Tải ảnh lên
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleUpload}
                        />
                    </label>
                    <button
                        onClick={handleRemoveAvatar}
                        className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                    >
                        <Trash2 size={18} />
                        Xóa ảnh
                    </button>
                </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
                <div>
                    <label className="text-sm font-semibold text-gray-600">Họ và Tên</label>
                    <input
                        name="name"
                        value={patient.name}
                        onChange={handleChange}
                        className="w-full border rounded-md p-2 mt-1"
                    />
                </div>

                <div>
                    <label className="text-sm font-semibold text-gray-600">Email</label>
                    <input
                        name="email"
                        value={patient.email}
                        disabled
                        className="w-full border rounded-md p-2 mt-1 bg-gray-100"
                    />
                </div>

                <div>
                    <label className="text-sm font-semibold text-gray-600">Số điện thoại</label>
                    <input
                        name="phone"
                        value={patient.phone}
                        onChange={handleChange}
                        className="w-full border rounded-md p-2 mt-1"
                    />
                </div>

                <div>
                    <label className="text-sm font-semibold text-gray-600">Địa chỉ</label>
                    <textarea
                        name="address"
                        value={patient.address}
                        onChange={handleChange}
                        className="w-full border rounded-md p-2 mt-1"
                        rows="2"
                    />
                </div>

                <div>
                    <label className="text-sm font-semibold text-gray-600">
                        Thông tin bảo hiểm
                    </label>
                    <input
                        name="insurance"
                        value={patient.insurance}
                        onChange={handleChange}
                        className="w-full border rounded-md p-2 mt-1"
                    />
                </div>
            </div>

            <button
                onClick={handleSave}
                className="w-full mt-6 bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition"
            >
                Lưu thay đổi
            </button>
        </div>
    );
}
