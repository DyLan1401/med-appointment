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
}
