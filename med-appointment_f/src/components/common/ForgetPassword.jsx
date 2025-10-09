import React from "react";
import { useNavigate } from "react-router-dom";

function ForgetPassword() {
    const navigate = useNavigate();

    return (
        <>
            <div className='w-full h-screen '>
                <div className="w-full h-full justify-center items-center flex ">
                    <div className="rounded-lg w-[400px] h-[400px] font-semibold shadow-2xl bg-white px-10  justify-center ">
                        <h1 className='text-blue-300 text-3xl font-bold text-center py-5'>Quên mật khẩu</h1>
                        <div className="py-2 text-center">
                            Vui lòng nhập email của bạn để nhận liên kết khôi phục mật khẩu
                        </div>
                        <form action="" className='space-y-5'>
                            <div className='flex flex-col'>
                                <label htmlFor="">Email</label>
                                <input className='rounded-lg outline-1 outline-gray-500 p-2' type="text" />
                            </div>
                            <button className='w-full bg-gray-200 p-2 rounded-lg' type="">Gửi liên kết</button>
                        </form>

                        <div className=" text-center py-10 text-blue-700 ">

                            <button onClick={() => navigate("/")}>Quay lại trang đăng nhập</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )

}

export default ForgetPassword