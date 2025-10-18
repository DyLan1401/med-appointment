<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class DoctorCertificate extends Model
{
    use HasFactory;

    /**
     * 🔹 Các trường có thể gán hàng loạt (mass assignment)
     */
    protected $fillable = [
        'doctor_id',
        'certificate_name',     // Tên chứng chỉ
        'certificate_type',     // Loại (Ảnh, PDF, Bằng đại học, vv)
        'image',                // Đường dẫn file chứng chỉ (trong storage)
        'issued_by',            // Nơi cấp
        'issued_date',          // Ngày cấp
        'description',          // Mô tả thêm
    ];

    /**
     * 🔹 Mối quan hệ: Một chứng chỉ thuộc về một bác sĩ
     */
    public function doctor()
    {
        return $this->belongsTo(Doctor::class, 'doctor_id');
    }

    // ===================================================
    // 🔹 PHẦN HỖ TRỢ HỒ SƠ & UPLOAD CHỨNG CHỈ
    // ===================================================

    /**
     * Trả về URL công khai của file chứng chỉ (ảnh hoặc PDF)
     */
    public function getFileUrlAttribute()
    {
        if (!$this->image) {
            return asset('images/default-certificate.png');
        }

        return Storage::disk('public')->exists($this->image)
            ? asset('storage/' . $this->image)
            : asset('images/default-certificate.png');
    }

    /**
     * Kiểm tra file là ảnh hay không
     */
    public function getIsImageAttribute()
    {
        if (!$this->image) return false;
        $ext = strtolower(pathinfo($this->image, PATHINFO_EXTENSION));
        return in_array($ext, ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp']);
    }

    /**
     * Kiểm tra file là PDF hay không
     */
    public function getIsPdfAttribute()
    {
        if (!$this->image) return false;
        return strtolower(pathinfo($this->image, PATHINFO_EXTENSION)) === 'pdf';
    }

    /**
     * Khi upload chứng chỉ: tự động lưu file vào storage/app/public/certificates
     */
    public function setImageAttribute($value)
    {
        if (is_file($value)) {
            $path = $value->store('certificates', 'public');
            $this->attributes['image'] = $path;
        } else {
            $this->attributes['image'] = $value;
        }
    }

    /**
     * Tự động xoá file chứng chỉ khỏi storage khi xoá bản ghi
     */
    protected static function booted()
    {
        static::deleting(function ($certificate) {
            if ($certificate->image && Storage::disk('public')->exists($certificate->image)) {
                Storage::disk('public')->delete($certificate->image);
            }
        });
    }

    // ===================================================
    // 🔹 CÁC PHƯƠNG THỨC TIỆN ÍCH CHO PROFILE
    // ===================================================

    /**
     * Lấy mô tả gọn cho chứng chỉ hiển thị trong profile bác sĩ
     */
    public function getShortInfoAttribute()
    {
        return "{$this->certificate_name} ({$this->certificate_type}) - " .
            ($this->issued_by ?? 'Không rõ nơi cấp');
    }

    /**
     * Lấy link tải xuống chứng chỉ (nếu có file tồn tại)
     */
    public function getDownloadLinkAttribute()
    {
        if ($this->image && Storage::disk('public')->exists($this->image)) {
            return route('certificates.download', ['id' => $this->id]);
        }
        return null;
    }
}