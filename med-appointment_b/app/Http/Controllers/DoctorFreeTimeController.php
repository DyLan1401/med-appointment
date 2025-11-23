<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Doctor;
use App\Models\DoctorFreeTime;

class DoctorFreeTimeController extends Controller
{
    // ✅ Lấy danh sách bác sĩ (cho dropdown)
    public function getDoctors()
    {
        return Doctor::with('user:id,name')->get()->map(function ($doctor) {
            return [
                'id' => $doctor->id,
                'name' => $doctor->user->name ?? 'Không rõ tên',
            ];
        });
    }

    // ✅ Lấy danh sách lịch rảnh
    public function index()
    {
        return DoctorFreeTime::with('doctor.user:id,name')->get();
    }

    // ✅ Lưu lịch rảnh mới
    public function store(Request $request)
    {
        $validated = $request->validate([
            'doctor_id' => 'required|exists:doctors,id',
            'date' => 'required|date',
            'start_time' => 'required',
            'end_time' => 'required',
        ]);

        $freeTime = DoctorFreeTime::create($validated);
        return response()->json($freeTime, 201);
    }

    // ✅ Cập nhật lịch rảnh
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'doctor_id' => 'required|exists:doctors,id',
            'date' => 'required|date',
            'start_time' => 'required',
            'end_time' => 'required',
        ]);

        $freeTime = DoctorFreeTime::findOrFail($id);
        $freeTime->update($validated);

        return response()->json([
            'message' => 'Cập nhật lịch rảnh thành công',
            'data' => $freeTime
        ]);
    }

    // ✅ Xóa lịch rảnh
    public function destroy($id)
    {
        $freeTime = DoctorFreeTime::findOrFail($id);
        $freeTime->delete();
        return response()->json(['message' => 'Đã xóa lịch rảnh thành công']);
    }
} 