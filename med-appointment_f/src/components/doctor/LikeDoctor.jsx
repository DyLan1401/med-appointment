import React from "react";

import dt1 from "../../assets/dt1.jpeg";
import dt2 from "../../assets/dt2.jpg";
export default function LikeDoctor() {
    const Doctors = [
        {
            img: dt1,
            name: "Nguyễn Văn A",
            chuyenkhoa: 'Tim mạch',
        },
        {
            img: dt2,
            name: "Nguyễn Văn B",
            chuyenkhoa: 'Tai mũi họng',
        },
        {
            img: dt1,
            name: "Nguyễn Văn c",
            chuyenkhoa: 'Khớp ',
        },
        {
            img: dt1,
            name: "Nguyễn Văn A",
            chuyenkhoa: 'Tim mạch',
        },
        {
            img: dt2,
            name: "Nguyễn Văn B",
            chuyenkhoa: 'Tai mũi họng',
        },
        {
            img: dt1,
            name: "Nguyễn Văn c",
            chuyenkhoa: 'Khớp ',
        }
    ]
    return (
        <div className='w-full h-screen '>
            <div className="w-full h-full  flex flex-col p-3">
                <h1 className="text-blue-500 text-xl font-semibold py-5">Bác sĩ yêu thích</h1>
                <div className="py-5">Danh sách các bác sĩ đã thêm vào danh sách yêu thích của mình.</div>
                <div className="w-full h-full ">
                    <div className=" grid grid-cols-3 gap-5">
                        {Doctors.map((doctor, index) => (
                            <div
                                key={index}
                                className="w-full h-full bg-gray-200 flex p-5 flex-col gap-5 shadow-2xl rounded-2xl ">
                                <div className="flex gap-3 p-2 ">
                                    <img src={doctor.img} alt=""
                                        className="w-32 h-32 rounded-4xl" />
                                    <div className="flex  justify-center  flex-col">
                                        <h1 className="font-semibold text-xl">BS.{doctor.name}</h1>
                                        <p><span className="font-semibold">Chuyên khoa:</span>{doctor.chuyenkhoa}</p>
                                    </div>
                                </div>
                                <div className="w-full h-full grid gap-2 p-2 grid-cols-2 text-white font-semibold">
                                    <button className=" py-2  rounded-2xl bg-blue-300">Xem hồ sơ</button>
                                    <button className=" py-2  rounded-2xl bg-red-400">Yêu thích</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    )
};