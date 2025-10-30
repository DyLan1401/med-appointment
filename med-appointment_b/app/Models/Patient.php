<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Patient extends Model
{
    use HasFactory;

    protected $table = 'patients';

    protected $fillable = [
        'user_id',
        'date_of_birth',
        'gender',
        'address',
        'health_insurance',
        'google_id',
        'facebook_id',
    ];

    public $timestamps = true;

    // 🔹 Liên kết với bảng users
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    // 🔹 Lịch hẹn
    public function appointments()
    {
        return $this->hasMany(Appointment::class, 'patient_id', 'id');
    }

    // 🔹 Phản hồi — ⚠️ Sửa lại theo user_id thay vì patient_id
    public function feedbacks()
    {
        return $this->hasMany(Feedback::class, 'user_id', 'user_id');
    }

    // 🔹 Yêu thích
    public function favorites()
    {
    return $this->hasMany(Favorite::class, 'user_id', 'user_id');
    }

    // 🔹 Khi xóa bệnh nhân, tự động xóa quan hệ liên quan
    protected static function booted()
    {
        static::deleting(function ($patient) {
            $patient->appointments()->delete();
            $patient->feedbacks()->delete();
            $patient->favorites()->delete();

            // Xóa luôn user liên kết nếu có
            if ($patient->user) {
                $patient->user->delete();
            }
        });
    }
}