<?php

namespace App\Http\Controllers;

use App\Models\Schedule;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ScheduleController extends Controller
{
    /**
     * Quy tắc validate dữ liệu Schedule
     */
    protected function getValidationRules(): array
    {
        return [
            'doctor_id' => 'required|exists:doctors,id',
            'date' => 'required|date|after_or_equal:' . Carbon::yesterday()->toDateString(),
            'start_time' => 'required|date_format:H:i:s',
            'end_time' => 'required|date_format:H:i:s|after:start_time',
            'status' => ['nullable', Rule::in(['available', 'unavailable'])],
        ];
    }

public function index()
{
    $data = DB::table('appointments')
        // Join patients để lấy bệnh nhân
        ->join('patients', 'appointments.patient_id', '=', 'patients.id')
        // Join users để lấy tên bệnh nhân
        ->join('users as patient_user', 'patients.user_id', '=', 'patient_user.id')
        // Join services để lấy tên dịch vụ
        ->join('services', 'appointments.service_id', '=', 'services.id')
        // Join schedules để lấy ngày giờ khám
        ->leftJoin('schedules', 'appointments.schedule_id', '=', 'schedules.id')
        ->select(
            'appointments.id',
            'patient_user.name as patient_name',
            'services.name as service_name',
            'schedules.date',
            'schedules.start_time',
            'appointments.status',
            'appointments.notes'
        )
        ->orderBy('appointments.id', 'desc')
        ->get();

    return response()->json(['data' => $data], 200);
}


    /**
     * Hiển thị chi tiết một lịch làm việc (theo ID)
     * (GET /api/schedules/{id})
     */
    public function show($id)
    {
        $data = DB::table('schedules')
            ->join('doctors', 'schedules.doctor_id', '=', 'doctors.id')
            ->join('users as doctor_user', 'doctors.user_id', '=', 'doctor_user.id')
            ->leftJoin('appointments', 'appointments.doctor_id', '=', 'doctors.id')
            ->leftJoin('services', 'appointments.service_id', '=', 'services.id')
            ->select(
                'schedules.id',
                'schedules.date',
                'schedules.start_time',
                'schedules.end_time',
                'schedules.status',
                'doctor_user.name as doctor_name',
                DB::raw('GROUP_CONCAT(DISTINCT services.name) as service_names')
            )
            ->where('schedules.id', $id)
            ->groupBy(
                'schedules.id',
                'schedules.date',
                'schedules.start_time',
                'schedules.end_time',
                'schedules.status',
                'doctor_user.name'
            )
            ->first();

        if (!$data) {
            return response()->json(['message' => 'Không tìm thấy lịch làm việc'], 404);
        }

        $services = $data->service_names ? explode(',', $data->service_names) : [];

        return response()->json([
            'data' => [
                'id' => $data->id,
                'date' => $data->date,
                'start_time' => $data->start_time,
                'end_time' => $data->end_time,
                'status' => $data->status,
                'doctor_name' => $data->doctor_name,
                'services' => $services,
            ],
        ], 200);
    }

    /**
     * Cập nhật lịch làm việc.
     * (PUT /api/schedules/{id})
     */
    public function update(Request $request, Schedule $schedule)
    {
        $validator = Validator::make($request->all(), $this->getValidationRules());

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation Error.',
                'errors' => $validator->errors(),
            ], 422);
        }

        $schedule->update($request->all());

        return response()->json([
            'message' => 'Lịch làm việc đã được cập nhật thành công.',
            'data' => $schedule,
        ], 200);
    }

    /**
     * Xóa lịch làm việc.
     * (DELETE /api/schedules/{id})
     */
    public function destroy(Schedule $schedule)
    {
        $schedule->delete();

        return response()->json(null, 204);
    }
}
