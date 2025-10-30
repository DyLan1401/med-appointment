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

        // Chỉ tạo bản ghi Patient cho những user có role = 'user'
        $users = User::where('role', 'user')->get();

        foreach ($users as $user) {
            Patient::create([

                'user_id' => $user->id,
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