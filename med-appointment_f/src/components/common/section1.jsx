import React from "react";

import heart from "../../assets/heart.png";
import avatar from "../../assets/avatar.jpg";
export default function Section1() {
    const ChuyenKhoas = [
        "Nhi khoa", "Sản phụ khoa", "Nội tim khoa", "Ngoại tổng quát", "Răng hàm mặt", "Da liễu",
    ]

    return (
        <div className="w-full h-full">
            <div className="w-full h-full flex flex-col justify-center items-center">
                <div className="w-full h-64 flex justify-center flex-col space-y-10 p-2 items-center bg-blue-300">
                    <div className="text-3xl font-bold  text-blue-600">Các Chuyên Khoa
                        <hr />
                    </div>
                    <div className="flex  space-x-3">
                        {ChuyenKhoas.map((khoa, index) => (
                            <button className="py-2 bg-white px-4 outline-blue-600 outline-1   text-blue-600"
                                key={index}>{khoa}</button>
                        ))}
                    </div>
                </div>
                <div className="w-full h-full flex justify-center flex-col space-y-10 items-center">
                    <div className="text-3xl font-bold py-5  text-blue-600">Đội Ngũ Bác Sĩ Nổi Bật
                    </div>
                    <div className="w-full h-full flex justify-center items-center">
                        <div className="w-full h-full flex justify-center space-x-7 items-center ">
                            <div className="w-[300px] h-auto p-5  shadow-2xl gap-y-5 items-center flex flex-col px-3">
                                <img className=" self-end   " src={heart} width={20} height={20} alt="" />
                                <div className="w-full h-full flex items-center  gap-y-2 flex-col">
                                    <img className="rounded-4xl  object-cover" src={avatar} alt="" width={250} />
                                    <div className="text-center">
                                        <div className="text-xl font-semibold">tên</div>
                                        <div className="text-lg">khoa</div>
                                    </div>
                                </div>
                            </div>

                            <div className="w-[300px] h-auto p-5  shadow-2xl gap-y-5 items-center flex flex-col px-3">
                                <img className=" self-end   " src={heart} width={20} height={20} alt="" />
                                <div className="w-full h-full flex items-center  gap-y-2 flex-col">
                                    <img className="rounded-4xl  object-cover" src={avatar} alt="" width={250} />
                                    <div className="text-center">
                                        <div className="text-xl font-semibold">tên</div>
                                        <div className="text-lg">khoa</div>
                                    </div>
                                </div>
                            </div>

                            <div className="w-[300px] h-auto p-5  shadow-2xl gap-y-5 items-center flex flex-col px-3">
                                <img className=" self-end   " src={heart} width={20} height={20} alt="" />
                                <div className="w-full h-full flex items-center  gap-y-2 flex-col">
                                    <img className="rounded-4xl  object-cover" src={avatar} alt="" width={250} />
                                    <div className="text-center">
                                        <div className="text-xl font-semibold">tên</div>
                                        <div className="text-lg">khoa</div>
                                    </div>
                                </div>
                            </div>



                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}