import React from "react";
import { useNavigate } from "react-router-dom";

function FormRegister() {
    const navigate = useNavigate();

    return (
        <>
            <div className='w-full h-screen '>
                <div className="w-full h-full justify-center items-center flex ">
                    <div className="rounded-lg w-[400px] h-auto font-semibold shadow-2xl bg-white px-10  justify-center ">
                        <h1 className='text-blue-300 text-3xl font-bold text-center py-5'>Đăng ký</h1>
                        <form action="" className='space-y-5'>
                            <div className='flex flex-col'>
                                <label htmlFor="">Họ và tên</label>
                                <input className='rounded-lg outline-1 outline-gray-500 p-2' type="text" />
                            </div>
                            <div className='flex flex-col'>
                                <label htmlFor="">Email</label>
                                <input className='rounded-lg outline-1 outline-gray-500 p-2' type="text" />
                            </div>
                            <div className='flex flex-col'>
                                <label htmlFor="">Mật khẩu</label>
                                <input className='rounded-lg outline-1 outline-gray-500 p-2' type="text" />
                            </div>
                            <button className='w-full bg-gray-200 p-2 rounded-lg' type="">Đăng ký</button>
                        </form>
                        <div className='flex  items-center py-2 '>
                            <div className='w-1/2 rounded-2xl outline-1 outline-gray-500'></div>
                            <div className='text-center py-3 px-1'> Hoặc</div>
                            <div className='w-1/2 rounded-2xl outline-1 outline-gray-500'></div>

                        </div>
                        <div className="flex flex-col space-y-3">
                            <button className='outline-gray-500 outline-1 text-blue-800 p-2 rounded-lg '>Đăng ký với Google</button>
                            <button className='outline-gray-500 outline-1 text-blue-900 p-2 rounded-lg '>Đăng ký với Facebook</button>
                        </div>
                        <div className=" text-center py-5 text-blue-700 ">
                            <button onClick={() => navigate("/login")}>Đã có tài khoản?  | Đăng nhập</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )

}

export default FormRegister