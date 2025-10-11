<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Doctor extends Model
{
    use HasFactory;

    protected $fillable = [
        'department_id', 'specialization', 'status', 'bio'
    ];

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
