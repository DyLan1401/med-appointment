<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>Danh sách lịch hẹn đã hoàn thành</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; font-size: 12px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #000; padding: 8px; text-align: left; }
        th { background: #f2f2f2; }
        h2 { text-align: center; margin-bottom: 10px; }
    </style>
</head>
<body>
    <h2>DANH SÁCH LỊCH HẸN ĐÃ HOÀN THÀNH</h2>
    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Bệnh nhân</th>
                <th>Dịch vụ</th>
                <th>Trạng thái</th>
                <th>Ghi chú</th>
                <th>Ngày hẹn</th>
                <th>Cập nhật lúc</th>
            </tr>
        </thead>
        <tbody>
            @foreach($data as $item)
                <tr>
                    <td>{{ $item->id }}</td>
                    <td>{{ $item->patient_name }}</td>
                    <td>{{ $item->service_name }}</td>
                    <td>{{ ucfirst($item->status) }}</td>
                    <td>{{ $item->notes }}</td>
                    <td>{{ $item->appointment_date }}</td>
                    <td>{{ $item->updated_at }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>
