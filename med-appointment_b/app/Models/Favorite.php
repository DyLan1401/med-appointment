<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;

class Favorite extends Model
{
    use HasFactory;

    
    protected $fillable = [
        'doctor_id',
        'user_id',
    ];

    /**
     * 🧩 Luôn load sẵn thông tin bác sĩ & chuyên khoa (để frontend hiển thị nhanh)
     */
    protected $with = ['doctor.user', 'doctor.specialization'];

    /**
     * 🫧 Ẩn các trường không cần thiết khi trả về JSON
     */
    protected $hidden = [
        'created_at',
        'updated_at',
    ];

    // ==========================================================
    // 🔗 Quan hệ
    // ==========================================================

    /**
     * Mỗi yêu thích thuộc về 1 bác sĩ
     */
    public function doctor()
    {
        return $this->belongsTo(\App\Models\Doctor::class, 'doctor_id', 'id');
    }

    /**
     * Mỗi yêu thích thuộc về 1 người dùng
     */
    public function user()
    {
        return $this->belongsTo(\App\Models\User::class, 'user_id', 'id');
    }

    // ==========================================================
    // 🧠 Hàm tiện ích
    // ==========================================================

    /**
     * Kiểm tra xem bác sĩ đã được user này yêu thích chưa
     */
    public static function isFavorited($doctorId, $userId)
    {
        try {
            return self::where('doctor_id', $doctorId)
                ->where('user_id', $userId)
                ->exists();
        } catch (\Exception $e) {
            Log::error('❌ Lỗi khi kiểm tra yêu thích: ' . $e->getMessage(), [
                'doctor_id' => $doctorId,
                'user_id' => $userId,
            ]);
            return false;
        }
    }

    // ==========================================================
    // 🪵 Ghi log khi tạo hoặc xóa yêu thích
    // ==========================================================
    protected static function booted()
    {
        static::creating(function ($favorite) {
            Log::info('⭐ Tạo yêu thích mới', [
                'doctor_id' => $favorite->doctor_id,
                'user_id' => $favorite->user_id,
            ]);
        });

        static::deleting(function ($favorite) {
            Log::info('🗑️ Xóa yêu thích', [
                'doctor_id' => $favorite->doctor_id,
                'user_id' => $favorite->user_id,
            ]);
        });
    }
}