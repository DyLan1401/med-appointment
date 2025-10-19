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
        // Tạo user mẫu
        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

<<<<<<< HEAD
    //     $this->call([
    //         PatientsSeeder::class,
    //     ]);

    //     $this->call([
    //         UserSeeder::class,
    //     ]);

    

    // //      $this->call([
    // //     DoctorSeeder::class,
    // // ]);

    //     $this->call([
    //             CategoryPostSeeder::class,
    //             PostSeeder::class,
    //     ]);
    //     $this->call([
    //         $this->call(ServiceSeeder::class),
    //     ]);

    //             $this->call([
    //         $this->call(ContactSeeder::class),
    //     ]);


      
    // $this->call([
    //         DepartmentSeeder::class,
    //         DoctorSeeder::class,
    //         AppointmentSeeder::class,
    //     ]);
    
    // $this->call([
    //     ScheduleSeeder::class,
    // ]);

     $this->call([
            PatientsSeeder::class,
            UserSeeder::class,
            CategoryPostSeeder::class,
            // PostSeeder::class, // Đã được comment, kiểm tra xem có cần mở lại không
            ServiceSeeder::class,
            ContactSeeder::class,
            DepartmentSeeder::class,
            DoctorSeeder::class,
            AppointmentSeeder::class,
            ScheduleSeeder::class,
=======
        // Gọi các seeder khác
        $this->call([
            UserSeeder::class,
            PatientsSeeder::class,
            DepartmentSeeder::class,
            // DoctorSeeder::class,
            CategoryPostSeeder::class,
            PostSeeder::class,
            ServiceSeeder::class,
            ContactSeeder::class,
>>>>>>> DangThanhPhong-LuuBacSiYeuThich
        ]);
    }
}