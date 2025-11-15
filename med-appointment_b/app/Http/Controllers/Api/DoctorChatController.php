<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\{ChatGroup, Doctor, Department, Message};

class DoctorChatController extends Controller
{
public function groups(Request $request)
{
    // 1) Lấy user từ sanctum token
    $user = auth()->user();

    if (!$user) {
        return response()->json([
            'success' => false,
            'message' => 'Token không hợp lệ hoặc chưa đăng nhập!'
        ], 401);
    }

    // 2) Lấy bác sĩ theo user_id
    $doctor = Doctor::where('user_id', $user->id)->first();

    if (!$doctor) {
        return response()->json([
            'success' => false,
            'message' => 'Không tìm thấy thông tin bác sĩ!'
        ], 404);
    }

    // 3) Kiểm tra department_id
    if (!$doctor->department_id) {
        return response()->json([
            'success' => false,
            'message' => 'Bác sĩ chưa được gán department_id!'
        ], 404);
    }

    // 4) Lấy department
    $department = Department::find($doctor->department_id);

    if (!$department) {
        return response()->json([
            'success' => false,
            'message' => 'Không tìm thấy khoa tương ứng!'
        ], 404);
    }

    // 5) Lấy nhóm chat
    $groups = ChatGroup::where('department_id', $doctor->department_id)->get();

    if ($groups->isEmpty()) {
        $new = ChatGroup::create([
            'name' => 'Nhóm ' . $department->name,
            'department_id' => $doctor->department_id,
            'description' => 'Nhóm chat dành cho khoa ' . $department->name,
        ]);

        $groups = collect([$new]);
    }

    $mapped = $groups->map(function ($g) use ($department) {
        $last = Message::where('id', $g->id)->orderBy('id', 'desc')->first();

        return [
            'id' => $g->id,
            'name' => $g->name,
            'description' => $g->description,
            'department_id' => $department->id,
            'department_name' => $department->name,
            'last_message' => $last ? [
                'id' => $last->id,
                'content' => $last->content,
                'sender_name' => $last->sender_name,
                'created_at' => $last->created_at,
            ] : null,
        ];
    });

    return response()->json([
        'success' => true,
        'data' => $mapped
    ]);
}


    // ===========================================================
    // ➕ Bác sĩ tham gia nhóm
    // ===========================================================
    public function join(Request $request, $groupId)
    {
        $doctor = auth('doctor')->user();

        if (!$doctor) {
            return response()->json([
                'message' => 'Không tìm thấy thông tin bác sĩ!'
            ], 404);
        }

        $group = ChatGroup::find($groupId);

        if (!$group) {
            return response()->json(['message' => 'Nhóm chat không tồn tại!'], 404);
        }

        // Thêm bác sĩ vào nhóm
        $group->users()->syncWithoutDetaching([$doctor->user_id]);

        return response()->json([
            'success' => true,
            'message' => 'Đã tham gia nhóm: ' . $group->name,
            'group' => $group
        ]);
    }
}