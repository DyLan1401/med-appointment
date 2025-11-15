<?php

use Illuminate\Support\Facades\Broadcast;

// ===================================================
// 🔹 Channel: Chat nhóm (giữ nguyên code cũ)
// ===================================================
Broadcast::channel('chat-group.{groupId}', function ($user, $groupId) {
    // Kiểm tra xem user có thuộc nhóm không (hoặc admin thì cho phép hết)
    if ($user->role === 'admin') {
        return true;
    }

    return \DB::table('chat_group_user')
        ->where('chat_group_id', $groupId)
        ->where('user_id', $user->id)
        ->exists();
});

// ===================================================
// 🔹 Channel: Chat riêng tư giữa 2 user (mới thêm vào)
// ===================================================
Broadcast::channel('chat.{receiverId}', function ($user, $receiverId) {
    // Kiểm tra user đang đăng nhập hợp lệ
    return (int) $user->id === (int) $receiverId;
});