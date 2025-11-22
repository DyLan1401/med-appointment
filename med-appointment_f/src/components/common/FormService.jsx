import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer"
export default function FormService() {
    const navigate = useNavigate();
    const [services, setServices] = useState([]);
    const [selectedService, setSelectedService] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // ✅ Lấy danh sách dịch vụ từ API Laravel
    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await axios.get("http://127.0.0.1:8000/api/services");
                if (res.data && res.data.data) {
                    setServices(res.data.data);
                }
            } catch (err) {
                toast.error("Không thể tải danh sách dịch vụ. Vui lòng thử lại sau!");
                setError("Không thể tải danh sách dịch vụ. Vui lòng thử lại sau!");
            } finally {
                setLoading(false);
            }
        };
        fetchServices();
    }, []);

    // ✅ Khi nhấn nút "Tiếp tục"
    const handleContinue = () => {
        if (!selectedService) {
            toast.warning("⚠️ Vui lòng chọn 1 dịch vụ để đặt lịch khám!");
            return;
        }

        // Lưu thông tin dịch vụ được chọn vào localStorage để truyền sang trang khác
        localStorage.setItem("selectedService", JSON.stringify(selectedService));
        navigate("/datlichkham");
    };

    return (

        <div className="w-full min-h-screen bg-gray-50">
            <Navbar />

            <div className="w-full h-full flex justify-center items-center py-10">
                <div className="w-[800px] h-auto flex flex-col shadow-2xl bg-white rounded-2xl overflow-hidden">
                    <div className="p-5 text-blue-500 w-full text-center text-3xl font-semibold">
                        Đặt lịch theo gói dịch vụ
                    </div>

                    <div className="p-6">
                        <div className="text-2xl font-semibold py-2">
                            1. Chọn gói dịch vụ
                        </div>

                        {loading ? (
                            <div className="text-center py-6 text-gray-500">⏳ Đang tải dữ liệu...</div>
                        ) : error ? (
                            <div className="text-center text-red-500 py-6">{error}</div>
                        ) : (
                            <div className="flex flex-col gap-4 mt-3">
                                {services.map((service) => (
                                    <div
                                        key={service.id}
                                        onClick={() => setSelectedService(service)}
                                        className={`cursor-pointer border rounded-lg p-4 transition-all duration-200 ${selectedService?.id === service.id
                                            ? "border-blue-500 bg-blue-50 shadow-md"
                                            : "border-gray-300 hover:border-blue-400"
                                            }`}
                                    >
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <div className="font-semibold text-lg text-blue-600">
                                                    {service.name}
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                    {service.description}
                                                </div>
                                            </div>
                                            <div className="font-semibold text-lg text-gray-800">
                                                {Number(service.price).toLocaleString()} VND
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="mt-6 text-center">
                            <button
                                onClick={handleContinue}
                                className="font-semibold px-6 py-3 rounded-lg text-white bg-blue-500 hover:bg-blue-600 transition-all"
                            >
                                Tiếp tục
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />

        </div>

    );
}
