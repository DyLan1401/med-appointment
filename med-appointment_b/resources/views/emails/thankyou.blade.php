@component('mail::message')
# Cảm ơn quý khách đã khám tại phòng khám!

Xin chào **{{ $invoice->appointment->patient->user->name }}**,  

Chúng tôi xin chân thành cảm ơn bạn đã sử dụng dịch vụ khám bệnh **{{ $invoice->appointment->service->name }}**.  
Bác sĩ phụ trách: **{{ $invoice->appointment->doctor->user->name }}**

---

**Thông tin hóa đơn:**
- Mã hóa đơn: `#{{ $invoice->id }}`
- Số tiền thanh toán: **{{ number_format($invoice->amount, 0, ',', '.') }} VND**
- Ngày thanh toán: {{ optional($invoice->updated_at)->format('d/m/Y H:i') }}

---

Chúc bạn luôn mạnh khỏe và hẹn gặp lại trong những lần tái khám tiếp theo.


@endcomponent

Trân trọng,  
**Phòng khám MedCare**
@endcomponent
