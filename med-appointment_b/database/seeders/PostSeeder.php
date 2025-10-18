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
        $faker = Faker::create('vi_VN'); // Ngôn ngữ tiếng Việt
        $categoryIds = CategoryPost::pluck('id')->toArray();
$imageUrl = "https://via.placeholder.com/600x400.png?text=Blog+Post+" . $i;

        for ($i = 1; $i <= 20; $i++) {
            Post::create([
                'title' => $faker->sentence(6, true),
                'content' => $faker->paragraph(5, true),
                'image' => $imageUrl,
                'category_id' => $faker->randomElement($categoryIds),
                'user_id' => null,
            ]);
        }
    }
}
