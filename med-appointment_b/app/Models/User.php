<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'avatar', // ảnh đại diện
        'phone',
        'insurance_info',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    /**
     * ✅ Accessor: Trả về URL đầy đủ của avatar
     */
    public function getAvatarUrlAttribute()
    {
        // Nếu chưa có avatar -> dùng ảnh mặc định
        if (empty($this->avatar)) {
            return asset('images/default-avatar.png');
        }

        // Nếu avatar là một URL đầy đủ (ví dụ link từ mạng ngoài)
        if (str_starts_with($this->avatar, 'http')) {
            return $this->avatar;
        }

        // Nếu ảnh nằm trong thư mục storage
        return asset('storage/' . $this->avatar);
    }

    /**
     * ✅ Quan hệ với Doctor (1-1)
     */
    public function doctor()
    {
        // user.id -> doctors.user_id
        return $this->hasOne(Doctor::class, 'user_id');
    }

    /**
     * ✅ Quan hệ với Patient (1-1)
     */
    public function patient()
    {
        // user.id -> patients.user_id
        return $this->hasOne(Patient::class, 'user_id');
    }

    /**
     * Quan hệ với Notification
     */
    public function notifications()
    {
        return $this->hasMany(Notification::class, 'user_id');
    }

    /**
     * Quan hệ với Post
     */
    public function posts()
    {
        return $this->hasMany(Post::class, 'author_id');
    }

    /**
     * Quan hệ với ActivityLog
     */
    public function activityLogs()
    {
        return $this->hasMany(ActivityLog::class, 'user_id');
    }
}