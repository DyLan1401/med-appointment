import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
function FormLogin() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = (e) => {
        e.preventDefault();

        let userData = null;

        if (email === "user" && password === "user123") {
            userData = { role: "patient", name: "Người dùng", email };
            navigate("/");
        } else if (email === "doctor" && password === "doctor123") {
            userData = { role: "doctor", name: "Bác sĩ", email };
            navigate("/");
        } else if (email === "admin" && password === "admin123") {
            userData = { role: "admin", name: "Quản trị", email };
            navigate("/dashboard");
        } else {
            alert("Sai thông tin đăng nhập!");
            return;
        }

        // 🔹 Lưu thông tin user vào localStorage
        localStorage.setItem("user", JSON.stringify(userData));
    };
    return (
        <>
            <div className='w-full h-screen '>
                <div className="w-full h-full justify-center items-center flex ">
                    <div className="rounded-lg w-[400px] h-[500px] font-semibold shadow-2xl bg-white px-10  justify-center ">
                        <h1 className='text-blue-300 text-3xl font-bold text-center py-5'>Đăng nhập</h1>
                        <form onSubmit={handleLogin} className="space-y-5">
                            <div className="flex flex-col">
                                <label>Email</label>
                                <input
                                    className="rounded-lg outline-1 outline-gray-500 p-2"
                                    type="text"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="flex flex-col">
                                <label>Mật khẩu</label>
                                <input
                                    className="rounded-lg outline-1 outline-gray-500 p-2"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <button className="w-full bg-gray-200 p-2 rounded-lg" type="submit">
                                Đăng nhập
                            </button>
                        </form>
                        <div className='flex  items-center py-2 '>
                            <div className='w-1/2 rounded-2xl outline-1 outline-gray-500'></div>
                            <div className='text-center py-3 px-1'> Hoặc</div>
                            <div className='w-1/2 rounded-2xl outline-1 outline-gray-500'></div>

                        </div>
                        <div className="flex flex-col space-y-3">
                            <button className='outline-gray-500 outline-1 text-blue-800 p-2 rounded-lg '>Đăng nhập với Google</button>
                            <button className='outline-gray-500 outline-1 text-blue-900 p-2 rounded-lg '>Đăng nhập với Facebook</button>
                        </div>
                        <div className=" text-center py-5 text-blue-700 ">
                            <button onClick={() => navigate("/forgetPassword")}>Quên mật khẩu?</button> | <button onClick={() => navigate("/register")}>Đăng kí ngay</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )

}

export default FormLogin

