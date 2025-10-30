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
        // Tạo Faker tiếng Việt
        $faker = Faker::create('vi_VN');

        // Lấy danh sách ID danh mục
        $categoryIds = CategoryPost::pluck('id')->toArray();

        // Sinh 1000 bài viết mẫu
        for ($i = 1; $i <= 10; $i++) {
            $imageUrl = "https://picsum.photos/seed/post{$i}/600/400";

            Post::create([
                'title' => $faker->sentence(6, true),
                'slug' => $faker->slug(),
                'content' => $faker->paragraph(10, true),
                'category_id' => $faker->randomElement($categoryIds),
                'image' => $imageUrl,
                'user_id' => null, // hoặc random user nếu có bảng users
            ]);
        }
    }
}