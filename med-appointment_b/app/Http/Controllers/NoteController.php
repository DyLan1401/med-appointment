<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Note;
use Barryvdh\DomPDF\Facade\Pdf; // 🧩 Dùng DomPDF
use Maatwebsite\Excel\Facades\Excel; // 🧩 Dùng Excel export
use App\Exports\NotesExport; // 🧩 Import class export

class NoteController extends Controller
{
    // ===============================
    // 📋 Lấy danh sách ghi chú của 1 bệnh nhân
    // ===============================
    public function index($patientId)
    {
        $notes = Note::where('patient_id', $patientId)
            ->with('admin:id,name')
            ->orderBy('created_at', 'desc')
            ->get();
        return response()->json($notes);
    }

    // ===============================
    // 📨 Gửi ghi chú
    // ===============================
    public function store(Request $request)
    {
        $request->validate([
            'patient_id' => 'required|exists:patients,id',
            'title' => 'nullable|string|max:255',
            'content' => 'required|string',
        ]);

        $note = Note::create([
            'patient_id' => $request->patient_id,
            'admin_id' => auth()->id() ?? 1, // admin cố định ID=1
            'title' => $request->title ?? 'Ghi chú từ hệ thống',
            'content' => $request->content,
        ]);

        return response()->json($note, 201);
    }

    // ===============================
    // ✅ Đánh dấu đã đọc
    // ===============================
    public function markAsRead($id)
    {
        $note = Note::findOrFail($id);
        $note->update(['is_read' => true]);
        return response()->json(['message' => 'Đã đánh dấu là đã đọc']);
    }

    // ===============================
    // ❌ Xóa ghi chú
    // ===============================
    public function destroy($id)
    {
        $note = Note::findOrFail($id);
        $note->delete();
        return response()->json(['message' => 'Đã xóa ghi chú']);
    }

    // ===============================
    // 📄 Xuất PDF danh sách ghi chú của bệnh nhân
    // ===============================
    public function exportPdf($id)
    {
        $notes = Note::where('patient_id', $id)
            ->orderBy('created_at', 'desc')
            ->get();

        if ($notes->isEmpty()) {
            return response()->json(['message' => 'Không có ghi chú nào để in'], 404);
        }

        // 🧩 Tạo view PDF (resources/views/pdf/notes.blade.php)
        $pdf = Pdf::loadView('pdf.notes', compact('notes'));

        $filename = "ghi-chu-benh-nhan-{$id}.pdf";
        return $pdf->download($filename);
    }

    // ===============================
    // 📊 Xuất Excel danh sách ghi chú của bệnh nhân
    // ===============================
    public function exportExcel($id)
    {
        $notes = Note::where('patient_id', $id)->exists();

        if (!$notes) {
            return response()->json(['message' => 'Không có ghi chú nào để xuất Excel'], 404);
        }

        $filename = "ghi-chu-benh-nhan-{$id}.xlsx";
        return Excel::download(new NotesExport($id), $filename);
    }
}