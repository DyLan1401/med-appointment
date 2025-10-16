<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Patient extends Model
{
    use HasFactory;

    // ✅ 1. Khai báo tên bảng tương ứng
    protected $table = 'patients';

    // ✅ 2. Khai báo các cột có thể gán hàng loạt
    protected $fillable = [
        'id',
        'date_of_birth',
        'gender',
        'address',
        'health_insurance',
        'google_id',
        'facebook_id',
    ];

    // ✅ 3. Bảng không có created_at / updated_at
    public $timestamps = false;

    // ✅ 4. Khai báo quan hệ với bảng users
    public function user()
    {
        return $this->belongsTo(User::class, 'id');
    }

    // ✅ 5. Quan hệ với bảng appointments
    public function appointments()
    {
        return $this->hasMany(Appointment::class, 'patient_id');
    }

    // ✅ 6. Quan hệ với bảng feedbacks
    public function feedbacks()
    {
        return $this->hasMany(Feedback::class, 'patient_id');
    }

    // ✅ 7. Quan hệ với bảng favorites
    public function favorites()
    {
        return $this->hasMany(Favorite::class, 'patient_id');
    }
}