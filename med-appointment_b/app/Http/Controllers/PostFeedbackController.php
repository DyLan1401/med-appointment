<?php

namespace App\Http\Controllers;

use App\Models\PostFeedback;
use Illuminate\Http\Request;

class PostFeedbackController extends Controller
{
    // ✅ Admin: lấy toàn bộ feedback
   public function index()
{
    $user = auth()->user();

    if ($user->role !== 'admin') {
        return response()->json([
            'message' => 'Bạn không có quyền truy cập.'
        ], 403);
    }

    $feedbacks = PostFeedback::with(['user', 'post'])
        ->orderBy('id', 'DESC')
        ->get();

    return response()->json([
        "data" => $feedbacks
    ], 200);
}

    // ✅ Public: gửi feedback cho 1 bài viết
    public function store(Request $request, $postId)
    {
        $user = auth()->user();

        $request->validate([
            'content' => 'required|string|max:1000',
        ]);

        $feedback = PostFeedback::create([
            'post_id' => $postId,
            'user_id' => $user->id,
            'role'    => $user->role, // ✅ KHÔNG LẤY TỪ REQUEST
            'content' => $request->content,
        ]);

        return response()->json([
            'message' => 'Feedback đã được gửi!',
            'feedback' => $feedback->load('user'),
        ], 201);
    }

    // ✅ Update: chỉ chủ feedback hoặc admin mới được sửa
    public function update(Request $request, $id)
    {
        $user = auth()->user();
        $feedback = PostFeedback::findOrFail($id);

        if ($feedback->user_id !== $user->id && $user->role !== 'admin') {
            return response()->json(['message' => 'Bạn không có quyền sửa feedback này.'], 403);
        }

        $request->validate([
            'content' => 'required|string|max:1000',
        ]);

        $feedback->update(['content' => $request->content]);

        return response()->json([
            'message' => 'Feedback đã được cập nhật!',
            'feedback' => $feedback->load('user'),
        ], 200);
    }

    // ✅ Delete: chỉ chủ feedback hoặc admin
    public function destroy($id)
    {
        $user = auth()->user();
        $feedback = PostFeedback::findOrFail($id);

        if ($feedback->user_id !== $user->id && $user->role !== 'admin') {
            return response()->json(['message' => 'Bạn không có quyền xóa feedback này.'], 403);
        }

        $feedback->delete();

        return response()->json(['message' => 'Đã xóa feedback thành công!'], 200);
    }

    // ✅ Public: lấy feedback theo bài viết
    public function listByPost($postId)
    {
        $feedbacks = PostFeedback::with('user')
            ->where('post_id', $postId)
            ->latest()
            ->get();

        return response()->json([
            'data' => $feedbacks
        ], 200);
    }
}
