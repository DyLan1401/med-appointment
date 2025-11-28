<?php

namespace App\Http\Controllers;

use App\Models\PostFeedback;
use Illuminate\Http\Request;

class PostFeedbackController extends Controller
{
    // ✅ Nếu có postId → lấy feedback của bài viết đó, nếu không → lấy tất cả
    public function index()
{
    $feedbacks = PostFeedback::with(['user', 'post'])
        ->orderBy('id', 'DESC')
        ->get(); // <-- QUAN TRỌNG

    return response()->json([
        "data" => $feedbacks
    ], 200);
}

    public function store(Request $request, $postId)
    {
        $request->validate([
            'content' => 'required|string|max:1000',
            'role' => 'required|in:doctor,patient',
        ]);

        $feedback = PostFeedback::create([
            'post_id' => $postId,
            'user_id' => auth()->id(),
            'role' => $request->role,
            'content' => $request->content,
        ]);

        return response()->json([
            'message' => 'Feedback đã được gửi!',
            'feedback' => $feedback->load('user'),
        ]);
    }

    public function update(Request $request, $id)
    {
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
        ]);
    }

    public function destroy($id)
    {
        $feedback = PostFeedback::findOrFail($id);

    if ($feedback->user_id !== $user->id && $user->role !== 'admin') {
            return response()->json(['message' => 'Bạn không có quyền xóa feedback này.'], 403);
        }

        $feedback->delete();

        return response()->json(['message' => 'Đã xóa feedback thành công!']);
    }
    public function listByPost($postId)
{
    $feedbacks = PostFeedback::with('user')
        ->where('post_id', $postId)
        ->latest()
        ->get();

    return response()->json($feedbacks);
}

}
