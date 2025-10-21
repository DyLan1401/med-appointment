<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Post;
use App\Models\CategoryPost;
use Faker\Factory as Faker;

class PostSeeder extends Seeder
{
    public function run(): void
    {
        // ✅ Tạo Faker tiếng Việt
        $faker = Faker::create('vi_VN');

        // ✅ Lấy danh sách ID danh mục
        $categoryIds = CategoryPost::pluck('id')->toArray();

        // ✅ Sinh 1000 bài viết mẫu
        for ($i = 1; $i <= 300; $i++) {
            $imageUrl = "https://via.placeholder.com/600x400.png?text=Blog+Post+" . $i;

            Post::create([
                'title' => $faker->sentence(6, true),
                'slug' => $faker->slug(),
                'content' => $faker->paragraph(10, true),
                'category_id' => $faker->randomElement($categoryIds),
                'user_id' => null, // hoặc random user nếu có bảng users
            ]);
        }
    }
}