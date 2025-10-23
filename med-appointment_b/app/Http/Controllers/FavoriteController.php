<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Models\Favorite;
use App\Models\Doctor;

class FavoriteController extends Controller
{
    /**
     * 🩷 Lấy danh sách bác sĩ yêu thích của user
     */
    public function index($user_id = null)
    {
        try {
            if ($user_id) {
                // ✅ Nếu có user_id (người dùng đăng nhập)
                $favorites = Favorite::with(['doctor.user', 'doctor.specialization'])
                    ->where('user_id', $user_id)
                    ->get();
            } else {
                // ✅ Nếu chưa đăng nhập → lấy danh sách từ session (tạm)
                $favorites = session('favorites', []);
            }

            return response()->json([
                'status' => 'success',
                'data' => $favorites,
            ]);
        } catch (\Exception $e) {
            Log::error('❌ Lỗi khi lấy danh sách yêu thích: ' . $e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Không thể tải danh sách yêu thích!',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * 🧩 Thêm bác sĩ vào danh sách yêu thích
     */
    public function store(Request $request)
    {
        try {
            $request->validate([
                'doctor_id' => 'required|exists:doctors,id',
            ]);

            $user = auth()->user();

            // ✅ Nếu người dùng chưa đăng nhập
            if (!$user) {
                Log::info('🧠 Người dùng chưa đăng nhập, lưu local favorites', [
                    'doctor_id' => $request->doctor_id,
                ]);

                return response()->json([
                    'status' => 'guest',
                    'message' => 'Bạn chưa đăng nhập, lưu yêu thích tạm thời!',
                    'doctor_id' => $request->doctor_id,
                ], 200);
            }

            // ✅ Lưu vào bảng favorites (dùng user_id)
            $favorite = Favorite::firstOrCreate([
                'user_id' => $user->id,
                'doctor_id' => $request->doctor_id,
            ]);

            Log::info('✅ Đã thêm bác sĩ yêu thích', [
                'user_id' => $user->id,
                'doctor_id' => $request->doctor_id,
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Đã thêm bác sĩ yêu thích!',
                'data' => $favorite,
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::warning('⚠️ Lỗi validate dữ liệu yêu thích', [
                'errors' => $e->errors(),
            ]);

            return response()->json([
                'status' => 'fail',
                'message' => 'Dữ liệu không hợp lệ!',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            Log::error('❌ Lỗi khi thêm bác sĩ yêu thích: ' . $e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'request' => $request->all(),
                'user_id' => auth()->id(),
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Không thể thêm bác sĩ yêu thích!',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * 🗑️ Xóa bác sĩ khỏi danh sách yêu thích
     */
    public function destroy($doctor_id)
    {
        try {
            $user = auth()->user();

            if (!$user) {
                Log::warning('🚫 Người dùng chưa đăng nhập khi xóa yêu thích', [
                    'doctor_id' => $doctor_id,
                ]);
                return response()->json(['message' => 'Bạn cần đăng nhập!'], 401);
            }

            $favorite = Favorite::where('doctor_id', $doctor_id)
                ->where('user_id', $user->id)
                ->first();

            if (!$favorite) {
                Log::info('🔎 Không tìm thấy yêu thích để xóa', [
                    'doctor_id' => $doctor_id,
                    'user_id' => $user->id,
                ]);
                return response()->json(['message' => 'Không tìm thấy yêu thích này!'], 404);
            }

            $favorite->delete();

            Log::info('🗑️ Đã xóa bác sĩ yêu thích', [
                'doctor_id' => $doctor_id,
                'user_id' => $user->id,
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Đã xóa khỏi danh sách yêu thích!',
            ]);
        } catch (\Exception $e) {
            Log::error('❌ Lỗi khi xóa bác sĩ yêu thích: ' . $e->getMessage(), [
                'doctor_id' => $doctor_id,
                'user_id' => auth()->id(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Không thể xóa bác sĩ yêu thích!',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * 🩺 Lấy thông tin chi tiết của 1 bác sĩ
     */
    public function getDoctor($doctor_id)
    {
        try {
            $doctor = Doctor::with(['user', 'specialization'])->findOrFail($doctor_id);

            Log::info('✅ Lấy thông tin bác sĩ thành công', [
                'doctor_id' => $doctor_id,
            ]);

            return response()->json([
                'status' => 'success',
                'data' => $doctor,
            ]);
        } catch (\Exception $e) {
            Log::error('❌ Lỗi khi lấy thông tin bác sĩ: ' . $e->getMessage(), [
                'doctor_id' => $doctor_id,
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Không tìm thấy bác sĩ!',
                'error' => $e->getMessage(),
            ], 404);
        }
    }
}