<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Models\Appointment;

class ReminderMail extends Mailable
{
    use Queueable, SerializesModels;

    public $appointment;

    public function __construct(Appointment $appointment)
    {
        $this->appointment = $appointment->load([
        'patient.user',
        'doctor.user',
        'doctor.specialization'
    ]);
    }

    public function build()
    {
        return $this->subject('⏰ Nhắc lịch khám bệnh của bạn')
                    ->markdown('emails.reminder');
    }
}
