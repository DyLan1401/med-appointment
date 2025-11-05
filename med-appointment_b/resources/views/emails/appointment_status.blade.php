<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>Thông báo lịch hẹn</title>
</head>
<body>
    <h2>{{ $type === 'confirmed' ? '🎉 Lịch hẹn của bạn đã được xác nhận!' : '⚠️ Lịch hẹn của bạn bị từ chối' }}</h2>

    <p>Xin chào {{ $appointment->patient_name ?? 'bạn' }},</p>

    @if($type === 'confirmed')
        <p>Bác sĩ {{ $appointment->doctor_name ?? '' }} đã xác nhận lịch hẹn của bạn.</p>
        <p><strong>Thời gian:</strong> {{ $appointment->appointment_date }}</p>
        <p><strong>Dịch vụ:</strong> {{ $appointment->service_name }}</p>
    @else
        <p>Rất tiếc, lịch hẹn của bạn đã bị từ chối. Vui lòng thử đặt lại vào thời gian khác.</p>
    @endif

    <hr>
    <p>Cảm ơn bạn đã sử dụng hệ thống Medical Appointment!</p>
</body>
</html>
