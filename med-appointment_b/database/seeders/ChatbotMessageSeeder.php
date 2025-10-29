<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ChatbotMessageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [

            // ===============================
            // 💬 NHÓM 1: CHÀO HỎI CƠ BẢN
            // ===============================
            ['question' => 'chào', 'answer' => 'Xin chào bạn 👋! Tôi là ChatCare — trợ lý ảo của hệ thống y tế.'],
            ['question' => 'xin chào', 'answer' => 'Chào bạn 👋, bạn cần tôi hỗ trợ về đặt lịch, bác sĩ hay thông tin khám bệnh?'],
            ['question' => 'hi', 'answer' => 'Hi 👋! Tôi ở đây để giúp bạn đặt lịch khám hoặc tra cứu bác sĩ.'],
            ['question' => 'alo', 'answer' => 'Alo, ChatCare xin nghe 📞. Bạn cần hỗ trợ gì hôm nay?'],
            ['question' => 'bạn là ai', 'answer' => 'Tôi là ChatCare 💙 — trợ lý ảo giúp bệnh nhân đặt lịch, xem bác sĩ, và tư vấn sức khỏe.'],
            ['question' => 'bạn tên gì', 'answer' => 'Tôi tên là ChatCare 💬 — trợ lý y tế luôn sẵn sàng hỗ trợ bạn.'],
            ['question' => 'rất vui được gặp bạn', 'answer' => 'Tôi cũng rất vui được gặp bạn 💙!'],
            ['question' => 'chào buổi sáng', 'answer' => 'Chào buổi sáng 🌞! Chúc bạn một ngày nhiều năng lượng.'],
            ['question' => 'chào buổi tối', 'answer' => 'Chào buổi tối 🌙. Hy vọng bạn đã có một ngày tuyệt vời!'],
            ['question' => 'chào buổi chiều', 'answer' => 'Chào buổi chiều 🌤️. Bạn có cần tôi giúp đặt lịch khám không?'],

            // ===============================
            // 📅 NHÓM 2: ĐẶT LỊCH KHÁM
            // ===============================
            ['question' => 'đặt lịch khám', 'answer' => 'Bạn vui lòng cho tôi biết tên bác sĩ hoặc chuyên khoa muốn khám nhé 🏥.'],
            ['question' => 'làm sao để đặt lịch khám', 'answer' => 'Bạn chỉ cần nhập tên bác sĩ hoặc chuyên khoa. Tôi sẽ hướng dẫn từng bước 👣.'],
            ['question' => 'tôi muốn đặt lịch', 'answer' => 'Vâng, bạn có thể cho tôi biết muốn đặt lịch với bác sĩ nào hoặc chuyên khoa nào không?'],
            ['question' => 'đặt lịch hôm nay được không', 'answer' => 'Tùy bác sĩ, nhưng nhiều người vẫn có khung giờ trống hôm nay 📅. Bạn muốn tôi kiểm tra giúp không?'],
            ['question' => 'đặt lịch qua điện thoại được không', 'answer' => 'Bạn có thể đặt trực tuyến tại đây hoặc gọi tổng đài 1900-1234 📞.'],
            ['question' => 'có thể đặt lịch giúp tôi không', 'answer' => 'Dĩ nhiên rồi 💙. Bạn chỉ cần cho biết tên bác sĩ hoặc chuyên khoa nhé.'],
            ['question' => 'đặt lịch gấp được không', 'answer' => 'Nếu bác sĩ có lịch trống, tôi sẽ giúp bạn đặt ngay 🏃‍♂️.'],
            ['question' => 'tôi muốn hủy lịch khám', 'answer' => 'Bạn có thể hủy lịch trong phần “Lịch hẹn của tôi” hoặc cung cấp mã lịch để tôi hỗ trợ.'],
            ['question' => 'đặt lịch cho người khác được không', 'answer' => 'Được ạ 💬. Bạn chỉ cần nhập thông tin người cần khám và chọn bác sĩ phù hợp.'],
            ['question' => 'đặt lịch khám lại', 'answer' => 'Bạn vui lòng cho biết tên bác sĩ và ngày muốn tái khám nhé 🔁.'],
            ['question' => 'cách xác nhận lịch khám', 'answer' => 'Sau khi bạn chọn khung giờ, hệ thống sẽ gửi thông báo xác nhận qua email hoặc SMS 📩.'],
            ['question' => 'có cần đăng nhập để đặt lịch không', 'answer' => 'Bạn có thể đặt lịch mà không cần tài khoản, nhưng nếu đăng nhập sẽ theo dõi dễ hơn.'],

            // ===============================
            // 👨‍⚕️ NHÓM 3: TRA CỨU BÁC SĨ
            // ===============================
            ['question' => 'danh sách bác sĩ', 'answer' => 'Hệ thống có hơn 100 bác sĩ thuộc 15 chuyên khoa 👨‍⚕️. Bạn muốn tôi lọc theo chuyên khoa nào?'],
            ['question' => 'bác sĩ giỏi nhất', 'answer' => 'Tất cả đều có chuyên môn cao 🩺. Bạn muốn tôi liệt kê bác sĩ được đánh giá tốt nhất không?'],
            ['question' => 'bác sĩ nữ', 'answer' => 'Chúng tôi có nhiều bác sĩ nữ tận tâm 👩‍⚕️. Bạn muốn tôi liệt kê theo chuyên khoa nào?'],
            ['question' => 'bác sĩ làm việc buổi tối', 'answer' => 'Có ạ 🌙. Một số bác sĩ làm việc đến 21h00, bạn muốn tôi tra giúp không?'],
            ['question' => 'bác sĩ làm việc cuối tuần', 'answer' => 'Có nhiều bác sĩ trực thứ 7 và chủ nhật 🗓️. Bạn muốn xem chuyên khoa nào?'],
            ['question' => 'bác sĩ nội tổng quát', 'answer' => 'Khoa Nội Tổng Quát có BS. Nguyễn Văn A, BS. Lê Thị B 💊.'],
            ['question' => 'bác sĩ tim mạch', 'answer' => 'Chuyên khoa Tim Mạch có BS. Trần Văn T và BS. Nguyễn Minh K ❤️.'],
            ['question' => 'bác sĩ nhi', 'answer' => 'Khoa Nhi có BS. Lê Thị Nhi và BS. Trần Hoàng Long 👶.'],
            ['question' => 'bác sĩ da liễu', 'answer' => 'Khoa Da Liễu có BS. Nguyễn Hồng Hạnh và BS. Lê Văn Nam 🌿.'],
            ['question' => 'bác sĩ sản phụ khoa', 'answer' => 'Bạn có thể chọn BS. Phạm Thị Hồng hoặc BS. Lê Thanh T trong khoa Sản Phụ 👩‍🍼.'],
            ['question' => 'bác sĩ mắt', 'answer' => 'Khoa Mắt có BS. Nguyễn Anh Minh và BS. Lê Thị Lan 👁️.'],
            ['question' => 'bác sĩ tai mũi họng', 'answer' => 'Khoa Tai Mũi Họng có BS. Phan Văn B và BS. Nguyễn Mai Hương 👂.'],

            // ===============================
            // 💊 NHÓM 4: TƯ VẤN SỨC KHỎE
            // ===============================
            ['question' => 'tôi bị ho nên khám ở đâu', 'answer' => 'Bạn nên khám ở khoa Hô Hấp hoặc Tai Mũi Họng 💨.'],
            ['question' => 'tôi bị đau đầu', 'answer' => 'Đau đầu kéo dài có thể liên quan thần kinh hoặc huyết áp 🧠. Bạn nên khám tại khoa Nội Tổng Quát.'],
            ['question' => 'trẻ bị sốt nên khám khoa nào', 'answer' => 'Bạn nên đưa bé đến Khoa Nhi 👶 để kiểm tra ngay.'],
            ['question' => 'da bị ngứa', 'answer' => 'Bạn nên khám Khoa Da Liễu 🌿 để được chẩn đoán chính xác.'],
            ['question' => 'bị đau bụng dưới', 'answer' => 'Có thể do tiêu hóa hoặc sản phụ khoa ⚕️. Tôi khuyên nên khám khoa Nội hoặc Sản.'],
            ['question' => 'bị mất ngủ', 'answer' => 'Bạn nên khám khoa Thần Kinh hoặc Tâm Lý 💤.'],
            ['question' => 'bị khó thở', 'answer' => 'Đây có thể là dấu hiệu tim mạch hoặc hô hấp. Bạn nên đến khám ngay 🫁.'],
            ['question' => 'bị chóng mặt', 'answer' => 'Bạn nên khám khoa Nội Tổng Quát hoặc Thần Kinh. Tôi có thể giúp đặt lịch không?'],
            ['question' => 'đau dạ dày', 'answer' => 'Bạn nên đến khoa Tiêu Hóa 💊 để được nội soi và điều trị sớm.'],
            ['question' => 'tôi muốn tư vấn sức khỏe', 'answer' => 'Tôi sẵn sàng 💙! Bạn mô tả tình trạng sức khỏe để tôi gợi ý chuyên khoa phù hợp nhé.'],
            ['question' => 'tôi bị tiểu đường', 'answer' => 'Bạn nên khám khoa Nội tiết 💉 để được xét nghiệm đường huyết và tư vấn điều trị.'],
            ['question' => 'tôi bị cao huyết áp', 'answer' => 'Bạn nên đến khoa Tim Mạch ❤️ để được kiểm tra và kê thuốc.'],
            ['question' => 'tôi bị béo phì', 'answer' => 'Bạn có thể khám ở khoa Dinh Dưỡng để nhận tư vấn về chế độ ăn và vận động 🥗.'],

            // ===============================
            // 💳 NHÓM 5: BẢO HIỂM & THANH TOÁN
            // ===============================
            ['question' => 'bảo hiểm y tế', 'answer' => 'Hệ thống chấp nhận hầu hết các loại bảo hiểm y tế 📋.'],
            ['question' => 'thanh toán như thế nào', 'answer' => 'Bạn có thể thanh toán tại quầy hoặc qua ví điện tử (Momo, ZaloPay, VNPay) 💳.'],
            ['question' => 'bệnh viện có chấp nhận bảo hiểm không', 'answer' => 'Có ạ ✅. Bạn chỉ cần mang theo thẻ bảo hiểm khi đến khám.'],
            ['question' => 'có hoàn tiền khi hủy lịch không', 'answer' => 'Nếu bạn hủy trước 24h, hệ thống sẽ hoàn 100% phí 💰.'],
            ['question' => 'có hỗ trợ trả góp không', 'answer' => 'Với dịch vụ cao cấp, có thể hỗ trợ trả góp 0% lãi suất 💵.'],

            // ===============================
            // 💰 NHÓM 6: GIÁ KHÁM
            // ===============================
            ['question' => 'giá khám', 'answer' => 'Giá khám dao động từ 150.000đ đến 500.000đ tùy bác sĩ và chuyên khoa 💰.'],
            ['question' => 'giá khám tim mạch', 'answer' => 'Giá khám tim mạch trung bình 250.000đ/lần ❤️.'],
            ['question' => 'giá khám tổng quát', 'answer' => 'Khám tổng quát trọn gói chỉ từ 400.000đ 🩺.'],
            ['question' => 'có miễn phí khám không', 'answer' => 'Một số chương trình khám sức khỏe miễn phí vào cuối tuần 🎁.'],
            ['question' => 'giá xét nghiệm máu', 'answer' => 'Xét nghiệm máu cơ bản từ 80.000đ đến 200.000đ tùy loại.'],

            // ===============================
            // 🧭 NHÓM 7: HƯỚNG DẪN SỬ DỤNG
            // ===============================
            ['question' => 'hướng dẫn sử dụng hệ thống', 'answer' => 'Bạn có thể:\n1️⃣ Tìm bác sĩ hoặc chuyên khoa.\n2️⃣ Chọn khung giờ.\n3️⃣ Xác nhận và thanh toán 💬.'],
            ['question' => 'hướng dẫn đặt lịch', 'answer' => 'Bạn chỉ cần chọn chuyên khoa → bác sĩ → khung giờ → xác nhận ✅.'],
            ['question' => 'tôi không biết bắt đầu từ đâu', 'answer' => 'Không sao ạ 😄. Bạn chỉ cần nói bạn muốn khám bệnh gì, tôi sẽ hướng dẫn từng bước.'],
            ['question' => 'tôi gặp lỗi khi đặt lịch', 'answer' => 'Bạn thử tải lại trang hoặc gửi mã lỗi để tôi hỗ trợ 🔧.'],
            ['question' => 'làm sao xem lại lịch đã đặt', 'answer' => 'Bạn vào mục “Lịch hẹn của tôi” để xem chi tiết các lịch đã đặt 🗓️.'],

            // ===============================
            // ☎️ NHÓM 8: LIÊN HỆ & HỖ TRỢ
            // ===============================
            ['question' => 'tổng đài hỗ trợ', 'answer' => 'Bạn có thể liên hệ tổng đài 1900-1234 để được hỗ trợ trực tiếp 📞.'],
            ['question' => 'email hỗ trợ', 'answer' => 'Email hỗ trợ: support@chatcare.vn 📧.'],
            ['question' => 'địa chỉ bệnh viện', 'answer' => 'Hệ thống nằm tại 123 Nguyễn Văn Cừ, Quận 5, TP.HCM 📍.'],
            ['question' => 'giờ làm việc', 'answer' => 'Chúng tôi làm việc từ 7h00 đến 21h00 mỗi ngày 🕗.'],
            ['question' => 'có hỗ trợ 24/7 không', 'answer' => 'ChatCare hoạt động 24/7 để hỗ trợ đặt lịch và tư vấn nhanh nhất 💬.'],

            // ===============================
            // 🙏 NHÓM 9: CẢM ƠN & KẾT THÚC
            // ===============================
            ['question' => 'cảm ơn', 'answer' => 'Rất vui vì được hỗ trợ bạn 💙. Chúc bạn sức khỏe tốt!'],
            ['question' => 'cảm ơn nhé', 'answer' => 'Không có gì đâu ạ 😊. Nếu cần hỗ trợ thêm, tôi luôn sẵn sàng!'],
            ['question' => 'cảm ơn nhiều', 'answer' => 'Rất hân hạnh được giúp bạn 💬.'],

            // ===============================
            // 👋 NHÓM 10: TẠM BIỆT
            // ===============================
            ['question' => 'tạm biệt', 'answer' => 'Tạm biệt bạn 👋. Hẹn gặp lại lần sau nhé!'],
            ['question' => 'bye', 'answer' => 'Bye bye 👋. Chúc bạn một ngày tốt lành!'],
            ['question' => 'hẹn gặp lại', 'answer' => 'Hẹn gặp lại bạn 💙. Chúc bạn luôn mạnh khỏe!'],
        ];

        DB::table('chatbot_messages')->insert($data);
    }
}