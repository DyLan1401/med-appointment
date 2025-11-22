import React from "react";
import { useNavigate } from "react-router-dom";

import Bg1 from "../../assets/roomjpg.jpg";
import Bg2 from "../../assets/avatar.jpg";

export default function SelectSchedule() {
    const navigate = useNavigate();

    return (
        <div className="w-full h-screen mb-2">
            <div className="w-full h-full">
                <div className="w-full h-full">
                    <div
                        style={{ backgroundImage: `url(${Bg2})` }}
                        className=" w-full h-full flex flex-col bg-cover     justify-center items-center animate-pulse">
                        <div className="font-semibold text-2xl text-center space-y-5 p-5">
                            <div> Hãy chọn dịch vụ có thể làm bạn giảm đi cơn đau và giúp sức khỏe tốt lên</div>
                            <div className="text-blue-500">Bạn đã chọn được dịch vụ chưa?</div>
                        </div>
                        <button onClick={() => navigate("/selectservice")} className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-3xl hover:shadow-2xl ">Đặt lịch (Chọn theo dịch vụ)</button>
                    </div>
                </div>
            </div>
        </div>
    )
}