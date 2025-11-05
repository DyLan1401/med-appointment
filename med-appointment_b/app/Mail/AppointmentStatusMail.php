<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class AppointmentStatusMail extends Mailable
{
    use Queueable, SerializesModels;

    public $appointment;
    public $type;

    public function __construct($appointment, $type)
    {
        $this->appointment = $appointment;
        $this->type = $type;
    }

    public function build()
    {
        $subject = $this->type === 'confirmed'
            ? '✅ Lịch hẹn của bạn đã được xác nhận'
            : '❌ Lịch hẹn của bạn đã bị từ chối';

        return $this->subject($subject)
            ->view('emails.appointment_status');
    }
}
