<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\User;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Tạo admin cố định
        User::create([
            'name' => 'Admin System',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'phone' => '0909999999',
            'insurance_info' => 'Quản trị viên hệ thống',
            'avatar_url' => 'https://i.pravatar.cc/150?img=1',
        ]);

        // Tạo 10 user ngẫu nhiên
        for ($i = 1; $i <= 10; $i++) {
            User::create([
                'name' => fake()->name(),
                'email' => fake()->unique()->safeEmail(),
                'password' => Hash::make('123456'),
                'role' => fake()->randomElement(['user', 'doctor']),
                'phone' => fake()->phoneNumber(),
                'insurance_info' => fake()->sentence(6),
                'avatar_url' => "https://i.pravatar.cc/150?img=" . rand(2, 70),
            ]);
        }
    }
}