<?php

namespace App\Http\Controllers;

use App\Models\Schedule;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Exception;
class ScheduleController extends Controller
{
    /**
     * Quy tắc validate dữ liệu Schedule
     */
    protected function getValidationRules(): array
    {
    }

public function index()
{
   
}


    /**
     * Hiển thị chi tiết một lịch làm việc (theo ID)
     * (GET /api/schedules/{id})
     */
    public function show($id)
    {
         
    }

    /**
     * Cập nhật lịch làm việc.
     * (PUT /api/schedules/{id})
     */
    public function update(Request $request, Schedule $schedule)
    {
        
    }

    /**
     * Xóa lịch làm việc.
     * (DELETE /api/schedules/{id})
     */
    public function destroy(Schedule $schedule)
    {
       
    }

    // 🧠 Lấy lịch làm việc theo doctor_id
    public function getScheduleById($doctor_id)
    {
        try {
            $schedules = Schedule::getByDoctorId($doctor_id);

            if ($schedules->isEmpty()) {
                return response()->json([
                    'status' => false,
                    'msg' => "Không tìm thấy lịch làm việc cho bác sĩ ID: {$doctor_id}",
                    'data' => []
                ], 404);
            }

            return response()->json([
                'status' => true,
                'msg' => 'Lấy lịch làm việc thành công!',
                'data' => $schedules
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'status' => false,
                'msg' => 'Đã xảy ra lỗi khi truy vấn dữ liệu!',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
