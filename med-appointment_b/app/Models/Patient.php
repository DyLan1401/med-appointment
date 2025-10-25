<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Patient extends Model
{
    use HasFactory;

    
    protected $table = 'patients';

    // ✅ 2. Các cột có thể gán hàng loạt
    protected $fillable = [
        'user_id',
        'date_of_birth',
        'gender',
        'address',
        'health_insurance',
        'google_id',
        'facebook_id',
    ];

    // ✅ 3. Nếu bảng không có timestamps (created_at, updated_at)
    public $timestamps = false;

    // ✅ 4. Mối quan hệ với bảng Users
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    // ✅ 5. Quan hệ với bảng Appointments
    public function appointments()
    {
        return $this->hasMany(Appointment::class, 'patient_id', 'id');
    }

    // ✅ 6. Quan hệ với bảng Feedbacks
    public function feedbacks()
    {
        return $this->hasMany(Feedback::class, 'patient_id', 'id');
    }

    // ✅ 7. Quan hệ với bảng Favorites
    public function favorites()
    {
        return $this->hasMany(Favorite::class, 'patient_id', 'id');
    }

    // ✅ 8. (Tùy chọn) Xóa tất cả bản ghi liên quan khi xóa bệnh nhân
    protected static function booted()
    {
        static::deleting(function ($patient) {
            // Xóa lịch hẹn, phản hồi và yêu thích khi bệnh nhân bị xóa
            $patient->appointments()->delete();
            $patient->feedbacks()->delete();
            $patient->favorites()->delete();
        });
    }
}