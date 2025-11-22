import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios"; // ✅ import axios cấu hình sẵn

function ForgetPassword() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");
        setLoading(true);

        try {
            const res = await API.post("/forgot-password", { email });
            setMessage(res.data.message);
        } catch (err) {
            setError(err.response?.data?.message || "Đã xảy ra lỗi. Vui lòng thử lại!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="w-full h-screen flex justify-center items-center bg-gray-100">
                <div className="rounded-lg w-[400px] h-auto font-semibold shadow-2xl bg-white px-10 py-8">
                    <h1 className="text-blue-500 text-3xl font-bold text-center mb-4">
                        Quên mật khẩu
                    </h1>
                    <p className="text-center text-gray-600 mb-6">
                        Vui lòng nhập email của bạn để nhận mật khẩu mới.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="flex flex-col">
                            <label className="text-gray-700 mb-1">Email</label>
                            <input
                                className="rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-200 p-2"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="example@gmail.com"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full p-2 rounded-lg text-white font-medium ${loading
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-blue-500 hover:bg-blue-600"
                                }`}
                        >
                            {loading ? "Đang gửi..." : "Gửi mật khẩu mới"}
                        </button>
                    </form>

                    {/* ✅ Hiển thị kết quả */}
                    {message && (
                        <p className="text-green-600 text-center mt-4 font-medium">
                            {message}
                        </p>
                    )}
                    {error && (
                        <p className="text-red-500 text-center mt-4 font-medium">{error}</p>
                    )}

                    <div className="text-center py-8 text-blue-700">
                        <button
                            onClick={() => navigate("/login")}
                            className="hover:underline hover:text-blue-800"
                        >
                            ← Quay lại trang đăng nhập
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ForgetPassword;
