<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ChatGroup extends Model
{
    protected $fillable = [
        'name',
        'description',
        'department_id',
    ];

    // Tự load department khi trả JSON
    protected $with = ['department'];

    // Liên kết đến bảng departments
    public function department()
    {
        return $this->belongsTo(Department::class, 'department_id');
    }

    // Danh sách thành viên của nhóm
    public function users()
    {
        return $this->belongsToMany(User::class, 'chat_group_user')->withTimestamps();
    }

    // Tin nhắn thuộc nhóm
    public function messages()
    {
        return $this->hasMany(Message::class);
    }
}