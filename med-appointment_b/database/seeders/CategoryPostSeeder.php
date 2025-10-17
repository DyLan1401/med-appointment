<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\CategoryPost;

class CategoryPostSeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Công nghệ', 'description' => 'Tin tức và bài viết về công nghệ mới nhất'],
            ['name' => 'Sức khỏe', 'description' => 'Chia sẻ kiến thức và mẹo chăm sóc sức khỏe'],
            ['name' => 'Giáo dục', 'description' => 'Tin tức, chia sẻ về giáo dục và học tập'],
            ['name' => 'Thể thao', 'description' => 'Cập nhật tin tức thể thao hàng ngày'],
            ['name' => 'Du lịch', 'description' => 'Khám phá những địa điểm du lịch thú vị'],
        ];

        foreach ($categories as $cat) {
            CategoryPost::create($cat);
        }
    }
}
