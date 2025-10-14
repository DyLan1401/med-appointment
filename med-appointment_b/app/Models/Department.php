<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Docter;
class Department extends Model
{
    use HasFactory;

    // Tên bảng (nếu khác với tên mặc định "departments")
    protected $table = 'departments';

    // Các cột có thể gán giá trị hàng loạt (mass assignment)
    protected $fillable = [
        'name',
        'description',
    ];

    // Nếu muốn Laravel tự động quản lý created_at và updated_at
    public $timestamps = true;

    public function Docters()
{
    return $this->hasMany(Docter::class);
}
}
