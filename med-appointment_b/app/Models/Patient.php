<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Patient extends Model
{
    use HasFactory;

    protected $fillable = [
        'date_of_birth', 'gender', 'address',
        'health_insurance', 'google_id', 'facebook_id'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'id');
    }

    public function appointments()
    {
        return $this->hasMany(Appointment::class, 'patient_id');
    }

    public function feedbacks()
    {
        return $this->hasMany(Feedback::class, 'patient_id');
    }

    public function favorites()
    {
        return $this->hasMany(Favorite::class, 'patient_id');
    }
}
