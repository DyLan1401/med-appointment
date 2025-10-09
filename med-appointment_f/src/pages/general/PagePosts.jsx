import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/common/Navbar";
export default function PostsPage() {
    const navigate = useNavigate();

    const posts = [
        {
            id: 1,
            title: "5 cách chăm sóc sức khỏe tim mạch hiệu quả",
            author: "BS. Nguyễn Văn A",
            date: "09/10/2025",
            image:
                "https://images.unsplash.com/photo-1580281657521-6a06ff0c1f47?auto=format&fit=crop&w=800&q=80",
            desc: "Tìm hiểu các phương pháp duy trì trái tim khỏe mạnh và lối sống khoa học để phòng tránh bệnh tim mạch.",
            content: `
      ❤️ Một trái tim khỏe mạnh là nền tảng của một cuộc sống lâu dài. 
      Dưới đây là 5 cách giúp bạn chăm sóc tim mạch hiệu quả:
      
      1. Ăn nhiều rau xanh, trái cây, hạn chế chất béo bão hòa.
      2. Tập thể dục ít nhất 30 phút mỗi ngày.
      3. Kiểm soát cân nặng và huyết áp.
      4. Tránh thuốc lá và hạn chế rượu bia.
      5. Giữ tinh thần thoải mái, ngủ đủ giấc.

      Việc kiểm tra sức khỏe định kỳ giúp phát hiện sớm các vấn đề về tim và điều trị kịp thời.`
        },
        {
            id: 2,
            title: "Vì sao bạn nên khám sức khỏe định kỳ?",
            author: "BS. Trần Thị B",
            date: "06/10/2025",
            image:
                "https://images.unsplash.com/photo-1588776814546-ec7b28a09c3c?auto=format&fit=crop&w=800&q=80",
            desc: "Khám sức khỏe định kỳ giúp phát hiện sớm bệnh lý, tiết kiệm chi phí và bảo vệ sức khỏe lâu dài.",
            content: `
      Việc khám sức khỏe định kỳ đóng vai trò quan trọng trong việc phòng bệnh hơn chữa bệnh.
      Khi bạn đi khám định kỳ, bác sĩ sẽ giúp phát hiện sớm các dấu hiệu bất thường trong cơ thể, 
      từ đó điều trị kịp thời và giảm thiểu chi phí điều trị sau này.

      ✅ Nên khám sức khỏe tổng quát ít nhất 1 lần/năm.
      ✅ Với người có bệnh nền, nên khám 2–3 lần/năm.
      `
        },
        {
            id: 3,
            title: "Cách bảo vệ mắt khi làm việc với máy tính",
            author: "BS. Lê Hoàng C",
            date: "03/10/2025",
            image:
                "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=800&q=80",
            desc: "Ngồi đúng tư thế, điều chỉnh ánh sáng và nghỉ ngơi hợp lý giúp giảm nguy cơ mỏi mắt khi dùng máy tính.",
            content: `
      💻 Sử dụng máy tính trong thời gian dài có thể gây mỏi mắt, khô mắt và giảm thị lực.
      Hãy áp dụng quy tắc 20-20-20: 
      Mỗi 20 phút làm việc, hãy nhìn ra xa 20 feet (6 mét) trong 20 giây.

      Ngoài ra, hãy:
      - Điều chỉnh ánh sáng màn hình phù hợp.
      - Ngồi cách màn hình khoảng 50–70cm.
      - Uống đủ nước và chớp mắt thường xuyên.`
        },
    ];

    return (
        <div className="w-full h-full">
            <div>
                <Navbar />
            </div>
            <div className="min-h-screen bg-gray-50 py-16 px-4">
                <div className="max-w-6xl mx-auto text-center mb-12">
                    <h1 className="text-4xl font-bold text-blue-700 mb-2">Tin tức & Bài viết</h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Cập nhật kiến thức y khoa, lời khuyên sức khỏe và tin tức nổi bật từ các bác sĩ của chúng tôi.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-8 max-w-6xl mx-auto">
                    {posts.map((post) => (
                        <div
                            key={post.id}
                            onClick={() => navigate(`/blog/${post.id}`, { state: post })}
                            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
                        >
                            <img src={post.image} alt={post.title} className="w-full h-56 object-cover" />
                            <div className="p-5 text-left">
                                <h2 className="text-xl font-semibold text-gray-800 mb-2 hover:text-blue-600">
                                    {post.title}
                                </h2>
                                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{post.desc}</p>
                                <div className="text-sm text-gray-500 flex justify-between">
                                    <span>{post.author}</span>
                                    <span>{post.date}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
