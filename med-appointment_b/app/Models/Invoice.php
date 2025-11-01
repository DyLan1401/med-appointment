<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    use HasFactory;

    protected $fillable = [
        'appointment_id', 'patient_id', 'doctor_id',
        'amount', 'status',  'type', 'file_url'
    ];

    public function appointment()
    {
        return $this->belongsTo(Appointment::class, 'appointment_id');
    }

    public function payments()
    {
        return $this->hasMany(Payment::class, 'invoice_id');
    }
}
