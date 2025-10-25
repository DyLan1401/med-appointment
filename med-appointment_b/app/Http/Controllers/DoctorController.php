<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Doctor;
use App\Models\DoctorCertificate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Hash;

class DoctorController extends Controller
{
    //   CRUD DOCTOR
    public function index(Request $request)
    {
        $query = Doctor::with(['user', 'certificates', 'specialization']);

        if ($request->filled('name')) {
            $query->whereHas('user', fn($q) => $q->where('name', 'like', '%' . $request->name . '%'));
        }

        if ($request->filled('specialization_id')) {
            $query->where('specialization_id', $request->specialization_id);
        }

        return response()->json($query->orderBy('id', 'asc')->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:100',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6',
            'specialization_id' => 'required|integer|exists:departments,id',
            'bio' => 'nullable|string',
            'phone' => 'nullable|string|max:20',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'doctor',
            'phone' => $request->phone,
        ]);

        $doctor = Doctor::create([
            'user_id' => $user->id,
            'specialization_id' => $request->specialization_id,
            'status' => 'offline',
            'bio' => $request->bio,
        ]);

        return response()->json([
            'message' => 'Doctor created successfully',
            'doctor' => $doctor->load(['user', 'specialization']),
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $doctor = Doctor::with('user')->findOrFail($id);
        $user = $doctor->user;

        $request->validate([
            'name' => 'required|string|max:100',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'phone' => 'nullable|string|max:20',
            'bio' => 'nullable|string',
            'specialization_id' => 'nullable|integer|exists:departments,id',
            'status' => 'nullable|string|in:online,offline',
        ]);

        $user->update([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
        ]);

        $doctor->update([
            'bio' => $request->bio,
            'specialization_id' => $request->specialization_id,
            'status' => $request->status ?? $doctor->status,
        ]);

        return response()->json([
            'message' => 'Doctor updated successfully',
            'doctor' => $doctor->load(['user', 'specialization']),
        ]);
    }

    public function destroy($id)
    {
        $doctor = Doctor::with('user', 'certificates')->findOrFail($id);

        // Xóa avatar nếu có
        if ($doctor->user->avatar && Storage::disk('public')->exists($doctor->user->avatar)) {
            Storage::disk('public')->delete($doctor->user->avatar);
        }

        // Xóa chứng chỉ
        foreach ($doctor->certificates as $cert) {
            if ($cert->image && Storage::disk('public')->exists($cert->image)) {
                Storage::disk('public')->delete($cert->image);
            }
            $cert->delete();
        }

        $doctor->delete();
        $doctor->user->delete();

        return response()->json(['message' => 'Doctor deleted successfully']);
    }


    //   PROFILE (HIỂN THỊ + CẬP NHẬT)
    public function showProfile($doctor_id)
    {
        $doctor = Doctor::with(['user', 'specialization', 'certificates'])->find($doctor_id);
        if (!$doctor) {
            return response()->json(['message' => 'Không tìm thấy bác sĩ'], 404);
        }

        // Không cần nối asset() thêm lần nữa
        $doctor->user->avatar_url_full = $doctor->user->avatar_url;

        foreach ($doctor->certificates as $cert) {
            $cert->file_url = $cert->image ? asset('storage/' . $cert->image) : null;
        }

        return response()->json($doctor);
    }

    public function updateProfile(Request $request, $doctor_id)
    {
        $doctor = Doctor::with('user')->findOrFail($doctor_id);
        $user = $doctor->user;

        $request->validate([
            'name' => 'required|string|max:100',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'phone' => 'nullable|string|max:20',
            'bio' => 'nullable|string',
            'specialization_id' => 'nullable|integer|exists:departments,id',
        ]);

        $user->update([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
        ]);

        $doctor->update([
            'bio' => $request->bio,
            'specialization_id' => $request->specialization_id,
        ]);

        return response()->json([
            'message' => 'Cập nhật hồ sơ bác sĩ thành công!',
            'doctor' => $doctor->load(['user', 'specialization']),
        ]);
    }


    //   UPLOAD AVATAR
    public function uploadAvatar(Request $request, $doctor_id)
    {
        $doctor = Doctor::with('user')->findOrFail($doctor_id);
        $user = $doctor->user;

        $request->validate([
            'avatar' => 'required|image|mimes:jpg,jpeg,png|max:2048'
        ]);

        // Xóa avatar cũ
        if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
            Storage::disk('public')->delete($user->avatar);
        }

        // Upload mới
        $path = $request->file('avatar')->store('avatars', 'public');
        $user->update(['avatar' => $path]);

        return response()->json([
            'message' => 'Cập nhật ảnh đại diện thành công!',
            'avatar_url' => asset('storage/' . $path),
        ]);
    }


    //   UPLOAD CHỨNG CHỈ / BẰNG CẤP
    public function uploadCertificate(Request $request, $doctor_id)
    {
        $doctor = Doctor::findOrFail($doctor_id);

        $request->validate([
            'certificate_name' => 'required|string|max:255',
            'certificate_type' => 'required|string|max:50',
            'file' => 'required|file|mimes:jpg,jpeg,png,pdf|max:5120',
        ]);

        $path = $request->file('file')->store('certificates', 'public');

        $certificate = DoctorCertificate::create([
            'doctor_id' => $doctor->id,
            'certificate_name' => $request->certificate_name,
            'certificate_type' => $request->certificate_type,
            'image' => $path,
        ]);

        return response()->json([
            'message' => 'Upload chứng chỉ thành công!',
            'certificate' => [
                'id' => $certificate->id,
                'certificate_name' => $certificate->certificate_name,
                'certificate_type' => $certificate->certificate_type,
                'file_url' => asset('storage/' . $path),
            ],
        ], 201);
    }

    public function getCertificates($doctor_id)
    {
        $certificates = DoctorCertificate::where('doctor_id', $doctor_id)->get();

        foreach ($certificates as $c) {
            $c->file_url = asset('storage/' . $c->image);
        }

        return response()->json($certificates);
    }

    public function deleteCertificate($id)
    {
        $certificate = DoctorCertificate::findOrFail($id);

        if ($certificate->image && Storage::disk('public')->exists($certificate->image)) {
            Storage::disk('public')->delete($certificate->image);
        }

        $certificate->delete();

        return response()->json(['message' => 'Xóa chứng chỉ thành công!']);
    }

    // Tìm kiếm bác sĩ theo tên hoặc chuyên khoa
    public function search(Request $request)
{
    $query = $request->input('query');

    if (!$query) {
        return response()->json(['message' => 'Thiếu từ khóa tìm kiếm.'], 400);
    }

    $doctors = Doctor::with(['user', 'specialization'])
        ->where(function ($q) use ($query) {
            $q->whereHas('user', function ($q2) use ($query) {
                $q2->where('name', 'like', "%$query%");
            })
            ->orWhereHas('specialization', function ($q2) use ($query) {
                $q2->where('name', 'like', "%$query%");
            });
        })
        ->get();

    if ($doctors->isEmpty()) {
        return response()->json(['message' => 'Không tìm thấy bác sĩ phù hợp.'], 404);
    }

    return response()->json($doctors);
}
}