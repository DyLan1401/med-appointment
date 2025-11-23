<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;
use Illuminate\Support\Facades\Hash;

class DoctorSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create();

        for ($i = 1; $i <= 50; $i++) {

            // Tạo user
            $userId = DB::table('users')->insertGetId([
                'name' => $faker->name(),
                'email' => $faker->unique()->safeEmail(), // sửa lại
                'password' => Hash::make('123456'),
                'role' => 'doctor',
                'avatar_url' => null,
                'phone' => $faker->phoneNumber(),
                'insurance_info' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Tạo doctor liên kết user_id
            DB::table('doctors')->insert([
                'user_id' => $userId,
                'specialization_id' => $faker->randomElement([1, 2, 3, 4, 5]),
                'status' => 'active',
<<<<<<< HEAD
                'bio' => $faker->sentence(10),
=======
                'bio' => $faker->sentence(20),
>>>>>>> DinhThanhToan/6-QuanLyLichRanhDoctor
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
