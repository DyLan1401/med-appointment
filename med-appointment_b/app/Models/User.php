<?php

namespace App\Models;

use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
<<<<<<< HEAD
=======
use Laravel\Sanctum\HasApiTokens;
>>>>>>> DangThanhPhong-GuiGhiChuChoBenhNhan

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
        return $this->hasOne(Doctor::class, 'user_id');
    }

    // 🧍‍♂️ Quan hệ với bệnh nhân (rất quan trọng để tránh lỗi foreign key)
    public function patient()
    {
        // Chỉ định khóa ngoại để Eloquent hiểu đúng cấu trúc
        return $this->hasOne(\App\Models\Patient::class, 'user_id', 'id');
    }

    // 🔔 Quan hệ thông báo
    public function notifications()
    {
        return $this->hasMany(Notification::class, 'user_id');
    }

    // 📝 Quan hệ bài viết (bác sĩ viết bài)
    public function posts()
    {
        return $this->hasMany(Post::class, 'author_id');
    }

    // 🧾 Nhật ký hoạt động
    public function activityLogs()
    {
        return $this->hasMany(ActivityLog::class, 'user_id');
    }

    // 💖 Danh sách yêu thích (bệnh nhân → favorites)
    public function favorites()
    {
        return $this->hasMany(\App\Models\Favorite::class, 'patient_id', 'id');
    }
}