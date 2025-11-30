<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'invoice_id',
        'appointment_id',
        'method',
        'transaction_code',
        'amount',
        'status',
        'paid_at'
    ];


    public static function createPayosPayment($appointmentId, $amount)
    {
        return self::create([
            'appointment_id' => $appointmentId,
            'amount' => $amount,
            'method' => 'payos',
            'status' => 'pending',
        ]);
    }
    public function invoice()
    {
        return $this->belongsTo(Invoice::class, 'invoice_id');
    }
    public function appointment()
    {
        return $this->belongsTo(Appointment::class);
    }
}
