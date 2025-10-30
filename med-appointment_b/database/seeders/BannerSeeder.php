<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;

class BannerSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create();

        foreach (range(1, 10) as $index) {
         $imageUrl = "https://picsum.photos/seed/post{$index}/800/400";

            DB::table('banners')->insert([
                'title' => $faker->sentence(3),
                'image' => $imageUrl,
                'link' => $faker->url(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
