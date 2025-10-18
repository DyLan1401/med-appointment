<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AppointmentSeeder extends Seeder
{
    public function run(): void
    {
        $records = [];

        for ($i = 1; $i <= 20; $i++) { // 👈 tạo 20 dòng dữ liệu
            $records[] = [
                'patient_id' => rand(1, 5),
                'doctor_id' => rand(1, 3),
                'service_id' => rand(1, 4),
                'appointment_date' => Carbon::now()->addDays(rand(1, 30))->setTime(rand(8, 16), 0, 0),
                'status' => collect(['pending', 'confirmed', 'rejected', 'cancelled', 'completed'])->random(),
                'notes' => 'Ghi chú ngẫu nhiên ' . $i,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        DB::table('appointments')->insert($records);
    }
}
