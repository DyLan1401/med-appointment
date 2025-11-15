<?php

namespace App\Models;

use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

/**
 * 🔐 User Model — Dành cho hệ thống Laravel Sanctum + Social Login + Quan hệ bác sĩ / bệnh nhân
 * ---------------------------------------------------------------------------------------------
 * Giữ nguyên toàn bộ logic cũ, chỉ thêm:
 * - Hàm setPasswordAttribute() để tự động bcrypt password
 * - Giải thích & comment rõ ràng hơn cho maintain dễ dàng
 */
class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * 🧩 Các cột có thể gán hàng loạt (mass assignable)
     */
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

    /**
     * 🔒 Các cột bị ẩn khi trả JSON response
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * 🧮 Kiểu dữ liệu tự động cast
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    /**
     * 🔐 Tự động mã hóa password khi set
     * Tránh lỗi double hash khi import user từ nguồn khác.
     */
    public function setPasswordAttribute($value)
    {
        if (!empty($value) && strlen($value) < 60) {
            $this->attributes['password'] = bcrypt($value);
        } else {
            $this->attributes['password'] = $value;
        }
    }

    /**
     * 🖼️ Lấy URL avatar (đầy đủ)
     * Nếu không có avatar → trả về ảnh mặc định.
     */
    public function getAvatarUrlAttribute()
    {
        if (!$this->avatar) {
            return asset('images/default-avatar.png');
        }

        if (str_starts_with($this->avatar, 'http')) {
            return $this->avatar;
        }

        return asset('storage/' . $this->avatar);
    }

    /**
     * 👨‍⚕️ Quan hệ: User → Doctor
     */
    public function doctor()
    {
        return $this->hasOne(Doctor::class);
    }

    /**
     * 🧑‍🤝‍🧑 Quan hệ: User → Patient
     */
    public function patient()
    {
        return $this->hasOne(Patient::class, 'id');
    }

    /**
     * 🔔 Quan hệ: User → Notifications
     */
    public function notifications()
    {
        return $this->hasMany(Notification::class, 'user_id');
    }

    /**
     * 📰 Quan hệ: User → Posts
     */
    public function posts()
    {
        return $this->hasMany(Post::class, 'author_id');
    }

    /**
     * 🧾 Quan hệ: User → ActivityLogs
     */
    public function activityLogs()
    {
        return $this->hasMany(ActivityLog::class, 'user_id');
    }
}