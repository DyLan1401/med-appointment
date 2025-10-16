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

        for ($i = 1; $i <= 30; $i++) {

            // 1️⃣ Tạo user
            $userId = DB::table('users')->insertGetId([
                'name' => $faker->name(),
                'email' => $faker->unique()->safeEmail(), // ✅ sửa lại
                'password' => Hash::make('123456'),
                'role' => 'doctor',
                'avatar_url' => null,
                'phone' => $faker->phoneNumber(),
                'insurance_info' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // 2️⃣ Tạo doctor liên kết user_id
            DB::table('doctors')->insert([
                'user_id' => $userId,
                'specialization' => $faker->randomElement(['Nhi', 'Tim mạch', 'Da liễu', 'Răng Hàm Mặt']),
                'status' => 'active',
                'bio' => $faker->sentence(8),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
