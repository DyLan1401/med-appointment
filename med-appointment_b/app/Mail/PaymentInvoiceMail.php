<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class PaymentInvoiceMail extends Mailable
{
    use Queueable, SerializesModels;

    public $doctorName;
    public $patientName;
    public $serviceName;
    public $originalAmount;
    public $paidAmount;
    public $paymentType;

    public function __construct(
    $doctorName,
    $patientName,
    $serviceName,
    $originalAmount,
    $paidAmount,
    $paymentType
) {
    $this->doctorName = $doctorName;
    $this->patientName = $patientName;
    $this->serviceName = $serviceName;
    $this->originalAmount = $originalAmount;
    $this->paidAmount = $paidAmount;
    $this->paymentType = $paymentType;
}

    public function build()
    {
        return $this->subject('Hóa đơn thanh toán dịch vụ khám bệnh')
                    ->markdown('emails.payment_invoice');
    }
}
