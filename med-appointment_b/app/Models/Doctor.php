<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Doctor extends Model
{
    use HasApiTokens, Notifiable, HasFactory;

    /**
     * Các trường có thể gán hàng loạt
     */
    protected $fillable = [
        'user_id',
        'department_id',
        'specialization_id',
        'status',
        'bio',
        'experience_years',
        'education',
        'clinic_address',
        'avatar',
    ];

    /**
     * Migration mới có timestamps()
     */
    public $timestamps = true;

    // ===============================
    // 🔥 RELATIONSHIPS
    // ===============================

    /**
     * User (owner) của doctor
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Quan hệ department chính dùng cho chat/group
     */
    public function department()
    {
        return $this->belongsTo(Department::class, 'department_id');
    }

    /**
     * Nếu bạn vẫn giữ specialization (đôi khi khác với department)
     */
    public function specialization()
    {
        return $this->belongsTo(Department::class, 'specialization_id');
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
        return $this->hasMany(Feedback::class);
    }

    // ===============================
    // Avatar helpers
    // ===============================

    public function getAvatarUrlAttribute()
    {
        if ($this->avatar && Storage::disk('public')->exists($this->avatar)) {
            return asset('storage/' . $this->avatar);
        }

        return asset('images/default-avatar.png');
    }

    public function setAvatarAttribute($value)
    {
        // Nếu upload file trực tiếp (instance của UploadedFile)
        if (is_file($value)) {
            $path = $value->store('avatars', 'public');
            $this->attributes['avatar'] = $path;
        } else {
            $this->attributes['avatar'] = $value;
        }
    }

    // ===============================
    // Full profile trả về cho FE
    // ===============================
    public function getFullProfileAttribute()
    {
        return [
            'id' => $this->id,
            'name' => $this->user->name ?? null,
            'email' => $this->user->email ?? null,
            'phone' => $this->user->phone ?? null,
            'avatar' => $this->avatar,
            'avatar_url' => $this->avatar_url,

            // TRẢ VỀ CHO FE DÙNG CHAT / NHÓM CHUYÊN KHOA
            'department_id' => $this->department_id,
            'department_name' => $this->department->name ?? null,

            // Nếu vẫn giữ specialization
            'specialization_id' => $this->specialization_id,
            'specialization_name' => $this->specialization->name ?? null,

            'bio' => $this->bio,
            'education' => $this->education,
            'experience_years' => $this->experience_years,
            'clinic_address' => $this->clinic_address,
            'status' => $this->status,
            'certificates' => $this->certificate_files,
        ];
    }

    // ===============================
    // Certificate helpers
    // ===============================
    public function getCertificateCountAttribute()
    {
        return $this->certificates()->count();
    }

    public function getCertificateNamesAttribute()
    {
        return $this->certificates->pluck('certificate_name')->implode(', ');
    }

    public function getCertificateFilesAttribute()
    {
        return $this->certificates->map(function ($cert) {
            return [
                'id' => $cert->id,
                'name' => $cert->certificate_name,
                'type' => $cert->certificate_type,
                'file_url' => $cert->image ? asset('storage/' . $cert->image) : null,
            ];
        });
    }

    // ===============================
    // Delete files when removing doctor
    // ===============================
    protected static function booted()
    {
        static::deleting(function ($doctor) {
            if ($doctor->avatar && Storage::disk('public')->exists($doctor->avatar)) {
                Storage::disk('public')->delete($doctor->avatar);
            }

            foreach ($doctor->certificates as $cert) {
                if ($cert->image && Storage::disk('public')->exists($cert->image)) {
                    Storage::disk('public')->delete($cert->image);
                }
                $cert->delete();
            }
        });
    }
}