<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Doctor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class DoctorController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
       $query = Doctor::with('user');

    // Lọc theo tên
    if ($request->has('name') && $request->name !== '') {
        $query->whereHas('user', function ($q) use ($request) {
            $q->where('name', 'like', '%' . $request->name . '%');
        });
    }

    // Lọc theo chuyên khoa
    if ($request->has('specialization') && $request->specialization !== '') {
        $query->where('specialization', 'like', '%' . $request->specialization . '%');
    }

    $doctors = $query->orderBy('id', 'desc')->get();

    return response()->json($doctors);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:100',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6',
            'specialization' => 'nullable|string',
            'bio' => 'nullable|string',
            'phone' => 'nullable|string',
        ]);

        try {
            // 1️⃣ Tạo user có role = doctor
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => 'doctor', // 🔥 Gán role cố định ở đây
                'phone' => $request->phone,
            ]);

            // 2️⃣ Tạo hồ sơ bác sĩ liên kết user_id
            $doctor = Doctor::create([
                'user_id' => $user->id, // ✅ đúng cột foreign key
                'specialization' => $request->specialization,
                'status' => 'offline',
                'bio' => $request->bio,
            ]);

            return response()->json([
                'message' => 'Thêm bác sĩ thành công!',
                'doctor' => $doctor->load('user'),
            ], 201);
        } catch (\Throwable $e) {
            return response()->json([
                'error' => 'Không thể tạo bác sĩ',
                'detail' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Doctor $doctor)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Doctor $doctor)
    {
        //

    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Doctor $doctor,$id)
    {
        $doctor = Doctor::findOrFail($id);
    $user = $doctor->user;

    $request->validate([
        'name' => 'required|string|max:100',
        'email' => 'required|email|unique:users,email,' . $user->id,
        'specialization' => 'nullable|string',
        'bio' => 'nullable|string',
        'phone' => 'nullable|string',
    ]);

    $user->update([
        'name' => $request->name,
        'email' => $request->email,
        'phone' => $request->phone,
        'role' => 'doctor', // giữ nguyên role nếu user thuộc nhóm bác sĩ

    ]);

    $doctor->update([
        'specialization' => $request->specialization,
        'bio' => $request->bio,
        'status' => $request->status ?? $doctor->status,
    ]);

    return response()->json([
        'message' => 'Doctor updated successfully',
        'doctor' => $doctor->load('user'),
    ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $doctor = Doctor::findOrFail($id);
        $user = $doctor->user;
        $user->delete(); // cascade xóa doctor nhờ foreign key

        return response()->json(['message' => 'Đã xóa bác sĩ và tài khoản liên quan!']);
    }

}
