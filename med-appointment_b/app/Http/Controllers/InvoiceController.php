<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use Illuminate\Http\Request;

class InvoiceController extends Controller
{
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
          try {
            // ✅ Kiểm tra dữ liệu đầu vào
            $validated = $request->validate([
                'appointment_id' => 'required|integer|exists:appointments,id',
                'patient_id'     => 'required|integer|exists:patients,id',
                'doctor_id'      => 'required|integer|exists:doctors,id',
                'amount'         => 'required|numeric|min:0',
                'type'           => 'required|in:deposit,pay',
            ]);

            // ✅ Tạo hóa đơn mới
            $invoice = Invoice::create([
                'appointment_id' => $validated['appointment_id'],
                'patient_id'     => $validated['patient_id'],
                'doctor_id'      => $validated['doctor_id'],
                'amount'         => $validated['amount'],
                'type'           => $validated['type'],
                'status'         => 'unpaid',
            ]);

            // (Tùy chọn) Tạo link thanh toán PayOS ở đây
            // $checkoutUrl = PayOSService::createLink($invoice);

            return response()->json([
                'status' => true,
                'msg' => 'Hóa đơn tạo thành công',
                'data' => [
                    'invoice' => $invoice,
                    // 'checkoutUrl' => $checkoutUrl ?? null
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
        //
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
}
