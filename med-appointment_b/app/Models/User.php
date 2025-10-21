<?php

namespace App\Models;

use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens; // 👈 thêm dòng này

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'google_id',
        'role',
        'avatar', // ✅ đổi lại cho khớp DB
        'phone',
        'insurance_info',
    

        'avatar_url',
        'phone',
        'insurance_info',
    ];

    /**
     * Các trường sẽ bị ẩn khi trả về JSON
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Các kiểu dữ liệu cần được cast (tự động chuyển đổi)
     */
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
        // user.id -> doctors.user_id
        return $this->hasOne(Doctor::class, 'user_id');
    }

    /**
     * Quan hệ 1-1 với bảng patients
     */
    public function patient()
    {
        return $this->hasOne(Patient::class, 'user_id');
    }

    /**
     * Quan hệ 1-n với bảng notifications
     */
    public function notifications()
    {
        return $this->hasMany(Notification::class, 'user_id');
    }

    /**
     * Quan hệ 1-n với bảng posts
     */
    public function posts()
    {
        return $this->hasMany(Post::class, 'author_id');
    }

    /**
     * Quan hệ 1-n với bảng activity_logs
     */
    public function activityLogs()
    {
        return $this->hasMany(ActivityLog::class, 'user_id');
    }
}