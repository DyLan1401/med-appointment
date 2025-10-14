<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Department;

class DepartmentSeeder extends Seeder
{
    public function run(): void
    {
        Department::insert([
            [
                'name' => 'Phòng Kế Toán',
                'description' => 'Quản lý tài chính và kế toán công ty',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Phòng Nhân Sự',
                'description' => 'Quản lý nhân viên và tuyển dụng',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Phòng Công Nghệ Thông Tin',
                'description' => 'Phát triển và bảo trì hệ thống phần mềm',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
