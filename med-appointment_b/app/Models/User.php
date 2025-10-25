<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
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

    
    public function doctor()
    {
        return $this->hasOne(Doctor::class, 'user_id');
    }

    
    public function patient()
    {
        // Chỉ định khóa ngoại để Eloquent hiểu đúng cấu trúc
        return $this->hasOne(\App\Models\Patient::class, 'user_id', 'id');
    }

    
    public function posts()
    {
        return $this->hasMany(Post::class, 'author_id');
    }

    
    public function activityLogs()
    {
        return $this->hasMany(ActivityLog::class, 'user_id');
    }

    
    public function favorites()
    {
        return $this->hasMany(\App\Models\Favorite::class, 'patient_id', 'id');
    }
}