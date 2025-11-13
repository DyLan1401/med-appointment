<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Appointment;
use Illuminate\Support\Facades\Mail;
use App\Mail\ReminderMail;
use Carbon\Carbon;

class SendAppointmentReminders extends Command
{
    protected $signature = 'appointments:remind';
    protected $description = 'Gửi email nhắc lịch khám: trước 1 ngày và trong ngày';

    public function handle()
    {
        $now = Carbon::now();

        // ================================
        // 1) NHẮC LỊCH TRƯỚC 1 NGÀY
        // ================================
        $tomorrow = Carbon::tomorrow()->toDateString();

        $tomorrowAppointments = Appointment::with(['patient.user'])
            ->whereDate('appointment_date', $tomorrow)
            ->whereIn('status', ['pending', 'confirmed'])
            ->get();

        if ($tomorrowAppointments->isEmpty()) {
            $this->info("⏳ Không có lịch hẹn nào cho ngày mai ({$tomorrow})");
        } else {
            foreach ($tomorrowAppointments as $a) {
                $email = $a->patient->user->email ?? null;

                if ($email) {
                    Mail::to($email)->send(new ReminderMail($a));
                    $this->info("📩 Nhắc TRƯỚC 1 NGÀY cho {$email} (lịch ngày {$a->appointment_date})");
                }
            }
        }

        // ================================
        // 2) NHẮC LỊCH TRONG NGÀY HÔM NAY
        // ================================
        $today = Carbon::today()->toDateString();

        $todayAppointments = Appointment::with(['patient.user'])
            ->whereDate('appointment_date', $today)
            ->whereIn('status', ['pending', 'confirmed'])
            ->get();

        if ($todayAppointments->isEmpty()) {
            $this->info("⏳ Không có lịch hẹn nào trong ngày hôm nay ({$today})");
        } else {
            foreach ($todayAppointments as $a) {
                $email = $a->patient->user->email ?? null;

                if ($email) {
                    Mail::to($email)->send(new ReminderMail($a));
                    $this->info("📩 Nhắc TRONG NGÀY cho {$email} (lịch giờ {$a->appointment_time})");
                }
            }
        }

        $this->info("✅ Hoàn tất gửi mail nhắc lịch");
        return Command::SUCCESS;
    }
}
