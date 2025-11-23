<?php

namespace App\Http\Controllers;

use App\Models\Schedule;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Exception;

class ScheduleController extends Controller
{
    protected function getValidationRules(): array
    {
        return [
            'doctor_id' => ['required', 'integer', 'exists:doctors,id'],
            'date' => ['required', 'date'],
            'start_time' => ['required', 'date_format:H:i'],
            'end_time' => ['required', 'date_format:H:i', 'after:start_time'],
            'status' => ['nullable', Rule::in(['available', 'unavailable'])],
        ];
    }

    public function index()
    {
        $schedules = Schedule::with('doctor')->orderBy('date', 'asc')->get();

        return response()->json([
            'status' => true,
            'msg' => 'Lấy danh sách lịch làm việc thành công!',
            'data' => $schedules
        ]);
    }

    public function show($id)
    {
        $schedule = Schedule::with('doctor')->find($id);

        if (!$schedule) {
            return response()->json([
                'status' => false,
                'msg' => 'Không tìm thấy lịch làm việc này!'
            ], 404);
        }

        return response()->json([
            'status' => true,
            'msg' => 'Lấy thông tin lịch làm việc thành công!',
            'data' => $schedule
        ]);
    }

    public function store(Request $request)
    {
            \Log::info($request->all()); // xem dữ liệu React gửi

        $validator = Validator::make($request->all(), $this->getValidationRules());

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'msg' => 'Dữ liệu không hợp lệ!',
                'errors' => $validator->errors()
            ], 422);
        }

        // ❗ Kiểm tra trùng lịch
        $exist = Schedule::where('doctor_id', $request->doctor_id)
            ->where('date', $request->date)
            ->where(function ($q) use ($request) {
                $q->whereBetween('start_time', [$request->start_time, $request->end_time])
                  ->orWhereBetween('end_time', [$request->start_time, $request->end_time]);
            })
            ->exists();

        if ($exist) {
            return response()->json([
                'status' => false,
                'msg' => 'Lịch làm việc bị trùng!'
            ], 409);
        }

        try {
            $schedule = Schedule::create([
                'doctor_id' => $request->doctor_id,
                'date' => $request->date,
                'start_time' => $request->start_time,
                'end_time' => $request->end_time,
                'status' => $request->status ?? 'available',
            ]);

            return response()->json([
                'status' => true,
                'msg' => 'Thêm lịch làm việc thành công!',
                'data' => $schedule
            ], 201);

        } catch (Exception $e) {
            return response()->json([
                'status' => false,
                'msg' => 'Không thể thêm lịch làm việc!',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $schedule = Schedule::find($id);

        if (!$schedule) {
            return response()->json([
                'status' => false,
                'msg' => 'Không tìm thấy lịch làm việc!'
            ], 404);
        }

        $validator = Validator::make($request->all(), $this->getValidationRules());

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'msg' => 'Dữ liệu cập nhật không hợp lệ!',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $schedule->update([
                'doctor_id' => $request->doctor_id,
                'date' => $request->date,
                'start_time' => $request->start_time,
                'end_time' => $request->end_time,
                'status' => $request->status ?? 'available',
            ]);

            return response()->json([
                'status' => true,
                'msg' => 'Cập nhật lịch làm việc thành công!',
                'data' => $schedule
            ]);

        } catch (Exception $e) {
            return response()->json([
                'status' => false,
                'msg' => 'Không thể cập nhật lịch làm việc!',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        $schedule = Schedule::find($id);

        if (!$schedule) {
            return response()->json([
                'status' => false,
                'msg' => 'Không tìm thấy lịch làm việc!'
            ], 404);
        }

        try {
            $schedule->delete();

            return response()->json([
                'status' => true,
                'msg' => 'Xóa lịch làm việc thành công!'
            ]);

        } catch (Exception $e) {
            return response()->json([
                'status' => false,
                'msg' => 'Không thể xóa lịch làm việc!',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getScheduleById($doctor_id)
    {
        try {
            $schedules = Schedule::with('doctor')
                ->where('doctor_id', $doctor_id)
                ->orderBy('date', 'asc')
                ->get();

            return response()->json([
                'status' => true,
                'msg' => 'Lấy lịch làm việc thành công!',
                'data' => $schedules
            ]);

        } catch (Exception $e) {
            return response()->json([
                'status' => false,
                'msg' => 'Đã xảy ra lỗi khi truy vấn dữ liệu!',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
