<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Feedback extends Model
{
    use HasFactory;

    protected $table = 'feedbacks';
    protected $fillable = ['appointment_id', 'doctor_id', 'patient_id', 'rating', 'comment'];

    public function appointment()
    {
        return $this->belongsTo(Appointment::class);
    }

    public function doctor()
    {
        return $this->belongsTo(Doctor::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
        // return $this->belongsTo(Patient::class);
    }

    // public function patient()
    // {
    //     return $this->belongsTo(Patient::class, 'patient_id');
    // }

      /** 🔹 Lấy danh sách feedback mới nhất */
    public static function getRecentFeedbacks($limit = 5)
    {
        return self::with(['user.patient'])
            ->select('id', 'doctor_id', 'user_id', 'rating', 'comment', 'created_at')
            ->latest()
            ->take($limit)
            ->get()
            ->map(function ($f) {
                return [
                    'rating' => $f->rating,
                    'comment' => $f->comment,
                    'patient_name' => optional($f->user->patient->user ?? $f->user)->name ?? 'Ẩn danh',
                    'created_at' => $f->created_at->format('d/m/Y H:i'),
                ];
            });
    }
}