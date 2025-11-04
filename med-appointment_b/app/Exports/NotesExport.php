<?php

namespace App\Exports;

use App\Models\Note;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithTitle;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;

class NotesExport implements FromCollection, WithHeadings, WithMapping, ShouldAutoSize, WithStyles, WithTitle
{
    protected $patientId;

    public function __construct($patientId)
    {
        $this->patientId = $patientId;
    }

    // ===========================
    // 📋 Lấy dữ liệu ghi chú
    // ===========================
    public function collection()
    {
        return Note::with('admin:id,name')
            ->where('patient_id', $this->patientId)
            ->orderBy('created_at', 'desc')
            ->get();
    }

    // ===========================
    // 🏷️ Tiêu đề cột
    // ===========================
    public function headings(): array
    {
        return [
            'STT',
            'TIÊU ĐỀ GHI CHÚ',
            'NỘI DUNG CHI TIẾT',
            'TÊN BỆNH NHÂN',
            'NGÀY TẠO',
        ];
    }

    // ===========================
    // 🧩 Mapping từng dòng
    // ===========================
    public function map($note): array
    {
        static $index = 0;
        return [
            ++$index,
            $note->title,
            $note->content,
            optional($note->admin)->name ?? 'Không xác định',
            $note->created_at->format('d/m/Y H:i'),
        ];
    }

    // ===========================
    // 🎨 Làm đẹp file Excel
    // ===========================
    public function styles(Worksheet $sheet)
    {
        // 🧱 Dòng tiêu đề
        $sheet->getStyle('A1:E1')->applyFromArray([
            'font' => [
                'bold' => true,
                'size' => 12,
                'color' => ['rgb' => 'FFFFFF'],
            ],
            'fill' => [
                'fillType' => Fill::FILL_SOLID,
                'startColor' => ['rgb' => '4F81BD'], // Xanh dương dịu
            ],
            'alignment' => [
                'horizontal' => Alignment::HORIZONTAL_CENTER,
                'vertical' => Alignment::VERTICAL_CENTER,
            ],
            'borders' => [
                'allBorders' => [
                    'borderStyle' => Border::BORDER_THIN,
                    'color' => ['rgb' => 'CCCCCC'],
                ],
            ],
        ]);

        // 🧾 Căn giữa cột STT
        $sheet->getStyle('A')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);

        // 🪶 Căn lề nội dung, wrap text cho phần "Nội dung chi tiết"
        $sheet->getStyle('C')->getAlignment()->setWrapText(true);
        $sheet->getStyle('C')->getAlignment()->setVertical(Alignment::VERTICAL_TOP);

        // ✍️ Toàn bảng có viền mảnh nhẹ
        $rowCount = $sheet->getHighestRow();
        $sheet->getStyle("A1:E{$rowCount}")->applyFromArray([
            'borders' => [
                'allBorders' => [
                    'borderStyle' => Border::BORDER_HAIR,
                    'color' => ['rgb' => 'DDDDDD'],
                ],
            ],
        ]);

        // 🧱 Dòng đầu tiên (A1:E1) cao hơn chút
        $sheet->getRowDimension(1)->setRowHeight(25);

        // 📄 Canh lề vừa vặn
        foreach (range('A', 'E') as $col) {
            $sheet->getColumnDimension($col)->setAutoSize(true);
        }

        return [
            1 => ['font' => ['bold' => true]],
        ];
    }

    // ===========================
    // 📘 Đặt tên sheet
    // ===========================
    public function title(): string
    {
        return 'Danh sách ghi chú';
    }
}