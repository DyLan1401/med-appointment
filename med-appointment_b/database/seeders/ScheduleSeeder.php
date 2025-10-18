<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
class ScheduleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
     // Dữ liệu mẫu
        $schedules = [
            [
                'doctor_id' => 1, // Thay thế bằng ID bác sĩ có sẵn trong DB
                'date' => Carbon::now()->addDays(1)->toDateString(), // Ngày mai - Ca sáng
                'start_time' => '08:00:00',
                'end_time' => '12:00:00',
                'status' => 'available',
            ],
            [
                'doctor_id' => 1, 
                'date' => Carbon::now()->addDays(1)->toDateString(), // Ngày mai - Ca chiều
                'start_time' => '14:00:00',
                'end_time' => '17:00:00',
                'status' => 'available',
            ],
            [
                'doctor_id' => 1, 
                'date' => Carbon::now()->addDays(2)->toDateString(), // Ngày kia - Ca sáng ngắn (Unavailable)
                'start_time' => '09:00:00',
                'end_time' => '11:00:00',
                'status' => 'unavailable', 
            ],
            
            // --- 5 Bản ghi mới được thêm vào ---

            [
                'doctor_id' => 1, 
                'date' => Carbon::now()->addDays(3)->toDateString(), // Ngày +3 - Ca sáng sớm
                'start_time' => '07:30:00',
                'end_time' => '11:30:00',
                'status' => 'available',
            ],
            [
                'doctor_id' => 1, 
                'date' => Carbon::now()->addDays(3)->toDateString(), // Ngày +3 - Ca chiều (Unavailable)
                'start_time' => '13:00:00',
                'end_time' => '16:00:00',
                'status' => 'unavailable',
            ],
            [
                'doctor_id' => 1, 
                'date' => Carbon::now()->addDays(4)->toDateString(), // Ngày +4 - Cả ngày
                'start_time' => '08:00:00',
                'end_time' => '17:00:00',
                'status' => 'available',
            ],
            [
                'doctor_id' => 1, 
                'date' => Carbon::now()->addDays(5)->toDateString(), // Ngày +5 - Ca tối
                'start_time' => '18:00:00',
                'end_time' => '21:00:00',
                'status' => 'available',
            ],
            [
                'doctor_id' => 1, 
                'date' => Carbon::now()->addDays(6)->toDateString(), // Ngày +6 - Ca ngắn (Available)
                'start_time' => '10:00:00',
                'end_time' => '12:00:00',
                'status' => 'available',
            ],
        ];

        DB::table('schedules')->insert($schedules);
    }
}
