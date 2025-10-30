<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Note;
use Exception;

class NoteController extends Controller
{
    public function index($patientId)
    {
        $notes = Note::where('patient_id', $patientId)
                    ->orderBy('created_at', 'desc')
                    ->get();
        return response()->json($notes);
    }

    public function store(Request $request)
    {
        try {
            $note = Note::create([
                'patient_id' => $request->patient_id,
                'admin_id' => $request->admin_id ?? null,
                'title' => $request->title,
                'content' => $request->content,
            ]);

            return response()->json(['message' => 'Gửi ghi chú thành công', 'note' => $note]);
        } catch (Exception $e) {
            return response()->json(['error' => 'Lỗi khi lưu ghi chú: '.$e->getMessage()], 500);
        }
    }

    public function markAsRead(Note $note)
    {
        $note->update(['is_read' => true]);
        return response()->json(['message' => 'Đánh dấu đã đọc thành công']);
    }

    public function destroy(Note $note)
    {
        $note->delete();
        return response()->json(['message' => 'Xóa ghi chú thành công']);
    }
}