<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Doctor extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'specialization_id',
        'status',
        'bio',
        'experience_years',      
        'education',             
        'clinic_address',        
        'avatar',                
    ];

    
    public $timestamps = false;


    public function user()
    {
        return $this->belongsTo(User::class);
    }

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

    

    public function getAvatarUrlAttribute()
    {
        if ($this->avatar && Storage::disk('public')->exists($this->avatar)) {
            return asset('storage/' . $this->avatar);
        }

        // Nếu không có avatar, lấy avatar mặc định
        return asset('images/default-avatar.png');
    }

    // Khi set avatar mới, tự động lưu file vào storage.
    public function setAvatarAttribute($value)
    {
        // Nếu là file upload
        if (is_file($value)) {
            $path = $value->store('avatars', 'public');
            $this->attributes['avatar'] = $path;
        }
        // Nếu chỉ là chuỗi đường dẫn (giữ nguyên)
        else {
            $this->attributes['avatar'] = $value;
        }
    }

    // HỒ SƠ BÁC SĨ (PROFILE)

    public function getFullProfileAttribute()
    {
        return [
            'id' => $this->id,
            'name' => $this->user->name ?? null,
            'email' => $this->user->email ?? null,
            'phone' => $this->user->phone ?? null,
            'avatar' => $this->avatar,
            'avatar_url' => $this->avatar_url, // ảnh đại diện đầy đủ URL
            'bio' => $this->bio,
            'specialization_id' => $this->specialization_id,
            'specialization_name' => $this->specialization->name ?? null,
            'education' => $this->education,
            'experience_years' => $this->experience_years,
            'clinic_address' => $this->clinic_address,
            'status' => $this->status,
            'certificates' => $this->certificate_files,
        ];
    }

    // CHỨNG CHỈ (CERTIFICATES)

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
                'file_url' => $cert->image
                    ? asset('storage/' . $cert->image)
                    : null,
            ];
        });
    }

    // XOÁ FILE KHI XOÁ BÁC SĨ
    protected static function booted()
    {
        static::deleting(function ($doctor) {
            // Xoá avatar nếu có
            if ($doctor->avatar && Storage::disk('public')->exists($doctor->avatar)) {
                Storage::disk('public')->delete($doctor->avatar);
            }

            // Xoá chứng chỉ kèm file
            foreach ($doctor->certificates as $cert) {
                if ($cert->image && Storage::disk('public')->exists($cert->image)) {
                    Storage::disk('public')->delete($cert->image);
                }
                $cert->delete();
            }
        });
    }
}