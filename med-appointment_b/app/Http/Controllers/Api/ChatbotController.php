<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ChatbotMessage;

class ChatbotController extends Controller
{
    public function getReply(Request $request)
    {
        $message = strtolower(trim($request->input('message')));
        $normalized = $this->normalizeText($message);

        // Tìm chính xác trong database
        $reply = ChatbotMessage::whereRaw('LOWER(question) LIKE ?', ["%{$normalized}%"])->first();
        if ($reply) {
            return response()->json(['reply' => $reply->answer]);
        }

        // Danh sách từ khóa nâng cao (chia theo nhóm)
        $keywordReplies = [
            // --- Giao tiếp cơ bản ---
            'chào' => 'Xin chào bạn 👋! Tôi là trợ lý sức khỏe ảo. Bạn muốn tôi giúp gì hôm nay?',
            'hello' => 'Hello! 👋 Tôi có thể giúp bạn đặt lịch hoặc tra cứu bác sĩ.',
            'hi' => 'Chào bạn 👋, tôi có thể giúp gì hôm nay?',

            // --- Đặt lịch khám ---
            'đặt lịch' => 'Để đặt lịch khám, bạn vui lòng cung cấp tên bác sĩ hoặc chuyên khoa nhé 🏥.',
            'lịch khám' => 'Bạn muốn xem lịch khám của bác sĩ nào ạ?',
            'đặt hẹn' => 'Bạn có thể cung cấp thời gian mong muốn để tôi hỗ trợ đặt lịch ✅.',

            // --- Chuyên khoa ---
            'tim mạch' => 'Khoa Tim Mạch hiện có các bác sĩ: Trần Văn A, Lê Thị B và Nguyễn C. ❤️',
            'nhi khoa' => 'Khoa Nhi có bác sĩ Phạm Thị Hồng và Nguyễn Văn D chuyên về trẻ em 👶.',
            'da liễu' => 'Bạn bị vấn đề da liễu? Khoa Da liễu hiện có bác sĩ Nguyễn Hương chuyên trị mụn, viêm da, dị ứng 🌿.',
            'tai mũi họng' => 'Khoa Tai-Mũi-Họng có bác sĩ Phan Văn K và Lê Thị M 👂.',
            'nội tổng quát' => 'Khoa Nội tổng quát tiếp nhận các trường hợp thông thường. Bạn muốn đặt lịch không?',

            // --- Giờ làm việc ---
            'giờ làm việc' => 'Bệnh viện làm việc từ 7h30 - 17h30 (Thứ 2 - Thứ 7) ⏰.',
            'làm việc' => 'Chúng tôi làm việc từ 7h30 - 17h30 mỗi ngày (trừ Chủ nhật).',

            // --- Giá / Chi phí ---
            'giá' => 'Chi phí khám dao động từ 150.000 - 300.000 VNĐ tùy chuyên khoa 💰.',
            'phí khám' => 'Phí khám ban đầu khoảng 150.000 VNĐ, tùy dịch vụ có thể thay đổi.',
            'bảo hiểm' => 'Hệ thống có hỗ trợ bảo hiểm y tế nhé 🩺.',

            // --- Hỗ trợ & hướng dẫn ---
            'hướng dẫn' => "Bạn có thể hỏi tôi về:\n- Đặt lịch khám\n- Danh sách bác sĩ\n- Giá dịch vụ\n- Giờ làm việc\n- Hỗ trợ kỹ thuật 💡",
            'hỗ trợ' => 'Tôi luôn sẵn sàng hỗ trợ bạn! Bạn cần giúp về đặt lịch, tra cứu hay báo sự cố? 🤖',
            'tư vấn' => 'Bạn muốn tư vấn về vấn đề gì ạ? Sức khỏe, bác sĩ hay thuốc men?',

            // --- Cảm ơn & tạm biệt ---
            'cảm ơn' => 'Rất vui vì được hỗ trợ bạn 💙. Chúc bạn nhiều sức khỏe!',
            'tạm biệt' => 'Tạm biệt bạn 👋. Chúc một ngày tốt lành!',
            'bye' => 'Bye bye 👋! Hẹn gặp lại bạn sau!',
            'hẹn gặp' => 'Rất mong sớm được hỗ trợ bạn lần tới! 👨‍⚕️',

            // --- Triệu chứng cơ bản ---
            'đau đầu' => 'Bạn có thể bị căng thẳng, thiếu ngủ hoặc huyết áp cao. Nên đo huyết áp và nghỉ ngơi, nếu kéo dài hãy đến khám 🧠.',
            'sốt' => 'Nếu bạn bị sốt trên 38°C hơn 2 ngày, nên đến cơ sở y tế gần nhất nhé 🌡️.',
            'ho' => 'Bạn có thể bị cảm lạnh hoặc viêm họng. Nên uống nhiều nước và giữ ấm 💧.',
            'đau bụng' => 'Đau bụng có thể do rối loạn tiêu hóa hoặc dạ dày. Nếu đau dữ dội, nên gặp bác sĩ ngay 🍽️.',
            'mệt mỏi' => 'Bạn nên ngủ đủ, uống nước và kiểm tra dinh dưỡng. Nếu kéo dài >3 ngày, hãy đặt lịch khám 💤.',

            // --- Thuốc và chỉ định ---
            'thuốc' => 'Bạn nên dùng thuốc theo chỉ định của bác sĩ, không nên tự ý uống nhé 💊.',
            'paracetamol' => 'Paracetamol giúp hạ sốt và giảm đau nhẹ, nhưng không nên dùng quá liều (>4g/ngày) ⚠️.',
            'kháng sinh' => 'Kháng sinh chỉ nên dùng khi có đơn của bác sĩ để tránh kháng thuốc 🚫.',

            // --- Liên hệ ---
            'liên hệ' => 'Bạn có thể gọi hotline: 1900 123 456 📞 để được hỗ trợ nhanh nhất.',
            'địa chỉ' => 'Địa chỉ: 123 Nguyễn Văn Cừ, Q.5, TP.HCM 🏥.',
            'đặt khám online' => 'Bạn có thể đặt khám trực tiếp trên website hoặc chat với tôi để tôi hỗ trợ nhé 🌐.',
        ];

        // Kiểm tra xem có từ khóa phù hợp không
        foreach ($keywordReplies as $keyword => $response) {
            if (str_contains($normalized, $keyword)) {
                return response()->json(['reply' => $response]);
            }
        }

        // Trả lời mặc định nếu không hiểu
        return response()->json([
            'reply' => "Xin lỗi, tôi chưa hiểu câu hỏi của bạn 🤔.\nBạn có thể hỏi:\n- Cách đặt lịch khám\n- Danh sách bác sĩ\n- Giờ làm việc\n- Giá khám\nHoặc gõ 'hướng dẫn' để xem chi tiết 💬."
        ]);
    }

    // Hàm chuẩn hóa chuỗi nhập vào (xóa ký tự thừa, giữ chữ thường)
    private function normalizeText($text)
    {
        $text = preg_replace('/[^\p{L}\p{N}\s]/u', '', $text);
        $text = str_replace(['  ', '   '], ' ', $text);
        return trim($text);
    }
}