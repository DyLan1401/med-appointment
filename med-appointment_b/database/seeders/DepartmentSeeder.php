<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Department;

class DepartmentSeeder extends Seeder
{
    public function run(): void
    {
      for ($i = 1; $i <= 20; $i++) {
    Department::create([
        'name' => "Phòng Demo {$i}",
        'description' => "Mô tả phòng demo {$i}",
    ]);
}

    }
}
