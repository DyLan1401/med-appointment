<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\CategoryPost;

class CategoryPostSeeder extends Seeder
{
    public function run(): void
     {
<<<<<<< HEAD
      for ($i = 1; $i <= 50; $i++) {
=======
      for ($i = 1; $i <= 20; $i++) {
>>>>>>> DinhThanhToan/6-QuanLyLichRanhDoctor
    CategoryPost::create([
        'name' => "Danh mục {$i}",
        'description' => "Mô tả danh mục {$i}",
    ]);
}

    }
}
