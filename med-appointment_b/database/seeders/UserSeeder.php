<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserSeeder extends Seeder
{
    public function run(): void
    {

      

        // Admin cố định
        User::create([
            'name' => 'Admin System',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'phone' => '0909999999',
            'insurance_info' => 'Quản trị viên hệ thống',
            'avatar_url' => 'https://i.pravatar.cc/150?img=1',
        ]);

        // 5 bác sĩ
        for ($i = 1; $i <= 5; $i++) {
            User::create([
                'name' => fake()->name(),
                'email' => fake()->unique()->safeEmail(),
                'password' => Hash::make('123456'),
                'role' => 'doctor',
                'phone' => fake()->phoneNumber(),
                'insurance_info' => 'Bác sĩ chuyên khoa ' . fake()->word(),
                'avatar_url' => "https://i.pravatar.cc/150?img=" . rand(2, 50),
            ]);
        }


        // 10 bệnh nhân (role = user)
        for ($i = 1; $i <= 10; $i++) {
            User::create([
                'name' => fake()->name(),
                'email' => fake()->unique()->safeEmail(),
                'password' => Hash::make('123456'),
                'role' => 'patient',
                'phone' => fake()->numerify('09########'),
                'insurance_info' => 'Thẻ BHYT: ' . strtoupper(fake()->bothify('BHYT####')),
                'avatar_url' => "https://i.pravatar.cc/150?img=" . rand(51, 90),
            ]);
        }
    }
}
