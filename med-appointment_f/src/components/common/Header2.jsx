import React from "react";

import Navbar from "./Navbar";
import heart from "../../assets/heart.png";
import cadu from "../../assets/cadu.png";
import doctor from "../../assets/doctor.png";

export default function MovingImageBanner() {

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
        <div className="w-full h-full flex  justify-center  space-y-10 items-center flex-col  ">
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
    )
}
