<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\CategoryPost;

class CategoryPostSeeder extends Seeder
{
    public function run(): void
     {
      for ($i = 1; $i <= 20; $i++) {
    CategoryPost::create([
        'name' => "Danh mục {$i}",
        'description' => "Mô tả danh mục {$i}",
    ]);
}

    }
}
