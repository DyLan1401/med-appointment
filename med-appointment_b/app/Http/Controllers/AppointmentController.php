<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Mail\AppointmentStatusMail;
use App\Models\Patient;
use Illuminate\Support\Facades\Mail;

use Illuminate\Support\Facades\Auth;

use App\Models\Feedback;

class AppointmentController extends Controller
{
    public function index()
    {
        return response()->json(['data' => Appointment::getAll()], 200);
    }



    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'doctor_id' => 'required|exists:doctors,id',
            'service_id' => 'required|exists:services,id',
            'appointment_date' => 'required|date',
            'status' => 'in:pending,confirmed,rejected,cancelled,completed,hidden',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // ✅ Tìm patient theo user_id
        $patient = Patient::where('user_id', $request->user_id)->first();

        if (!$patient) {
            return response()->json([
                'error' => 'Không tìm thấy bệnh nhân tương ứng với user_id này.'
            ], 404);
        }

        // ✅ Gán patient_id
        $data = $request->all();
        $data['patient_id'] = $patient->id;
        unset($data['user_id']);

        $id = \App\Models\Appointment::createAppointment($data);

        return response()->json([
            'message' => 'Tạo cuộc hẹn thành công',
            'id' => $id,
            'patient_id' => $patient->id
        ], 201);
    }


    public function show($id)
    {
        $appointment = Appointment::getById($id);
        if (!$appointment) return response()->json(['message' => 'Không tìm thấy cuộc hẹn'], 404);
        return response()->json(['data' => $appointment], 200);
    }

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
    public function SendMailWhenConfirmedSchedule(Request $request, $id)
{
    $validator = Validator::make($request->all(), [
        'status' => 'sometimes|in:pending,confirmed,rejected,cancelled,completed',
        'updated_at' => 'required|date',
    ]);

    if ($validator->fails()) {
        return response()->json(['errors' => $validator->errors()], 422);
    }

    $appointment = Appointment::find($id);
    if (!$appointment) {
        return response()->json(['message' => 'Không tìm thấy cuộc hẹn'], 404);
    }

    $appointment->update($request->all());

    // 🔹 Nếu status là confirmed hoặc rejected => gửi email
    if (in_array($appointment->status, ['confirmed', 'rejected'])) {
        $patient = \App\Models\Patient::find($appointment->patient_id);
        if ($patient && $patient->email) {
            Mail::to($patient->email)->send(new AppointmentStatusMail($appointment, $appointment->status));
        }
    }

    return response()->json(['message' => 'Cập nhật thành công và đã gửi mail thông báo'], 200);
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

    public function dashboard()
    {
        try {
            return response()->json([
                'status' => true,
                'data' => [
                    'total_patients' => Patient::getTotalCount(),
                    'pending_appointments' => Appointment::getPendingCount(),
                    'confirmed_appointments' => Appointment::getConfirmedCount(),
                    'feedbacks' => Feedback::getRecentFeedbacks(5),
                    'recent_appointments' => Appointment::getRecentAppointments(5),
                ]
            ], 200);
        } catch (\Throwable $e) {
            // Trả lỗi có msg
            return response()->json([
                'status' => false,
                'msg' => 'Đã xảy ra lỗi khi tải dữ liệu dashboard.',
                'error' => $e->getMessage(), // Có thể ẩn dòng này nếu bạn không muốn hiển thị lỗi chi tiết
            ], 500);
        }
    }

    public function shownew($id)
    {
        try {
            // Dùng eager loading để load các quan hệ liên quan
            $appointment = Appointment::with(['patient', 'doctor', 'service'])
                ->findOrFail($id);

            return response()->json([
                'status' => true,
                'data' => [
                    'id' => $appointment->id,
                    'date' => $appointment->date,
                    'time' => $appointment->time,
                    'status' => $appointment->status,
                    'patient' => [
                        'id' => $appointment->patient->id,
                        'name' => $appointment->patient->user->name
                    ],
                    'doctor' => [
                        'id' => $appointment->doctor->id,
                        'name' => $appointment->doctor->user->name
                    ],
                    'service' => [
                        'id' => $appointment->service->id,
                        'name' => $appointment->service->name,
                        'price' => $appointment->service->price,
                    ],
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy cuộc hẹn!',
                'error' => $e->getMessage(),
            ], 404);
        }
    }

    public function countCompleted()
    {
        $count = Appointment::where('status', 'completed')->count();

        return response()->json([
            'count' => $count
        ]);
    }

    public function completedDailySummary(Request $request)
    {
        // lấy ngày từ query params
        $from = $request->query('from'); // YYYY-MM-DD
        $to   = $request->query('to');   // YYYY-MM-DD

        // nếu FE không gửi → auto lấy 7 ngày gần nhất
        if (!$from || !$to) {
            $from = now()->subDays(6)->format('Y-m-d');
            $to   = now()->format('Y-m-d');
        }

        $result = Appointment::where('status', 'completed')
            ->whereDate('appointment_date', '>=', $from)
            ->whereDate('appointment_date', '<=', $to)
            ->selectRaw('DATE(appointment_date) as day, COUNT(*) as count')
            ->groupBy('day')
            ->orderBy('day')
            ->get();

        return response()->json($result);
    }

      public function rebook(Request $request, $appointmentId)
{\Log::info('Auth user:', [Auth::user()]);

    $patient = Auth::user()->patient ?? null;
    if (!$patient) {
        return response()->json(['message' => 'Không tìm thấy bệnh nhân'], 404);
    }

    $old = Appointment::where('id', $appointmentId)
        ->where('patient_id', $patient->id)
        // ->where('status', 'completed')
        ->first();

    if (!$old) {
        return response()->json(['message' => 'Không tìm thấy lịch đã hoàn thành để tái khám'], 404);
    }

    $validated = $request->validate([
        'appointment_date' => 'required|date|after:today',
        'notes' => 'nullable|string|max:500',
    ]);

    $new = Appointment::create([
        'patient_id' => $patient->id,
        'doctor_id' => $old->doctor_id,
        'service_id' => $old->service_id,
        'appointment_date' => $validated['appointment_date'],
        'notes' => $validated['notes'] ?? null,
        'status' => 'pending',
    ]);

    return response()->json([
        'message' => '✅ Đặt lịch tái khám thành công!',
        'appointment' => $new,
    ]);
}

}
