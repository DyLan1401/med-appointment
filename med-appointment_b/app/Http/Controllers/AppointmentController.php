<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class AppointmentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $data = DB::table('appointments')
        // Join để lấy thông tin bệnh nhân
        ->join('patients', 'appointments.patient_id', '=', 'patients.id')
        ->join('users as patient_user', 'patients.user_id', '=', 'patient_user.id')
        // Join để lấy thông tin dịch vụ
        ->join('services', 'appointments.service_id', '=', 'services.id')
        ->select(
            'appointments.id',
            'patient_user.name as patient_name',
            'services.name as service_name',
            'appointments.status',
            'appointments.notes',
            'appointments.appointment_date',
            'appointments.updated_at'
        )
        ->orderBy('appointments.id', 'desc')
        ->get();

    return response()->json(['data' => $data], 200);
    }

  
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'patient_id' => 'required|exists:patients,id',
            'doctor_id' => 'required|exists:doctors,id',
            'service_id' => 'required|exists:services,id',
            'appointment_date' => 'required|date',
            'status' => 'in:pending,confirmed,rejected,cancelled,completed',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $id = DB::table('appointments')->insertGetId([
            'patient_id' => $request->patient_id,
            'doctor_id' => $request->doctor_id,
            'service_id' => $request->service_id,
            'appointment_date' => $request->appointment_date,
            'status' => $request->status ?? 'pending',
            'notes' => $request->notes,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json(['message' => 'Tạo cuộc hẹn thành công', 'id' => $id], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
         $appointment = DB::table('appointments')
            ->join('patients', 'appointments.patient_id', '=', 'patients.id')
            ->join('users as patient_user', 'patients.user_id', '=', 'patient_user.id')
            ->join('services', 'appointments.service_id', '=', 'services.id')
            ->select(
                'appointments.id',
                'patient_user.name as patient_name',
                'services.name as service_name',
                'appointments.appointment_date',
                'appointments.status',
                'appointments.notes'
            )
            ->where('appointments.id', $id)
            ->first();

        if (!$appointment) {
            return response()->json(['message' => 'Không tìm thấy cuộc hẹn'], 404);
        }

        return response()->json(['data' => $appointment], 200);
    }

    // Cập nhật thông tin cuộc hẹn
   public function update(Request $request, $id)
{
    $validator = Validator::make($request->all(), [
        'patient_id' => 'sometimes|exists:patients,id',
        'doctor_id' => 'sometimes|exists:doctors,id',
        'service_id' => 'sometimes|exists:services,id',
        'appointment_date' => 'sometimes|date',
        'status' => 'sometimes|in:pending,confirmed,rejected,cancelled,completed',
        'notes' => 'nullable|string',
        'updated_at' => 'required|date', // 👈 bắt buộc client gửi updated_at
    ]);

    if ($validator->fails()) {
        return response()->json([
            'message' => 'Dữ liệu không hợp lệ',
            'errors' => $validator->errors()
        ], 422);
    }

    // Lấy bản ghi appointment theo id
    $appointment = DB::table('appointments')->where('id', $id)->first();

    if (!$appointment) {
        return response()->json(['message' => 'Không tìm thấy cuộc hẹn'], 404);
    }

      // So sánh updated_at giữa client và database
    if ($appointment->updated_at != $request->input('updated_at')) {
        return response()->json([
            'message' => 'Cuộc hẹn đã được cập nhật, vui lòng tải lại trang để tiếp tục.'
        ], 409);
    }

    // Nếu giống → cập nhật với updated_at mới
    $affected = DB::table('appointments')
        ->where('id', $id)
        ->update(array_merge(
            $request->only(['patient_id', 'doctor_id', 'service_id', 'appointment_date', 'status', 'notes']),
            ['updated_at' => now()]
        ));

    if (!$affected) {
        return response()->json(['message' => 'Không tìm thấy hoặc không có gì để cập nhật'], 404);
    }

    return response()->json(['message' => 'Cập nhật cuộc hẹn thành công'], 200);
}

    // Xóa cuộc hẹn
    public function destroy($id)
    {
        $deleted = DB::table('appointments')->where('id', $id)->delete();

        if (!$deleted) {
            return response()->json(['message' => 'Không tìm thấy cuộc hẹn để xóa'], 404);
        }

        return response()->json(['message' => 'Đã xóa cuộc hẹn thành công'], 200);
    }
}
