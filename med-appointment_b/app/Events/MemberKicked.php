<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;

class MemberKicked implements ShouldBroadcastNow
{
    public $payload;

    public function __construct($groupId, $userId)
    {
        $this->payload = [
            'group_id' => $groupId,
            'user_id' => $userId,
        ];
    }

    public function broadcastOn()
    {
        return new Channel('chat-group.' . $this->payload['group_id']);
    }

    public function broadcastAs()
    {
        return 'member.kicked';
    }
}