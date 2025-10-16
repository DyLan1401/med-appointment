<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();


        // User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);
        $this->call(DepartmentSeeder::class);
        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

<<<<<<< HEAD
        $this->call([
            PatientsSeeder::class,
        ]);
=======
       \App\Models\User::factory(10)->create();

        $this->call([
        UserSeeder::class,
    ]);
>>>>>>> origin/DangThanhPhong-QuanLyUser
    }


}
