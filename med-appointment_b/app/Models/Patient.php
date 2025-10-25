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

    
    public $timestamps = false;

    
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    
    public function appointments()
    {
        return $this->hasMany(Appointment::class, 'patient_id', 'id');
    }

    
    public function feedbacks()
    {
        return $this->hasMany(Feedback::class, 'patient_id', 'id');
    }

    
    public function favorites()
    {
        return $this->hasMany(Favorite::class, 'patient_id', 'id');
    }

    
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