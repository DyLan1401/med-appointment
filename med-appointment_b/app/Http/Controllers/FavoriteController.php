<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Favorite;
use App\Models\Doctor;

class FavoriteController extends Controller
{
    // ===== Lấy danh sách bác sĩ yêu thích =====
    public function index(Request $request, $patient_id = null)
    {
        // Nếu có patient_id (người đã đăng nhập)
        if ($patient_id) {
            $favorites = Favorite::with(['doctor.user', 'doctor.specialization'])
                ->where('patient_id', $patient_id)
                ->get();
        } else {
            // Nếu chưa đăng nhập → lấy từ session
            $favorites = session('favorites', []);
        }

        return response()->json([
            'status' => 'success',
            'data' => $favorites
        ]);
    }

    // ===== Thêm bác sĩ yêu thích =====
    public function store(Request $request)
    {
        $doctorId = $request->doctor_id;
        $patientId = $request->patient_id;

        if ($patientId) {
            // Nếu người dùng đã đăng nhập
            $favorite = Favorite::firstOrCreate([
                'patient_id' => $patientId,
                'doctor_id' => $doctorId
            ]);
            return response()->json(['message' => 'Đã thêm bác sĩ yêu thích!', 'data' => $favorite]);
        } else {
            // Nếu chưa đăng nhập → lưu vào session
            $favorites = session('favorites', []);
            if (!in_array($doctorId, $favorites)) {
                $favorites[] = $doctorId;
                session(['favorites' => $favorites]);
            }
            return response()->json(['message' => 'Đã thêm vào danh sách tạm thời!']);
        }
    }

    // ===== Xóa bác sĩ yêu thích =====
    public function destroy($id, Request $request)
    {
        $patientId = $request->patient_id;

        if ($patientId) {
            Favorite::where('id', $id)->delete();
            return response()->json(['message' => 'Đã xóa khỏi danh sách yêu thích!']);
        } else {
            // Xóa trong session
            $favorites = session('favorites', []);
            $new = array_filter($favorites, fn($docId) => $docId != $id);
            session(['favorites' => $new]);
            return response()->json(['message' => 'Đã xóa khỏi danh sách tạm thời!']);
        }
    }
}