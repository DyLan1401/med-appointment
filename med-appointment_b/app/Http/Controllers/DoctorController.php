<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Doctor;
use App\Models\DoctorCertificate;
use App\Models\ChatGroup;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Hash;

class DoctorController extends Controller
{
    // ==========================
    // LIST DOCTOR
    // ==========================
    public function index(Request $request)
    {
        $query = Doctor::with(['user', 'department', 'specialization', 'certificates']);

        if ($request->filled('name')) {
            $query->whereHas('user', fn($q) => $q->where('name', 'like', '%' . $request->name . '%'));
        }

        if ($request->filled('department_id')) {
            $query->where('department_id', $request->department_id);
        }

        if ($request->filled('specialization_id')) {
            $query->where('specialization_id', $request->specialization_id);
        }

        return response()->json($query->paginate(8));
    }

    // ==========================
    // CREATE DOCTOR
    // ==========================
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:100',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6',
            'department_id' => 'nullable|exists:departments,id',
            'specialization_id' => 'nullable|exists:departments,id',
            'bio' => 'nullable|string',
            'phone' => 'nullable|string|max:20',
        ]);

        // Create user
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'doctor',
            'phone' => $request->phone,
        ]);

        // Create doctor
        $doctor = Doctor::create([
            'user_id' => $user->id,
            'department_id' => $request->department_id,
            'specialization_id' => $request->specialization_id,
            'bio' => $request->bio,
            'status' => 'offline',
        ]);

        // MAP vào group chat chuyên khoa
        $group = ChatGroup::where('specialty_name', $doctor->specialization?->name)->first();
        if ($group) {
            $group->users()->syncWithoutDetaching($doctor->user_id);
        }

        return response()->json([
            'message' => 'Doctor created successfully',
            'doctor' => $doctor->load(['user', 'department', 'specialization']),
        ], 201);
    }

    // ==========================
    // UPDATE DOCTOR
    // ==========================
    public function update(Request $request, $id)
    {
        $doctor = Doctor::with('user')->findOrFail($id);
        $user = $doctor->user;

        $request->validate([
            'name' => 'required|string|max:100',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'phone' => 'nullable|string|max:20',
            'bio' => 'nullable|string',
            'department_id' => 'nullable|exists:departments,id',
            'specialization_id' => 'nullable|exists:departments,id',
            'status' => 'nullable|string|in:online,offline,active,inactive',
        ]);

        $user->update([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
        ]);

        $doctor->update([
            'bio' => $request->bio,
            'department_id' => $request->department_id,
            'specialization_id' => $request->specialization_id,
            'status' => $request->status ?? $doctor->status,
        ]);

        return response()->json([
            'message' => 'Doctor updated successfully',
            'doctor' => $doctor->load(['user', 'department', 'specialization']),
        ]);
    }

    // ==========================
    // DELETE
    // ==========================
    public function destroy($id)
    {
        $doctor = Doctor::with(['user', 'certificates'])->findOrFail($id);

        if ($doctor->user->avatar && Storage::disk('public')->exists($doctor->user->avatar)) {
            Storage::disk('public')->delete($doctor->user->avatar);
        }

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

    // ==========================
    // SHOW PROFILE
    // ==========================
    public function showProfile($doctor_id)
    {
        $doctor = Doctor::with(['user', 'department', 'specialization', 'certificates'])->find($doctor_id);

        if (!$doctor) {
            return response()->json(['message' => 'Không tìm thấy bác sĩ'], 404);
        }

        $doctor->user->avatar_url_full = $doctor->user->avatar ? asset('storage/' . $doctor->user->avatar) : null;

        foreach ($doctor->certificates as $cert) {
            $cert->file_url = $cert->image ? asset('storage/' . $cert->image) : null;
        }

        return response()->json($doctor);
    }

    // ==========================
    // UPDATE PROFILE
    // ==========================
    public function updateProfile(Request $request, $doctor_id)
    {
        $doctor = Doctor::with('user')->findOrFail($doctor_id);
        $user = $doctor->user;

        $request->validate([
            'name' => 'required|string|max:100',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'phone' => 'nullable|string|max:20',
            'bio' => 'nullable|string',
            'department_id' => 'nullable|exists:departments,id',
            'specialization_id' => 'nullable|exists:departments,id',
        ]);

        $user->update([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
        ]);

        $doctor->update([
            'bio' => $request->bio,
            'department_id' => $request->department_id,
            'specialization_id' => $request->specialization_id,
        ]);

        return response()->json([
            'message' => 'Cập nhật hồ sơ bác sĩ thành công!',
            'doctor' => $doctor->load(['user', 'department', 'specialization']),
        ]);
    }


    // ==========================
    // UPLOAD AVATAR
    // ==========================
    public function uploadAvatar(Request $request, $doctor_id)
    {
        $doctor = Doctor::with('user')->findOrFail($doctor_id);
        $user = $doctor->user;

        $request->validate([
            'avatar' => 'required|image|mimes:jpg,jpeg,png|max:2048'
        ]);

        if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
            Storage::disk('public')->delete($user->avatar);
        }

        $path = $request->file('avatar')->store('avatars', 'public');
        $user->update(['avatar' => $path]);

        return response()->json([
            'message' => 'Cập nhật ảnh đại diện thành công!',
            'avatar_url' => asset('storage/' . $path),
        ]);
    }

    // ==========================
    // UPLOAD CERTIFICATE
    // ==========================
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

    // ==========================
    // GET CERTIFICATES
    // ==========================
    public function getCertificates($doctor_id)
    {
        $certificates = DoctorCertificate::where('doctor_id', $doctor_id)->get();

        foreach ($certificates as $c) {
            $c->file_url = asset('storage/' . $c->image);
        }

        return response()->json($certificates);
    }

    // ==========================
    // DELETE CERTIFICATE
    // ==========================
    public function deleteCertificate($id)
    {
        $certificate = DoctorCertificate::findOrFail($id);

        if ($certificate->image && Storage::disk('public')->exists($certificate->image)) {
            Storage::disk('public')->delete($certificate->image);
        }

        $certificate->delete();

        return response()->json(['message' => 'Xóa chứng chỉ thành công!']);
    }

    // ==========================
    // SEARCH DOCTOR
    // ==========================
    public function search(Request $request)
    {
        $query = $request->input('query');

        if (!$query) {
            return response()->json(['message' => 'Thiếu từ khóa tìm kiếm.'], 400);
        }

        $doctors = Doctor::with(['user', 'department', 'specialization'])
            ->where(function ($q) use ($query) {
                $q->whereHas('user', function ($q2) use ($query) {
                    $q2->where('name', 'like', "%$query%");
                })
                ->orWhereHas('specialization', function ($q2) use ($query) {
                    $q2->where('name', 'like', "%$query%");
                })
                ->orWhereHas('department', function ($q2) use ($query) {
                    $q2->where('name', 'like', "%$query%");
                });
            })
            ->get();

        if ($doctors->isEmpty()) {
            return response()->json(['message' => 'Không tìm thấy bác sĩ phù hợp.'], 404);
        }

        return response()->json($doctors);
    }

    // ==========================
    // SIMPLE LIST
    // ==========================
    public function list()
    {
        return response()->json(
            Doctor::with('user')
                ->select('id', 'user_id')
                ->get()
                ->map(fn($doctor) => [
                    'id' => $doctor->id,
                    'name' => $doctor->user->name,
                ])
        );
    }

    // ==========================
    // TOP DOCTORS
    // ==========================
    public function topDoctors(Request $request)
    {
        $limit = $request->get('limit', 10);

        $top = Doctor::join('users', 'users.id', '=', 'doctors.user_id')
            ->leftJoin('departments', 'departments.id', '=', 'doctors.specialization_id')
            ->join('appointments', 'appointments.doctor_id', '=', 'doctors.id')
            ->select(
                'doctors.id as doctor_id',
                'users.name as doctor_name',
                'users.email',
                'users.avatar',
                'departments.name as specialty',
                DB::raw('COUNT(appointments.id) as total_appointments')
            )
            ->groupBy('doctors.id', 'users.name', 'users.email', 'users.avatar', 'departments.name')
            ->orderByDesc('total_appointments')
            ->take($limit)
            ->get();

        return response()->json($top);
    }

    // ==========================
    // AUTH: WHO AM I? /doctor/me
    // ==========================
    public function me(Request $request)
    {
        $user = $request->user();

        $doctor = Doctor::with(['department', 'specialization'])
            ->where('user_id', $user->id)
            ->first();

        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'doctor' => $doctor ? [
                'id' => $doctor->id,
                'department_id' => $doctor->department_id,
                'department_name' => $doctor->department?->name,
                'specialization_id' => $doctor->specialization_id,
                'specialization_name' => $doctor->specialization?->name,
                'bio' => $doctor->bio,
            ] : null
        ]);
    }

}