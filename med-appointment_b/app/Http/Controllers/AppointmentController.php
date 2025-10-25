<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Barryvdh\DomPDF\Facade\Pdf;

class AppointmentController extends Controller
{
    public function index()
    {
        return response()->json(['data' => Appointment::getAll()], 200);
    }

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

        $id = Appointment::createAppointment($request->all());
        return response()->json(['message' => 'Tạo cuộc hẹn thành công', 'id' => $id], 201);
    }

    public function show($id)
    {
        $appointment = Appointment::getById($id);
        if (!$appointment) return response()->json(['message' => 'Không tìm thấy cuộc hẹn'], 404);
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
            'updated_at' => 'required|date',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $result = Appointment::updateAppointment($id, $request->all());

        return match ($result['error'] ?? null) {
            'not_found' => response()->json(['message' => 'Không tìm thấy cuộc hẹn'], 404),
            'conflict' => response()->json(['message' => 'Cuộc hẹn đã được cập nhật, vui lòng tải lại.'], 409),
            'no_changes' => response()->json(['message' => 'Không có gì để cập nhật'], 400),
            default => response()->json(['message' => 'Cập nhật thành công'], 200),
        };
}



    public function destroy($id)
    {
        $deleted = Appointment::deleteAppointment($id);
        if (!$deleted) return response()->json(['message' => 'Không tìm thấy cuộc hẹn để xóa'], 404);
        return response()->json(['message' => 'Đã xóa cuộc hẹn thành công'], 200);
    }

    public function exportCompletedAppointmentsXlsx()
    {
        $file = Appointment::exportCompletedToXlsx();
        return response()->download($file)->deleteFileAfterSend(true);
    }

    public function exportCompletedAppointmentsPdf()
    {
        $data = Appointment::getCompleted();
        $pdf = Pdf::loadView('pdf.completed_appointments', ['data' => $data])
            ->setPaper('a4', 'portrait');
        return $pdf->download('completed_appointments.pdf');
    }
}
