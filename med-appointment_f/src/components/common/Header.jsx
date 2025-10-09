import React from "react";

import Navbar from "./Navbar";
import heart from "../../assets/heart.png";
import cadu from "../../assets/cadu.png";
import doctor from "../../assets/doctor.png";
export default function Header() {
    const IconHeaders = [
        {
            icon: heart,
            title: "Khám Tổng Quát",
            par: "Kiểm tra sức khỏe định kỳ toàn diện",
        },
        {
            icon: doctor,
            title: "Tư Vấn Online",
            par: "Trao đổi với bác sĩ từ xa",
        }, {
            icon: cadu,
            title: "Phẫu Thuật",
            par: "Các dịch vụ phẫu thuật chuyên sâu",
        }
    ]
    return (
        <div className="w-full h-full">
            <div className="w-full h-full flex flex-col justify-center items-center  ">
                <div className="w-full h-96 bg-blue-500  flex flex-col justify-center space-y-10 items-center text-white ">
                    <div className=" text-5xl  font-bold">Chăm sóc sức khỏa toàn diện</div>
                    <div> Nơi sức khỏe của bạn được ưu tiên hàng đầu.</div>
                    <button className="px-4 py-2 bg-white text-blue-500 font-semibold rounded-3xl">Đặt lịch ngay</button>
                </div>
                <div className="w-full h-full flex  justify-center   items-center flex-col  ">
                    <div className="text-3xl font-bold py-5 text-blue-400">Các Dịch Vụ Chính
                        <hr />
                    </div>
                    <div className="w-full h-full flex  justify-evenly items-center">
                        {IconHeaders.map((IconHeader, index) => (
                            <div className=" flex flex-col justify-center  items-center" key={index}>
                                <img className="" src={IconHeader.icon} />
                                <div className="font-semibold">{IconHeader.title}</div>
                                <p className="text-sm ">{IconHeader.par}</p>
                            </div>
                        ))}

                    </div>
                </div>
            </div>
        </div>
    )

}
