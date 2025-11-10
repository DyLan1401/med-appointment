@component('mail::message')
# 🧾 Hóa đơn Thanh Toán Dịch Vụ

Xin chào **{{ $patientName }}**,

Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi. Dưới đây là chi tiết thanh toán của bạn:

| Thông tin | Chi tiết |
|------------|-----------|
| 👨‍⚕️ Bác sĩ | {{ $doctorName }} |
| 💉 Dịch vụ | {{ $serviceName }} |
| 💰 Số tiền gốc | {{ number_format(floatval($originalAmount), 0, ',', '.') }} VNĐ |
| 💵 Số tiền thanh toán | **{{ number_format(floatval($paidAmount), 0, ',', '.') }} VNĐ** |
| 💳 Hình thức thanh toán | {{ $paymentType }} |

---

Cảm ơn bạn đã tin tưởng chúng tôi.  
Chúc bạn sức khỏe dồi dào ❤️  

**Phòng khám ABC**

@endcomponent
