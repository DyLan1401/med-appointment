<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Department;
use App\Models\ChatGroup;
use App\Models\Doctor;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class DepartmentSeeder extends Seeder
{
    public function run(): void
    {
        $departments = [
            'Tim mạch',
            'Nhi khoa',
            'Sản - Phụ khoa',
            'Hô hấp',
            'Tiêu hóa',
            'Thần kinh',
            'Nội tổng quát',
            'Ngoại tổng quát',
            'Chỉnh hình - Cơ xương khớp',
            'Da liễu',
            'Tai - Mũi - Họng (TMH)',
            'Răng - Hàm - Mặt',
            'Mắt',
            'Ung bướu',
            'Thận - Tiết niệu',
            'Truyền nhiễm',
            'Nội tiết - Đái tháo đường',
            'Gây mê hồi sức',
            'Phẫu thuật thần kinh',
            'Phẫu thuật tim mạch',
            'Liên khoa (Cấp cứu)',
            'Tâm thần',
            'Dinh dưỡng - Tiết chế',
            'Phục hồi chức năng',
            'Y học cổ truyền',
            'Sức khỏe sinh sản'
        ];

        foreach ($departments as $name) {
            Department::firstOrCreate(
                ['name' => $name],
                ['description' => "Khoa $name"]
            );
        }
    }
}