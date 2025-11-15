<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\{ChatGroup, Message, User, Doctor};
use App\Events\MessageSent;
use App\Events\MemberKicked;
use Illuminate\Support\Facades\DB;

class ChatController extends Controller
{
    // ========================================
    // 📋 Admin: Lấy danh sách tất cả nhóm chat
    // ========================================
    public function groups()
    {
        $groups = ChatGroup::withCount('users')
            ->with('department')
            ->orderByRaw('COALESCE((select name from departments where departments.id = chat_groups.department_id), chat_groups.name)')
            ->get();

        return response()->json(['data' => $groups], 200);
    }

    // ========================================
    // 🔍 Lấy nhóm theo department_id (FE doctor dùng)
    // ========================================
    public function index(Request $request)
    {
        $departmentId = $request->query('department_id');

        $query = ChatGroup::with('department');

        if (!empty($departmentId) && is_numeric($departmentId)) {
            $query->where('department_id', (int) $departmentId);
        }

        return response()->json(['data' => $query->get()], 200);
    }

    // ========================================
    // 👥 Lấy danh sách member của group
    // ========================================
    public function members($id)
    {
        $group = ChatGroup::with('users:id,name,email')->findOrFail($id);
        return response()->json(['data' => $group->users], 200);
    }

    // ========================================
    // 💬 Lấy tin nhắn của group
    // ========================================
    public function messages($id)
    {
        $msgs = Message::where('chat_group_id', $id)
            ->with('user:id,name')
            ->orderBy('created_at')
            ->get()
            ->map(function ($m) {
                return [
                    'id' => $m->id,
                    'user_id' => $m->user_id,
                    'sender_name' => $m->user->name ?? 'Unknown',
                    'content' => $m->content,
                    'file_name' => $m->file_name ?? null,
                    'file_type' => $m->file_type ?? null,
                    'created_at' => $m->created_at->toDateTimeString(),
                ];
            });

        return response()->json(['data' => $msgs], 200);
    }

    // ========================================
    // 📨 Gửi tin nhắn
    // ========================================
    public function send(Request $request, $id)
    {
        $user = $request->user();

        $request->validate([
            'content' => 'required|string|max:2000',
        ]);

        $msg = Message::create([
            'chat_group_id' => $id,
            'user_id' => $user->id,
            'content' => $request->input('content'),
            'file_name' => $request->input('file_name') ?? null,
            'file_type' => $request->input('file_type') ?? null,
        ]);

        $msg->load('user:id,name');

        broadcast(new MessageSent($msg))->toOthers();

        return response()->json(['data' => $msg], 201);
    }

    // ========================================
    // ❌ Kick thành viên
    // ========================================
    public function kick(Request $request, $id)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Không có quyền.'], 403);
        }

        $request->validate([
            'user_id' => 'required|integer',
        ]);

        DB::table('chat_group_user')
            ->where('chat_group_id', $id)
            ->where('user_id', $request->input('user_id'))
            ->delete();

        broadcast(new MemberKicked($id, $request->input('user_id')))->toOthers();

        return response()->json(['message' => 'Đã kick thành viên khỏi nhóm.'], 200);
    }

    // ========================================
    // 📎 Upload file trong chat
    // ========================================
    public function upload(Request $request)
    {
        $request->validate([
            'file' => 'required|file|max:10240',
        ]);

        $file = $request->file('file');
        $path = $file->store('chat_uploads', 'public');

        return response()->json([
            'url' => asset('storage/' . $path),
            'name' => $file->getClientOriginalName(),
            'type' => $file->getClientMimeType(),
        ], 200);
    }


    // =============================================
    // ⭐⭐ Map bác sĩ vào nhóm chat dựa trên department
    // =============================================
    public function assignDoctorToGroup($doctorId)
    {
        $doctor = Doctor::with('department')->find($doctorId);

        if (!$doctor || !$doctor->department_id) {
            return false;
        }

        $group = ChatGroup::where('department_id', $doctor->department_id)->first();

        if ($group) {
            $group->users()->syncWithoutDetaching($doctor->user_id);
        }

        return true;
    }
}