<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Doctor extends Model
{
 
    use HasFactory;

    public $timestamps = false;

    // 🔹 Khai báo khóa chính và kiểu dữ liệu
    protected $primaryKey = 'id';
    public $incrementing = false; // không tự tăng ID
    protected $keyType = 'int';

    // 🔹 Cho phép gán ID thủ công
    protected $fillable = [
        'id', 'specialization', 'status', 'bio'
    ];

    // 🔹 Quan hệ
    public function user()
    {
        return $this->belongsTo(User::class, 'id');
    }

    public function certificates()
    {
        return $this->hasMany(DoctorCertificate::class, 'doctor_id');
    }

    public function schedules()
    {
        return $this->hasMany(Schedule::class, 'doctor_id');
    }

    public function appointments()
    {
        return $this->hasMany(Appointment::class, 'doctor_id');
    }

    public function feedbacks()
    {
        return $this->hasMany(Feedback::class, 'doctor_id');
    }
}
