<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>Ghi chú bệnh nhân</title>
    <style>
        /* -------------------------------
           🎨 CẤU HÌNH CHUNG
        --------------------------------*/
        body {
            font-family: "DejaVu Sans", sans-serif;
            font-size: 13px;
            color: #2c3e50;
            margin: 40px 60px;
            background-color: #fdfdfd;
        }

        h1 {
            text-align: center;
            color: #1a73e8;
            font-size: 24px;
            margin-bottom: 6px;
            letter-spacing: 0.5px;
        }

        h1::after {
            content: "";
            display: block;
            width: 80px;
            height: 3px;
            background: linear-gradient(to right, #1a73e8, #6a11cb);
            margin: 8px auto 20px auto;
            border-radius: 2px;
        }

        p, small {
            line-height: 1.5;
        }

        /* -------------------------------
           📄 THÔNG TIN CHUNG
        --------------------------------*/
        .header-info {
            text-align: center;
            margin-bottom: 20px;
            font-size: 13px;
            color: #555;
        }

        .header-info strong {
            color: #111;
        }

        hr {
            border: 0;
            border-top: 1px solid #d0d0d0;
            margin: 15px 0 25px;
        }

        /* -------------------------------
           🗂️ THẺ GHI CHÚ
        --------------------------------*/
        .note {
            border: 1px solid #d1d9e6;
            padding: 15px 18px;
            margin-bottom: 18px;
            border-radius: 10px;
            background: #fff;
            box-shadow: 0 2px 6px rgba(0,0,0,0.05);
            transition: all 0.3s ease;
        }

        .note:hover {
            box-shadow: 0 4px 10px rgba(0,0,0,0.08);
            transform: translateY(-1px);
        }

        .note h3 {
            margin: 0;
            font-size: 16px;
            color: #1a73e8;
            margin-bottom: 6px;
        }

        .note small {
            display: block;
            margin-bottom: 10px;
            color: #777;
            font-size: 12px;
        }

        .note p {
            margin: 0;
            color: #2c3e50;
            line-height: 1.6;
            text-align: justify;
        }

        /* -------------------------------
           🩺 THÔNG TIN CHÂN TRANG
        --------------------------------*/
        .footer {
            text-align: center;
            margin-top: 40px;
            font-size: 11px;
            color: #888;
            border-top: 1px solid #ccc;
            padding-top: 10px;
        }

        /* -------------------------------
           🖨️ GIAO DIỆN KHI IN
        --------------------------------*/
        @media print {
            body {
                margin: 20px 35px;
                background: #fff;
            }

            .note {
                page-break-inside: avoid;
                box-shadow: none;
                border: 1px solid #bbb;
            }

            h1::after {
                display: none;
            }

            .footer {
                color: #666;
                border-top: 1px solid #bbb;
            }
        }
    </style>
</head>
<body>
    <h1>🩺 Danh sách ghi chú bệnh nhân</h1>
    <div class="header-info">
        <p><strong>Ngày xuất PDF:</strong> {{ now()->format('d/m/Y H:i') }}</p>
    </div>
    <hr>

    @foreach($notes as $note)
        <div class="note">
            <h3>{{ $note->title ?? 'Ghi chú không có tiêu đề' }}</h3>
            <small>
                🕒 {{ \Carbon\Carbon::parse($note->created_at)->format('d/m/Y H:i') }}
                &nbsp; | &nbsp;
                👨‍⚕️ {{ $note->admin->name ?? 'Hệ thống' }}
            </small>
            <p>{{ $note->content }}</p>
        </div>
    @endforeach

    <div class="footer">
        <p>Hệ thống quản lý bệnh nhân — {{ config('app.name') }}</p>
        <p>© {{ date('Y') }} Tất cả quyền được bảo lưu.</p>
    </div>
</body>
</html>