<?php

namespace App\Http\Controllers;

use App\Models\PostFeedback;
use Illuminate\Http\Request;

class PostFeedbackController extends Controller
{
    public function index($postId)
    {
        $feedbacks = PostFeedback::with('user')
            ->where('post_id', $postId)
            ->latest()
            ->get();

        return response()->json($feedbacks);
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

    // 🔐 Chỉ cho phép sửa feedback của chính mình
    if ($feedback->user_id !== auth()->id()) {
        return response()->json(['message' => 'Bạn không có quyền sửa feedback này.'], 403);
    }

    $request->validate([
        'content' => 'required|string|max:1000',
    ]);

    $feedback->update([
        'content' => $request->content,
    ]);

    return response()->json([
        'message' => 'Feedback đã được cập nhật!',
        'feedback' => $feedback->load('user'),
    ]);
}

public function destroy($id)
{
    $feedback = PostFeedback::findOrFail($id);

    // 🔐 Chỉ cho phép xóa feedback của chính mình
    if ($feedback->user_id !== auth()->id()) {
        return response()->json(['message' => 'Bạn không có quyền xóa feedback này.'], 403);
    }

    $feedback->delete();

    return response()->json(['message' => 'Đã xóa feedback thành công!']);
}

}
