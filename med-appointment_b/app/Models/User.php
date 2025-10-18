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
        'google_id',
        'role',
        'avatar', // ✅ đổi lại cho khớp DB
        'phone',
        'insurance_info',
        'email_verified_at'
    ];

    protected $hidden = ['password', 'remember_token'];

    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    // ✅ Accessor: tạo thuộc tính ảo "avatar_url"
    public function getAvatarUrlAttribute()
    {
        // Nếu không có avatar -> ảnh mặc định
        if (!$this->avatar) {
            return asset('images/default-avatar.png');
        }

        // Nếu là URL đầy đủ
        if (str_starts_with($this->avatar, 'http')) {
            return $this->avatar;
        }

        // Nếu là file trong storage
        return asset('storage/' . $this->avatar);
    }

    // Các quan hệ
    public function doctor()
    {
        return $this->hasOne(Doctor::class, 'id');
    }

    public function patient()
    {
        return $this->hasOne(Patient::class, 'id');
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class, 'user_id');
    }

    public function posts()
    {
        return $this->hasMany(Post::class, 'author_id');
    }

    public function activityLogs()
    {
        return $this->hasMany(ActivityLog::class, 'user_id');
    }
}