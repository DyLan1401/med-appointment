<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <title>Hóa đơn #{{ $invoice->id }}</title>
  <style>
    body { font-family: DejaVu Sans, sans-serif; }
    h2 { color: #0d6efd; }
    p { margin: 4px 0; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
    .total { text-align: right; font-weight: bold; }
  </style>
</head>
<body>
  <h2>HÓA ĐƠN KHÁM BỆNH</h2>

  <p><strong>Mã hóa đơn:</strong> {{ $invoice->id }}</p>
  <p><strong>Ngày thanh toán:</strong> {{ optional($invoice->updated_at)->format('d/m/Y H:i') }}</p>

  <hr>

  <p><strong>Bệnh nhân:</strong>
    {{ $invoice->appointment->patient->user->name ?? 'Không rõ' }}
  </p>
  <p><strong>Bác sĩ:</strong>
    {{ $invoice->appointment->doctor->user->name ?? 'Không rõ' }}
  </p>
  <p><strong>Dịch vụ:</strong>
    {{ $invoice->appointment->service->name ?? '---' }}
  </p>

  <table>
    <tr>
      <th>Mô tả</th>
      <th>Giá (VND)</th>
    </tr>
    <tr>
      <td>{{ $invoice->appointment->service->description ?? 'Khám bệnh' }}</td>
      <td>{{ number_format($invoice->appointment->service->price ?? 0, 0, ',', '.') }}</td>
    </tr>
    <tr>
      <td class="total">Tổng cộng</td>
      <td>{{ number_format($invoice->amount ?? $invoice->appointment->service->price ?? 0, 0, ',', '.') }} đ</td>
    </tr>
  </table>
</body>
</html>
