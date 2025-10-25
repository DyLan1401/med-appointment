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

    // Luôn load sẵn thông tin bác sĩ & chuyên khoa (để frontend hiển thị nhanh)
    protected $with = ['doctor.user', 'doctor.specialization'];

    
    protected $hidden = [
        'created_at',
        'updated_at',
    ];

    
    public function doctor()
    {
        return $this->belongsTo(\App\Models\Doctor::class, 'doctor_id', 'id');
    }

    
    public function user()
    {
        return $this->belongsTo(\App\Models\User::class, 'user_id', 'id');
    }

    
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