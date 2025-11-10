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
        \Log::info('🟢 Bắt đầu createPayment');
        \Log::info('🔧 ENV PAYOS CONFIG', [
            'PAYOS_CLIENT_ID' => env('PAYOS_CLIENT_ID'),
            'PAYOS_API_KEY' => env('PAYOS_API_KEY'),
            'PAYOS_CHECKSUM_KEY' => env('PAYOS_CHECKSUM_KEY'),
            'RETURN_URL' => env('PAYOS_RETURN_URL'),
            'CANCEL_URL' => env('PAYOS_CANCEL_URL'),
        ]);
        $request->validate([
            'invoice_id' => 'required|exists:invoices,id',
        ]);

        $invoice = Invoice::find($request->invoice_id);

        \Log::info('✅ Tìm thấy invoice', ['invoice_id' => $invoice->id]);

        // ✅ Lấy appointment_id từ invoice (nếu có)
        $appointmentId = $invoice->appointment_id ?? 1; // 👈 hoặc null nếu DB cho phép null
        \Log::info('✅ Tìm thấy invoice', ['invoice_id' => $invoice->id, 'appointment_id' => $appointmentId]);
        // ✅ Tạo bản ghi payment có appointment_id
        $payment = Payment::create([
            'appointment_id' => $appointmentId,
            'amount' => $invoice->amount,
            'method' => 'payos',
            'status' => 'pending',
        ]);

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
            \Log::info('🧭 Dữ liệu gửi lên PayOS', $paymentData);
            // Ghi lại toàn bộ dữ liệu PayOS trả về
            \Log::info('🔗 Phản hồi PayOS (raw)');

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
    \Log::info('📩 Nhận webhook từ PayOS', [
        'data' => $request->all(),
        'headers' => $request->headers->all()
    ]);

    $checksum_key = env('PAYOS_CHECKSUM_KEY');
    $webhookData = json_decode($request->getContent(), true);

    \Log::info('🔍 Webhook data decoded', ['data' => $webhookData]);

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
        \Log::info($transaction_str);

        $signature = hash_hmac("sha256", $transaction_str, $checksum_key);
        $expectedSignature = $webhookData['signature'] ?? '';

        if ($signature !== $expectedSignature) {
            \Log::warning('⚠️ Signature không hợp lệ', [
                'received' => $signature,
                'expected' => $expectedSignature
            ]);
            return response()->json(['success' => true], 200);
        }

        $payload = $webhookData['data'];
        $orderCode = $payload['orderCode'] ?? null;
        $status = $payload['status'] ?? 'success';

        if (!$orderCode) {
            \Log::warning('⚠️ Thiếu orderCode', ['payload' => $payload]);
            return response()->json(['success' => true], 200);
        }

        $payment = Payment::where('transaction_code', $orderCode)->first();
        if (!$payment) {
            \Log::warning("⚠️ Không tìm thấy payment với orderCode {$orderCode}");
            return response()->json(['success' => true], 200);
        }

        $payment->update(['status' => $status]);
        \Log::info('✅ Cập nhật thanh toán thành công', [
            'orderCode' => $orderCode,
            'status' => $status
        ]);

        // Cập nhật appointment và invoice
        try {
            $appointment = $payment->appointment;

            if ($appointment) {
                $appointment->update(['status' => 'pending']);
                \Log::info('✅ Cập nhật trạng thái appointment thành công', [
                    'appointment_id' => $appointment->id,
                    'status' => 'pending'
                ]);

                $invoice = Invoice::where('appointment_id', $appointment->id)
                    ->orderBy('id', 'desc')
                    ->first();

                if ($invoice) {
                    $invoice->update(['status' => 'paid']);
                    \Log::info('✅ Cập nhật trạng thái invoice thành công', [
                        'invoice_id' => $invoice->id,
                        'status' => 'paid'
                    ]);

                    /**
                     * 🚀 GỬI EMAIL HÓA ĐƠN CHO BỆNH NHÂN - ĐÃ SỬA LỖI
                     */
                    try {
                        // Load relationships với kiểm tra null
                        $appointment->load(['patient.user', 'doctor.user', 'service']);
                        
                        // Kiểm tra các relationship tồn tại
                        if (!$appointment->patient || !$appointment->patient->user) {
                            \Log::warning('⚠️ Không tìm thấy thông tin bệnh nhân', [
                                'appointment_id' => $appointment->id
                            ]);
                            return response()->json(['success' => true], 200);
                        }

                        if (!$appointment->doctor || !$appointment->doctor->user) {
                            \Log::warning('⚠️ Không tìm thấy thông tin bác sĩ', [
                                'appointment_id' => $appointment->id
                            ]);
                            return response()->json(['success' => true], 200);
                        }

                        // Lấy thông tin từ relationships
                        $doctorName = $appointment->doctor->user->name;
                        $patientName = $appointment->patient->user->name;
                        $patientEmail = $appointment->patient->user->email;
                        $serviceName = $appointment->service->name ?? 'Dịch vụ khám bệnh';
                        $originalAmount = $appointment->service->price ?? 0;
                        $paidAmount = $payload['amount'] ?? $originalAmount;
                        $paymentType = $payment->method ?? 'PayOS';

                        \Log::info('📧 Thông tin gửi email từ webhook:', [
                            'appointment_id' => $appointment->id,
                            'patient_email' => $patientEmail,
                            'patient_name' => $patientName,
                            'doctor_name' => $doctorName,
                            'service_name' => $serviceName,
                            'amount' => $paidAmount
                        ]);

                        // Kiểm tra email hợp lệ
                        if (!$patientEmail || !filter_var($patientEmail, FILTER_VALIDATE_EMAIL)) {
                            \Log::warning('⚠️ Email bệnh nhân không hợp lệ', [
                                'patient_email' => $patientEmail,
                                'patient_id' => $appointment->patient->id
                            ]);
                            return response()->json(['success' => true], 200);
                        }

                        // Gửi email - SỬA LẠI DÒNG NÀY
                        Mail::to($patientEmail)->send(new PaymentInvoiceMail(
                            $doctorName,
                            $patientName,
                            $serviceName,
                            (float)$originalAmount,
                            (float)$paidAmount,
                            $paymentType
                        ));

                        \Log::info('✅ Đã gửi email hóa đơn cho bệnh nhân thành công', [
                            'email' => $patientEmail,
                            'appointment_id' => $appointment->id,
                            'patient_name' => $patientName
                        ]);

                    } catch (\Throwable $e) {
                        \Log::error('💥 Lỗi khi gửi email hóa đơn: ' . $e->getMessage(), [
                            'trace' => $e->getTraceAsString(),
                            'appointment_id' => $appointment->id
                        ]);
                    }
                } else {
                    \Log::warning('⚠️ Không tìm thấy invoice cho appointment', [
                        'appointment_id' => $appointment->id
                    ]);
                }
            } else {
                \Log::warning('⚠️ Không tìm thấy appointment từ payment', [
                    'payment_id' => $payment->id
                ]);
            }
        } catch (\Throwable $e) {
            \Log::error('💥 Lỗi khi cập nhật appointment và invoice: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);
        }

        return response()->json(['success' => true], 200);
    } catch (\Throwable $e) {
        \Log::error('💥 Lỗi webhook: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
        return response()->json(['success' => true], 200);
    }
}

    public function testPayOS()
    {
        \Log::info('🚀 Bắt đầu testPayOS (dùng SDK chính thức)');

        $payOS = new PayOS(
            env('PAYOS_CLIENT_ID'),
            env('PAYOS_API_KEY'),
            env('PAYOS_CHECKSUM_KEY')
        );

        try {
            $orderCode = time();
            $paymentData = [
                "orderCode" => $orderCode,
                "amount" => 10000,
                "description" => "Test kết nối PayOS",
                "returnUrl" => "https://google.com",
                "cancelUrl" => "https://google.com",
            ];

            \Log::info('🧭 Gửi dữ liệu testPayOS', $paymentData);

            // ✅ SDK sẽ tự tạo chữ ký đúng định dạng
            $paymentLink = $payOS->createPaymentLink($paymentData);

            \Log::info('✅ Phản hồi PayOS', ['response' => $paymentLink]);

            return response()->json([
                'success' => true,
                'checkoutUrl' => $paymentLink['checkoutUrl'] ?? null,
                'raw' => $paymentLink
            ]);
        } catch (\Exception $e) {
            \Log::error('💥 Lỗi testPayOS: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

  public function testSendInvoiceEmail($appointmentId = null)
{
    try {
        // SỬA LẠI PHẦN NÀY: Thêm ->first() để lấy model instance
        $appointment = Appointment::with([
            'patient.user', 
            'doctor.user', 
            'service'
        ])->when($appointmentId, function($query, $appointmentId) {
            return $query->where('id', $appointmentId);
        }, function($query) {
            return $query->first();
        })->first(); // ← THÊM DÒNG NÀY

        if (!$appointment) {
            return response()->json([
                'message' => '❌ Không tìm thấy appointment'
            ], 404);
        }

        \Log::info('🔍 Appointment data:', [
            'appointment_id' => $appointment->id,
            'has_patient' => !is_null($appointment->patient),
            'has_doctor' => !is_null($appointment->doctor),
            'has_service' => !is_null($appointment->service)
        ]);

        // Lấy thông tin từ relationship với kiểm tra null
        $doctorName = $appointment->doctor && $appointment->doctor->user 
            ? $appointment->doctor->user->name 
            : 'Không rõ';

        $patientName = $appointment->patient && $appointment->patient->user 
            ? $appointment->patient->user->name 
            : 'Không rõ';

        $patientEmail = $appointment->patient && $appointment->patient->user 
            ? $appointment->patient->user->email 
            : null;

        $serviceName = $appointment->service 
            ? $appointment->service->name 
            : 'Dịch vụ khám bệnh';

        $originalAmount = $appointment->service 
            ? $appointment->service->price 
            : 0;

        $paidAmount = $originalAmount;
        $paymentType = 'PayOS';

        // Kiểm tra email
        if (!$patientEmail) {
            return response()->json([
                'message' => '❌ Bệnh nhân không có email',
                'patient_info' => [
                    'id' => $appointment->patient->id ?? null,
                    'name' => $patientName,
                    'user_id' => $appointment->patient->user_id ?? null
                ]
            ], 400);
        }

        \Log::info('📧 Thông tin email:', [
            'patient_email' => $patientEmail,
            'patient_name' => $patientName,
            'doctor_name' => $doctorName,
            'service_name' => $serviceName,
            'amount' => $originalAmount
        ]);

        // Gửi email
        Mail::to($patientEmail)->send(new PaymentInvoiceMail(
            $doctorName,
            $patientName,
            $serviceName,
            (float)$originalAmount,
            (float)$paidAmount,
            $paymentType
        ));

        return response()->json([
            'message' => '✅ Đã gửi mail test hóa đơn thành công!',
            'appointment_id' => $appointment->id,
            'sent_to' => $patientEmail,
            'patient' => $patientName,
            'doctor' => $doctorName,
            'service' => $serviceName,
            'amount' => $originalAmount
        ]);

    } catch (\Throwable $e) {
        \Log::error('💥 Lỗi khi gửi mail test: ' . $e->getMessage(), [
            'trace' => $e->getTraceAsString()
        ]);
        return response()->json([
            'message' => '❌ Gửi mail thất bại',
            'error' => $e->getMessage(),
            'appointment_id' => $appointmentId ?? 'N/A'
        ], 500);
    }
}}
