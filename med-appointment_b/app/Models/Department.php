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
  // 🟢 Hàm lấy danh sách (phân trang)
    public static function getDepartments($limit = 10)
    {
        return self::paginate($limit);
    }

    // 🟣 Hàm tìm kiếm (có phân trang)
    public static function searchDepartments($query = '', $limit = 10)
    {
        $query = trim($query);

        if ($query === '') {
            return self::paginate($limit);
        }

        return self::where('name', 'like', "%{$query}%")
            ->orWhere('description', 'like', "%{$query}%")
            ->paginate($limit);
    }

    // 🟠 Hàm tạo mới
    public static function createDepartment(array $data)
    {
        return self::create($data);
    }

    // 🔵 Hàm cập nhật
    public function updateDepartment(array $data)
    {
        $this->fill($data);
        $this->save();
        return $this;
    }
    public function Docters()
{
    return $this->hasMany(Docter::class);
}

}
