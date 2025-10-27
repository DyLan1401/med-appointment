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
<<<<<<< HEAD
        $file = Appointment::exportCompletedToXlsx();
        return response()->download($file)->deleteFileAfterSend(true);
=======
         $data = DB::table('appointments')
            ->join('patients', 'appointments.patient_id', '=', 'patients.id')
            ->join('users as patient_user', 'patients.user_id', '=', 'patient_user.id')
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
            ->where('appointments.status', '=', 'completed')
            ->orderBy('appointments.appointment_date', 'desc')
            ->get();

        // Tạo writer
        $filePath = storage_path('app/public/completed_appointments.xlsx');
        $writer = SimpleExcelWriter::create($filePath);

        // Dòng tiêu đề
        $writer->addRow(['DANH SÁCH LỊCH HẸN ĐÃ HOÀN THÀNH']);
        $writer->addRow([]); // dòng trống

        // Tiêu đề cột
        $writer->addRow([
            'ID',
            'Bệnh nhân',
            'Dịch vụ',
            'Trạng thái',
            'Ghi chú',
            'Ngày hẹn',
            'Cập nhật lúc'
        ]);

        // Dữ liệu
        foreach ($data as $item) {
            $writer->addRow([
                $item->id,
                $item->patient_name,
                $item->service_name,
                ucfirst($item->status),
                $item->notes,
                $item->appointment_date,
                $item->updated_at,
            ]);
        }

        $writer->close();

        return response()->download($filePath)->deleteFileAfterSend(true);
>>>>>>> DangThanhPhong/9,10-Viet&XemFeedback,BinhLuanTuBenhNhan
    }

    public function exportCompletedAppointmentsPdf()
    {
        $data = Appointment::getCompleted();
        $pdf = Pdf::loadView('pdf.completed_appointments', ['data' => $data])
            ->setPaper('a4', 'portrait');
        return $pdf->download('completed_appointments.pdf');
    }
}
