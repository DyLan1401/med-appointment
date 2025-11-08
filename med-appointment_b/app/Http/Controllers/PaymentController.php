<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use Illuminate\Http\Request;
use App\Models\Invoice;
use PayOS\PayOS;

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
        $webhookData = json_decode($request->getContent(), true); // ✅ fix lỗi ở đây

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

            \Log::info('🔍 Signature debug', [
                'received' => $signature,
                'expected' => $expectedSignature,
            ]);

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

            // Cập nhật trạng thái appointment và invoice
            try {
                // Lấy appointment từ payment
                $appointment = $payment->appointment;

                if ($appointment) {
                    // Cập nhật trạng thái appointment thành 'pending'
                    $appointment->update(['status' => 'pending']);
                    \Log::info('✅ Cập nhật trạng thái appointment thành công', [
                        'appointment_id' => $appointment->id,
                        'status' => 'pending'
                    ]);

                    // Lấy invoice duy nhất từ appointment và cập nhật thành 'paid'
                    $invoice = Invoice::where('appointment_id', $appointment->id)
                        ->orderBy('id', 'desc')
                        ->first();

                    if ($invoice) {
                        $invoice->update(['status' => 'paid']);
                        \Log::info('✅ Cập nhật trạng thái invoice thành công', [
                            'invoice_id' => $invoice->id,
                            'status' => 'paid'
                        ]);
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
}
