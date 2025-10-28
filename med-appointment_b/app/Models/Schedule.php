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


        // 🔹 Lấy lịch làm việc theo ID bác sĩ
    public static function getByDoctorId($doctor_id)
    {
        return self::where('doctor_id', $doctor_id)
            ->orderBy('date', 'asc')
            ->orderBy('start_time', 'asc')
            ->get();
    }

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
