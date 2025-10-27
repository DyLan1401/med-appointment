<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Appointment;
use Illuminate\Support\Facades\Auth;

class PatientHistoryController extends Controller
{
    public function index(Request $request)
    {
        // Nếu bạn đang dùng Sanctum để xác thực:
        $patient = Auth::user()->patient ?? null;

        if (!$patient) {
            return response()->json(['message' => 'Không tìm thấy thông tin bệnh nhân'], 404);
        }

        $appointments = Appointment::with([
            'doctor.user',
            'doctor.specialization',
            'service',
            'feedback'
        ])
        ->where('patient_id', $patient->id)
        ->orderByDesc('appointment_date')
        ->get()
        ->map(function ($item) {
            return [
                'id' => $item->id,
                'date' => optional($item->appointment_date)->format('d/m/Y'),
                'doctor' => $item->doctor->user->name ?? 'Không rõ',
                'department' => $item->doctor->specialization->name ?? 'Không rõ',
                'service' => $item->service->name ?? 'Không rõ',
                'rating' => $item->feedback->rating ?? 0,
                'comment' => $item->feedback->comment ?? '',
            ];
        });

        return response()->json($appointments);
    }
}
