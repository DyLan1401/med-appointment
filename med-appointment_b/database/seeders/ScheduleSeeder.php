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
     $schedules = [];

$doctorId = 2;

// Lấy các mốc tháng
$lastMonth = Carbon::now()->subMonth()->startOfMonth();
$thisMonth = Carbon::now()->startOfMonth();
$nextMonth = Carbon::now()->addMonth()->startOfMonth();

// Tổng 3 tháng
$months = [
    $lastMonth,
    $thisMonth,
    $nextMonth,
];

foreach ($months as $month) {

    // Lặp từng ngày trong tháng
    $daysInMonth = $month->daysInMonth;

    for ($day = 1; $day <= $daysInMonth; $day++) {

        $date = $month->copy()->day($day)->toDateString();

        // Ca sáng
        $schedules[] = [
            'doctor_id' => $doctorId,
            'date' => $date,
            'start_time' => '08:00:00',
            'end_time' => '12:00:00',
            'status' => rand(0, 1) ? 'available' : 'unavailable',
        ];

        // Ca chiều
        $schedules[] = [
            'doctor_id' => $doctorId,
            'date' => $date,
            'start_time' => '14:00:00',
            'end_time' => '17:00:00',
            'status' => rand(0, 1) ? 'available' : 'unavailable',
        ];
    }
}

    }
}
