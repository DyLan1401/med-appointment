<?php

namespace Database\Seeders; // Namespace đúng cho Laravel

use App\Models\Invoice;
use App\Models\Appointment;
use App\Models\Patient;
use App\Models\Doctor;
use Illuminate\Database\Seeder;

class InvoiceSeeder extends Seeder
{
    public function run()
    {
        $appointments = Appointment::all()->pluck('id')->toArray();
        $patients = Patient::all()->pluck('id')->toArray();
        $doctors = Doctor::all()->pluck('id')->toArray();

        for ($i = 0; $i < 50; $i++) {
            Invoice::create([
                'appointment_id' => $appointments[array_rand($appointments)],
                'patient_id' => $patients[array_rand($patients)],
                'doctor_id' => $doctors[array_rand($doctors)],
                'amount' => rand(50000, 5000000) / 100,
                'status' => ['unpaid', 'paid', 'canceled'][rand(0, 2)],
                'file_url' => 'https://example.com/invoices/invoice_' . uniqid() . '.pdf',
                'created_at' => now()->subDays(rand(0, 30)),
            ]);
        }
    }
}