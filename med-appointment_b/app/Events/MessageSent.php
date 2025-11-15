<?php

namespace App\Events;

use App\Models\Message;
use Illuminate\Broadcasting\Channel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;

class MessageSent implements ShouldBroadcastNow
{
    public $payload;

    public function __construct(Message $message)
    {
        $this->payload = [
            'id' => $message->id,
            'group_id' => $message->chat_group_id,
            'user_id' => $message->user_id,
            'sender_name' => $message->user->name ?? 'Unknown',
            'content' => $message->content,
            'created_at' => $message->created_at->toDateTimeString(),
        ];
    }

    public function broadcastOn()
    {
        return new Channel('chat-group.' . $this->payload['group_id']);
    }

    public function broadcastAs()
    {
        return 'message.new';
    }
}