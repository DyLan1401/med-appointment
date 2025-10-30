import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function ChangePassword() {
    const navigate = useNavigate();
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleChangePassword = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setMessage("❌ Xác nhận mật khẩu không khớp!");
            return;
        }

        try {
            const token = localStorage.getItem("token");

            const res = await axios.post(
                "http://127.0.0.1:8000/api/change-password",
                {
                    current_password: currentPassword,
                    new_password: newPassword,
                    new_password_confirmation: confirmPassword,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setMessage("✅ " + res.data.message);
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");

            setTimeout(() => navigate("/"), 2000);
        } catch (error) {
            setMessage("❌ " + (error.response?.data?.message || "Đổi mật khẩu thất bại!"));
        }
    };

    return (
        <>
            <div className='w-full h-screen '>
                <div className="w-full h-full justify-center items-center flex ">
                    <div className="rounded-lg w-[400px] h-[400px] font-semibold shadow-2xl bg-white px-10  justify-center ">
                        <h1 className='text-blue-300 text-3xl font-bold text-center py-5'>Đổi mật khẩu</h1>

                        <form onSubmit={handleChangePassword} className='space-y-5'>
                            <div className='flex flex-col'>
                                <label>Mật khẩu hiện tại</label>
                                <input
                                    className='rounded-lg outline-1 outline-gray-500 p-2'
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                />
                            </div>

                            <div className='flex flex-col'>
                                <label>Mật khẩu mới</label>
                                <input
                                    className='rounded-lg outline-1 outline-gray-500 p-2'
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                            </div>

                            <div className='flex flex-col'>
                                <label>Xác nhận mật khẩu mới</label>
                                <input
                                    className='rounded-lg outline-1 outline-gray-500 p-2'
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </div>

                            <button className='w-full bg-gray-200 p-2 rounded-lg' type="submit">
                                Đổi mật khẩu
                            </button>
                        </form>

                        {message && (
                            <p className="text-center text-red-600 py-3">{message}</p>
                        )}

                        <div className=" text-center py-10 text-blue-700 ">
                            <button onClick={() => navigate("/")}>Quay lại trang chủ</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ChangePassword;
