<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
<<<<<<< HEAD
        // ✅ Tạo user mẫu
        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        $this->call([
            PatientsSeeder::class,
            UserSeeder::class,
=======
        // User::factory(10)->create();


        // User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);

        // $this->call([
        //     PatientsSeeder::class,
        // ]);


    //     $this->call([
    //     UserSeeder::class,
    // ]);

    //     $this->call(DepartmentSeeder::class);

    //      $this->call([
    //     DoctorSeeder::class,
    // ]);

      $this->call([
>>>>>>> NguyenThanhLan-QuanliPosts
            CategoryPostSeeder::class,
            PostSeeder::class,
            ServiceSeeder::class,
            ContactSeeder::class,
            DepartmentSeeder::class,
            DoctorSeeder::class,
            AppointmentSeeder::class,
            ScheduleSeeder::class,
        ]);
    }
}