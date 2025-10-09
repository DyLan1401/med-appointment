import React from "react";
import { useNavigate } from "react-router-dom";


export default function FormService() {
    const navigate = useNavigate();

    const Services = [
        {
            goi: "Khám tổng quát",
            des: "Gói khám sức khỏe định kì toàn diện",
            price: "500,000"
        },
        {
            goi: "Tư vấn dinh dưỡng",
            des: "Tư vấn và xây dựng chế độ ăn uống lành mạnh",
            price: "300,000"
        },
    ]

    return (
        <div className="w-full h-screen ">
            <div className="w-full h-full flex justify-center items-center">
                <div className="w-[800px] h-auto flex flex-col  shadow-2xl">
                    <div className="p-5 text-blue-500 w-full text-center  text-3xl font-semibold">Đặt lịch theo gói dịch vụ</div>
                    <div>
                        <div className="w-full h-full flex flex-col py-5 p-5 ">
                            <div className="text-2xl font-semibold py-2">
                                1.Chọn gói dịch vụ
                            </div>
                            {
                                Services.map((service, index) => (
                                    <div
                                        className="flex flex-col gap-10 px-4 py-2"
                                        key={index}>

                                        <div className=" w-full flex flex-col gap-2 outline-1 outline-gray-500 p-3 rounded-lg">
                                            <div className="w-full h-full flex justify-between">
                                                <div>
                                                    <div className="font-semibold text-lg text-blue-500">{service.goi}</div>
                                                    <div className="text-sm ">{service.des}</div>
                                                </div>
                                                <div className="font-semibold text-lg">
                                                    {service.price} VND
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                            <div className=" px-5" >
                                <button onClick={() => navigate("/datlichkham")} className=" font-semibold px-4 rounded-lg text-white py-3 bg-blue-500" >Tiếp tục</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}