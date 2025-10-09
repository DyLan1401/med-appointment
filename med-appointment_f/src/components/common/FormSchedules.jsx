export default function FormSchedules() {
    const schedules = [
        {
            name: "Nguyễn Văn A",
            des1: "Chúng tôi xin thông báo rằng lịch hẹn của bạn với bác sĩ đã được xác nhận. Vui lòng xem chi tiết bên dưới.",
            doctor: "Nguyễn Văn B",
            khoa: "Tai mũi họng",
            day: "25/03/2025",
            time: "16h",
            service: "Kiểm tra tổng quát",
            note: "",
            des2: "Vui lòng đến đúng giờ để đảm bỏa cuộc hẹn diễn ra suôn sẻ. Nếu có bất kì thay đổi nào, vui lòng liên hệ với chúng tôi sớm nhất có thể."
        }
    ]

    return (
        <div className="w-full h-screen ">
            <div className="w-full h-full flex justify-center items-center">
                <div className="w-[500px] h-auto flex flex-col  shadow-2xl">
                    <div className="p-5 bg-blue-500 w-full text-center text-white text-3xl font-semibold">Thông báo lịch hẹn</div>
                    <div>
                        <div className="w-full h-full flex flex-col  py-5 ">
                            {
                                schedules.map((schedule, index) => (
                                    <div
                                        className="flex flex-col gap-10 px-4 py-2"
                                        key={index}>
                                        <div className=" flex flex-col gap-3">
                                            <div>Xin chào <strong>{schedule.name}</strong></div>
                                            <div>{schedule.des1}</div>
                                        </div>
                                        <div className="flex flex-col gap-2 bg-gray-200 p-3 rounded-lg">
                                            <div> <strong>Bác sĩ:</strong> <span className="px-5">{schedule.doctor}</span></div>
                                            <div> <strong>Khoa:</strong> <span className="px-5">{schedule.khoa}</span></div>
                                            <div> <strong>Ngày:</strong><span className="px-5">{schedule.day}</span> </div>
                                            <div><strong>Thời gian:</strong> <span className="px-5">{schedule.time}</span></div>
                                            <div><strong>Thời gian:</strong> <span className="px-5">{schedule.service}</span></div>
                                            <div><strong>Ghi chú:</strong> <span className="px-5">{schedule.note}</span></div>
                                        </div>
                                        <div>
                                            <div>{schedule.des2}</div>
                                        </div>
                                        <div className="flex justify-center items-center">
                                            <button className=" font-semibold px-4 rounded-lg text-white py-3 bg-green-500" >Xem chi tiết lịch hẹn</button>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}