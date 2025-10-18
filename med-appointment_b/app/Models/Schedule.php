<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Schedule extends Model
{
    use HasFactory;

    protected $fillable = [
        'doctor_id', 'date', 'start_time', 'end_time', 'status'
    ];

 public function doctor()
{
    return $this->belongsTo(Doctor::class);
}

public function service()
{
    return $this->belongsTo(Service::class);
}

    protected $casts = [
        'date' => 'date',
    ];
}
