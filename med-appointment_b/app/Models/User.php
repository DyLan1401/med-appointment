<?php

namespace App\Models;

use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;


class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'google_id',
        'facebook_id',
        'role',
        'avatar', 
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

    // 🖼️ Avatar URL getter (đã chuẩn, giữ nguyên)
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

    // 👨‍⚕️ Quan hệ với bác sĩ
    public function doctor()
    {
        return $this->hasOne(Doctor::class);
    }


  public function patient()
{
    return $this->hasOne(Patient::class, 'user_id', 'id');
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
