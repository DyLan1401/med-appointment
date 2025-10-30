<?php

namespace App\Http\Controllers;

use App\Models\Doctor;
use App\Models\DoctorCertificate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class DoctorCertificateController extends Controller
{
    // Hiển thị danh sách tất cả chứng chỉ
    public function index()
    {
        $certificates = DoctorCertificate::with('doctor.user')->latest()->get();
        return response()->json($certificates);
    }

    // Hiển thị danh sách chứng chỉ của 1 bác sĩ.
    public function getByDoctor($doctor_id)
    {
        $doctor = Doctor::findOrFail($doctor_id);
        $certificates = DoctorCertificate::where('doctor_id', $doctor->id)->get();

        return response()->json([
            'doctor_id' => $doctor_id,
            'certificates' => $certificates,
        ]);
    }

    // Lưu chứng chỉ mới cho bác sĩ.
    public function store(Request $request)
    {
        $request->validate([
            'doctor_id' => 'required|integer|exists:doctors,id',
            'certificate_name' => 'required|string|max:255',
            'certificate_type' => 'required|string|max:50',
            'file' => 'required|file|mimes:jpg,jpeg,png,pdf|max:5120',
        ]);

        $path = $request->file('file')->store('certificates', 'public');

        $certificate = DoctorCertificate::create([
            'doctor_id' => $request->doctor_id,
            'certificate_name' => $request->certificate_name,
            'certificate_type' => $request->certificate_type,
            'image' => $path,
        ]);

        return response()->json([
            'message' => 'Tải lên chứng chỉ thành công!',
            'certificate' => $certificate,
        ]);
    }

    // Xem chi tiết 1 chứng chỉ.
    public function show(DoctorCertificate $doctorCertificate)
    {
        $doctorCertificate->load('doctor.user');
        return response()->json($doctorCertificate);
    }

    // Cập nhật thông tin hoặc thay thế file chứng chỉ.
    public function update(Request $request, DoctorCertificate $doctorCertificate)
    {
        $request->validate([
            'certificate_name' => 'nullable|string|max:255',
            'certificate_type' => 'nullable|string|max:50',
            'file' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:5120',
        ]);

        // Nếu có file mới thì xóa file cũ
        if ($request->hasFile('file')) {
            if ($doctorCertificate->image && Storage::disk('public')->exists($doctorCertificate->image)) {
                Storage::disk('public')->delete($doctorCertificate->image);
            }
            $path = $request->file('file')->store('certificates', 'public');
            $doctorCertificate->image = $path;
        }

        if ($request->filled('certificate_name')) {
            $doctorCertificate->certificate_name = $request->certificate_name;
        }

        if ($request->filled('certificate_type')) {
            $doctorCertificate->certificate_type = $request->certificate_type;
        }

        $doctorCertificate->save();

        return response()->json([
            'message' => 'Cập nhật chứng chỉ thành công!',
            'certificate' => $doctorCertificate,
        ]);
    }

    // Xóa chứng chỉ và file.
    public function destroy(DoctorCertificate $doctorCertificate)
    {
        if ($doctorCertificate->image && Storage::disk('public')->exists($doctorCertificate->image)) {
            Storage::disk('public')->delete($doctorCertificate->image);
        }

        $doctorCertificate->delete();

        return response()->json(['message' => 'Xoá chứng chỉ thành công!']);
    }

    // Lấy link truy cập file (ảnh hoặc PDF).
    public function getFileUrl($id)
    {
        $certificate = DoctorCertificate::findOrFail($id);

        if (!$certificate->image) {
            return response()->json(['error' => 'Không tìm thấy file.'], 404);
        }

        $url = Storage::url($certificate->image);

        return response()->json([
            'file_url' => asset($url),
            'type' => $certificate->certificate_type,
        ]);
    }
}