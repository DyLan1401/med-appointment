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
            DB::table('banners')->insert([
                'title' => $faker->sentence(3),
                'image' => $faker->imageUrl(800, 400, 'health', true, 'Clinic Banner'),
                'link' => $faker->url(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
