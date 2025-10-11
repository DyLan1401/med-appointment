<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DoctorCertificate extends Model
{
    use HasFactory;

    protected $fillable = [
        'doctor_id', 'certificate_name', 'certificate_type', 'image'
    ];

    public function doctor()
    {
        return $this->belongsTo(Doctor::class, 'doctor_id');
    }
}
