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
        

        $this->call([
            UserSeeder::class,
            PatientsSeeder::class,
            CategoryPostSeeder::class,
            PostSeeder::class,
            ServiceSeeder::class,
            ContactSeeder::class,
            DepartmentSeeder::class,
            DoctorSeeder::class,
            AppointmentSeeder::class,
            ScheduleSeeder::class,
            BannerSeeder::class,
            InvoiceSeeder::class,
            FeedbackSeeder::class,
        ]);
    }
}