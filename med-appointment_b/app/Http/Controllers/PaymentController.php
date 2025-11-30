<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use Illuminate\Http\Request;
use App\Models\Invoice;
use PayOS\PayOS;
use Illuminate\Support\Facades\Mail;
use App\Mail\PaymentInvoiceMail;
use App\Models\Appointment;

class PaymentController extends Controller
{
    protected $payOS;
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Payment $payment)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Payment $payment)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Payment $payment)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Payment $payment)
    {
        //
    }

    public function __construct()
    {
        $this->payOS = new PayOS(
            env('PAYOS_CLIENT_ID'),
            env('PAYOS_API_KEY'),
            env('PAYOS_CHECKSUM_KEY')
        );
    }
    public function createPayment(Request $request)
    {

        $request->validate([
            'invoice_id' => 'required|exists:invoices,id',
        ]);

        $invoice = Invoice::find($request->invoice_id);



        // ✅ Lấy appointment_id từ invoice (nếu có)
        $appointmentId = $invoice->appointment_id ?? 1; // 👈 hoặc null nếu DB cho phép null

        $payment = Payment::createPayosPayment($appointmentId, $invoice->amount);

        $orderCode = (int)substr(time() . rand(100, 999), -12);


        $paymentData = [
            "orderCode" => $orderCode,
            "amount" => (int) $invoice->amount,
            "description" => "Thanh toán hóa đơn #{$invoice->id}",
            "returnUrl" => env('PAYOS_RETURN_URL'),
            "cancelUrl" => env('PAYOS_CANCEL_URL'),
            "expiredAt" => time() + 300, // Link thanh toán hết hạn sau 5 phút
        ];

        try {


            $paymentLink = $this->payOS->createPaymentLink($paymentData);

            $payment->update(['transaction_code' => $orderCode]);

            return response()->json([
                'success' => true,
                'checkoutUrl' => $paymentLink['checkoutUrl'] ?? null
            ]);
        } catch (\Exception $e) {
            \Log::error('💥 Lỗi PayOS: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }


    public function webhook(Request $request)
    {
        \Log::info('Webhook data', [
            'data' => $request->all(),
            'headers' => $request->headers->all()
        ]);

        $checksum_key = env('PAYOS_CHECKSUM_KEY');
        $webhookData = json_decode($request->getContent(), true);

        try {
            $transaction = $webhookData['data'] ?? [];
            ksort($transaction);
            $transaction_str_arr = [];

            foreach ($transaction as $key => $value) {
                if (in_array($value, ["undefined", "null"]) || gettype($value) == "NULL") {
                    $value = "";
                }

                if (is_array($value)) {
                    $valueSortedElementObj = array_map(function ($ele) {
                        ksort($ele);
                        return $ele;
                    }, $value);
                    $value = json_encode($valueSortedElementObj, JSON_UNESCAPED_UNICODE);
                }
                $transaction_str_arr[] = $key . "=" . $value;
            }

            $transaction_str = implode("&", $transaction_str_arr);
            $signature = hash_hmac("sha256", $transaction_str, $checksum_key);
            $expectedSignature = $webhookData['signature'] ?? '';

            if ($signature !== $expectedSignature) {
                return response()->json(['success' => true], 200);
            }

            $payload = $webhookData['data'];
            $orderCode = $payload['orderCode'] ?? null;
            $status = $payload['status'] ?? 'success';

            if (!$orderCode) {
                return response()->json(['success' => true], 200);
            }

            $payment = Payment::where('transaction_code', $orderCode)->first();
            if (!$payment) {
                return response()->json(['success' => true], 200);
            }

            $payment->update(['status' => $status]);

            $this->processPaymentSuccess($payment, $payload['amount'] ?? 0);

            return response()->json(['success' => true], 200);
        } catch (\Throwable $e) {
            \Log::error($e->getMessage());
            return response()->json(['success' => true], 200);
        }
    }

    private function processPaymentSuccess($payment, $webhookAmount)
    {
        try {
            $appointment = $payment->appointment;

            if ($appointment) {
                $appointment->update(['status' => 'pending']);

                $invoice = Invoice::where('appointment_id', $appointment->id)
                    ->orderBy('id', 'desc')
                    ->first();

                if ($invoice) {
                    $invoice->update(['status' => 'paid']);

                    try {
                        $appointment->load(['patient.user', 'doctor.user', 'service']);

                        if (!$appointment->patient || !$appointment->patient->user) {
                            return;
                        }

                        if (!$appointment->doctor || !$appointment->doctor->user) {
                            return;
                        }

                        $doctorName = $appointment->doctor->user->name;
                        $patientName = $appointment->patient->user->name;
                        $patientEmail = $appointment->patient->user->email;
                        $serviceName = $appointment->service->name ?? 'Dịch vụ khám bệnh';
                        $originalAmount = $appointment->service->price ?? 0;
                        $paidAmount = $webhookAmount > 0 ? $webhookAmount : $originalAmount;
                        $paymentType = $payment->method ?? 'PayOS';

                        if (!$patientEmail || !filter_var($patientEmail, FILTER_VALIDATE_EMAIL)) {
                            return;
                        }

                        Mail::to($patientEmail)->send(new PaymentInvoiceMail(
                            $doctorName,
                            $patientName,
                            $serviceName,
                            (float)$originalAmount,
                            (float)$paidAmount,
                            $paymentType
                        ));
                    } catch (\Throwable $e) {
                        \Log::error($e->getMessage());
                    }
                }
            }
        } catch (\Throwable $e) {
            \Log::error($e->getMessage());
        }
    }
}
