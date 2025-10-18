<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
<<<<<<< HEAD

class User extends Authenticatable
{
    use HasFactory, Notifiable;
=======
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;
>>>>>>> DinhThanhToan-DangNhap

    /**
     * Các trường được phép gán hàng loạt (Mass Assignment)
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
<<<<<<< HEAD
<<<<<<< HEAD
        'avatar', // ✅ đổi lại cho khớp DB
=======
        'avatar', // ảnh đại diện
>>>>>>> origin/master
        'phone',
        'insurance_info',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

=======
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
>>>>>>> DinhThanhToan-DangNhap
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

<<<<<<< HEAD
<<<<<<< HEAD
    // ✅ Accessor: tạo thuộc tính ảo "avatar_url"
=======
    /**
     * ✅ Accessor: Trả về URL đầy đủ của avatar
     */
>>>>>>> origin/master
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

<<<<<<< HEAD
    // Các quan hệ
=======
    /**
     * Quan hệ 1-1 với bảng doctors
     */
>>>>>>> DinhThanhToan-DangNhap
    public function doctor()
    {
=======
    /**
     * ✅ Quan hệ với Doctor (1-1)
     */
    public function doctor()
    {
        // user.id -> doctors.user_id
>>>>>>> origin/master
        return $this->hasOne(Doctor::class, 'user_id');
    }

    /**
<<<<<<< HEAD
     * Quan hệ 1-1 với bảng patients
     */
    public function patient()
    {
=======
     * ✅ Quan hệ với Patient (1-1)
     */
    public function patient()
    {
        // user.id -> patients.user_id
>>>>>>> origin/master
        return $this->hasOne(Patient::class, 'user_id');
    }

    /**
<<<<<<< HEAD
     * Quan hệ 1-n với bảng notifications
=======
     * Quan hệ với Notification
>>>>>>> origin/master
     */
    public function notifications()
    {
        return $this->hasMany(Notification::class, 'user_id');
    }

    /**
<<<<<<< HEAD
     * Quan hệ 1-n với bảng posts
=======
     * Quan hệ với Post
>>>>>>> origin/master
     */
    public function posts()
    {
        return $this->hasMany(Post::class, 'author_id');
    }

    /**
<<<<<<< HEAD
     * Quan hệ 1-n với bảng activity_logs
=======
     * Quan hệ với ActivityLog
>>>>>>> origin/master
     */
    public function activityLogs()
    {
        return $this->hasMany(ActivityLog::class, 'user_id');
    }
}