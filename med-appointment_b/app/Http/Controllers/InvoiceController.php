<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use Illuminate\Http\Request;
use App\Models\Appointment;
use Illuminate\Validation\ValidationException;
use Exception;
use App\Models\Payment;
use Illuminate\Support\Facades\DB;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Mail\ThankYouMail;
use Illuminate\Support\Facades\Mail;

class InvoiceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {  try {
        $invoices = Invoice::select(
                'invoices.*',
                'patient_users.name as patient_name',
                'doctor_users.name as doctor_name'
            )
            ->join('patients', 'invoices.patient_id', '=', 'patients.id')
            ->join('users as patient_users', 'patients.user_id', '=', 'patient_users.id')
            ->join('doctors', 'invoices.doctor_id', '=', 'doctors.id')
            ->join('users as doctor_users', 'doctors.user_id', '=', 'doctor_users.id')
            ->orderByDesc('invoices.created_at')
            ->paginate(10);

        return response()->json([
            'status' => true,
            'msg' => 'Lấy danh sách hóa đơn thành công',
            'data' => $invoices,
        ], 200);

    } catch (\Exception $e) {
        return response()->json([
            'status' => false,
            'msg' => 'Đã xảy ra lỗi khi lấy danh sách hóa đơn',
            'error' => $e->getMessage(),
        ], 500);
    }
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
        try {
            // ✅ Kiểm tra dữ liệu đầu vào
            $validated = $request->validate([
                'appointment_id' => 'required|integer|exists:appointments,id',
                'patient_id'     => 'required|integer|exists:patients,id',
                'doctor_id'      => 'required|integer|exists:doctors,id',
                'amount'         => 'required|numeric|min:0',
                'type'           => 'required|in:deposit,pay',
            ]);

            // ✅ Kiểm tra trạng thái appointment
            $appointment = Appointment::find($validated['appointment_id']);
            if ($appointment->status !== 'hidden') {
                return response()->json([
                    'status' => false,
                    'msg' => 'Chỉ có thể tạo hóa đơn khi lịch hẹn chưa thanh toán.',
                ], 400);
            }

            // ✅ Tạo hóa đơn mới
            $invoice = Invoice::create([
                'appointment_id' => $validated['appointment_id'],
                'patient_id'     => $validated['patient_id'],
                'doctor_id'      => $validated['doctor_id'],
                'amount'         => $validated['amount'],
                'type'           => $validated['type'],
                'status'         => 'unpaid',
            ]);

            return response()->json([
                'status' => true,
                'msg' => 'Hóa đơn tạo thành công',
                'data' => [
                    'invoice' => $invoice,
                ]
            ], 201);
        } catch (ValidationException $e) {
            // ❌ Bắt lỗi validate
            return response()->json([
                'status' => false,
                'msg' => 'Dữ liệu không hợp lệ',
                'errors' => $e->errors(),
            ], 422);
        } catch (Exception $e) {
            // ❌ Bắt lỗi hệ thống (DB, logic, v.v.)
            return response()->json([
                'status' => false,
                'msg' => 'Đã xảy ra lỗi khi tạo hóa đơn',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Invoice $invoice)
    {
        try {
            // ✅ Load thêm các quan hệ liên quan (nếu có)
            $invoice->load(['appointment', 'patient', 'doctor']);

            return response()->json([
                'status' => true,
                'msg' => 'Lấy thông tin hóa đơn thành công',
                'data' => $invoice,
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'status' => false,
                'msg' => 'Đã xảy ra lỗi khi lấy thông tin hóa đơn',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Invoice $invoice)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Invoice $invoice)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Invoice $invoice)
    {
        //
    }

     public function cancelInvoice(Request $request)
    {
        try {
            $orderCode = $request->input('order_code');
            
            if (!$orderCode) {
                return response()->json([
                    'success' => false,
                    'message' => 'Thiếu order_code parameter'
                ], 400);
            }

            $payment = Payment::where('transaction_code', $orderCode)->first();

            if (!$payment) {
                return response()->json([
                    'success' => false,
                    'message' => 'Không tìm thấy payment với order code: ' . $orderCode
                ], 404);
            }

            if (!$payment->appointment_id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Payment không có appointment_id'
                ], 400);
            }

            // Lấy invoice có ID cao nhất (mới nhất)
            $latestInvoice = DB::table('invoices')
                ->where('appointment_id', $payment->appointment_id)
                ->orderBy('id', 'desc')
                ->first();

            if (!$latestInvoice) {
                return response()->json([
                    'success' => false,
                    'message' => 'Không tìm thấy invoice cho appointment'
                ], 404);
            }

            // Cập nhật invoice có ID cao nhất
            DB::table('invoices')
                ->where('id', $latestInvoice->id)
                ->update(['status' => 'canceled']);

            return response()->json([
                'success' => true,
                'message' => 'Đã hủy invoice mới nhất thành công',
                'data' => [
                    'payment_id' => $payment->id,
                    'appointment_id' => $payment->appointment_id,
                    'invoice_id' => $latestInvoice->id,
                    'order_code' => $orderCode
                ]
            ], 200);

        } catch (\Throwable $e) {
            \Log::error('Lỗi cancelInvoice: ' . $e->getMessage(), [
                'order_code' => $orderCode ?? 'unknown',
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Lỗi hệ thống: ' . $e->getMessage()
            ], 500);
        }
    }



public function download($id)
{
    $invoice = Invoice::with([
        'appointment.doctor',
        'appointment.patient',
        'appointment.service'
    ])->findOrFail($id);

    if ($invoice->status !== 'paid') {
        return response()->json(['message' => 'Hóa đơn chưa được thanh toán!'], 403);
    }
\Log::info('🧾 Invoice debug', [
    'invoice' => $invoice->toArray(),
]);
    $pdf = Pdf::loadView('pdf.invoice', compact('invoice'));
    return $pdf->download("invoice_{$invoice->id}.pdf");
}



public function updateStatus(Request $request, $id)
{
    $invoice = Invoice::with('appointment.patient.user', 'appointment.doctor.user', 'appointment.service')->findOrFail($id);

    $invoice->status = $request->status;
    $invoice->save();

    // ✅ Khi chuyển sang paid thì gửi mail cảm ơn
    if ($invoice->status === 'paid') {
        Mail::to($invoice->appointment->patient->user->email)->send(new ThankYouMail($invoice));
    }

    return response()->json(['message' => 'Cập nhật trạng thái thành công', 'invoice' => $invoice]);
}

}
