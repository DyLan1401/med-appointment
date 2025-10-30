<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;

class ContactSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create('vi_VN'); 

        for ($i = 1; $i <= 10; $i++) {
            DB::table('contacts')->insert([
                'name'       => $faker->name(),
                'email'      => $faker->unique()->safeEmail(),
                'phone'      => $faker->phoneNumber(),
                'message'    => $faker->sentence(10),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
