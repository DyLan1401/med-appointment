import React from "react";

export default function Footer() {


    return (
        <div className="w-full  h-full">
            <div className="w-full h-full p-5 flex justify-evenly  text-sm bg-green-950 text-white">
                <div>
                    <div className="text-lg font-semibold py-2">Về chúng tôi
                    </div>
                    <div>Cung cấp dịch vụ y tế hàng đầu với đội ngữ bác sĩ chuyên nghiệp</div>
                </div>
                <div>
                    <div className="text-lg font-semibold py-2">Liên kết hữu ích
                    </div>
                    <div>Chính sách bảo mật</div>
                    <div>Điều khoản sử dụng</div>
                    <div>FAQ</div>
                </div>
                <div>
                    <div className="text-lg font-semibold py-2">Liên hệ
                    </div>
                    <div>Địa chỉ: 53 võ văn ngân, Thủ Đức</div>
                    <div>Phone: 0123456789</div>
                    <div>Email: Example@gmail.com</div>
                </div>
            </div>

        </div>
    )
}