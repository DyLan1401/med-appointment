@component('mail::message')
# Nhắc lịch khám bệnh

Xin chào **{{ $appointment->patient->user->name }}**,

Đây là lời nhắc rằng bạn có **lịch khám** vào:

@php
    $dt = \Carbon\Carbon::parse($appointment->appointment_date . ' ' . $appointment->appointment_time);
@endphp

📅 **{{ $dt->format('d/m/Y') }}**


👨‍⚕️ Bác sĩ: **{{ $appointment->doctor->user->name }}**

🏥 Chuyên khoa: **{{ $appointment->doctor->specialization->name ?? '---' }}**

@component('mail::button', ['url' => 'http://localhost:5173'])
Xem chi tiết lịch khám
@endcomponent

Cảm ơn bạn đã tin tưởng hệ thống của chúng tôi!
Chúc bạn một ngày tốt lành.

_Trân trọng_,
**Phòng khám MedCare**
@endcomponent
