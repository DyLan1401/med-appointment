<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Patient;
use Faker\Factory as Faker;

class PatientsSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create('vi_VN');

        for ($i = 0; $i < 10; $i++) {
            // Tạo user
            $user = User::create([
                'name' => $faker->name(),
                'email' => $faker->unique()->safeEmail(),
                'phone' => $faker->numerify('09########'),
                'password' => bcrypt('password'), // mật khẩu mặc định
            ]);

            // Tạo bệnh nhân tương ứng
            Patient::create([
                'id' => $user->id,
                'date_of_birth' => $faker->date('Y-m-d', '2005-01-01'),
                'gender' => $faker->randomElement(['male', 'female', 'other']),
                'address' => $faker->address(),
                'health_insurance' => strtoupper($faker->bothify('BHYT####')),
                'google_id' => $faker->optional()->uuid(),
                'facebook_id' => $faker->optional()->uuid(),
            ]);
        }
    }
}