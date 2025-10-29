<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Patient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PatientController extends Controller
{
    // Lấy danh sách bệnh nhân (tìm kiếm + phân trang)
    public function index(Request $request)
    {
        $query = Patient::with('user:id,name,email,phone');

        if ($search = $request->query('search')) {
            $query->whereHas('user', function ($q) use ($search) {
                $q->where('name', 'like', "%$search%");
            });
        }

        $patients = $query->paginate(5);
        return response()->json($patients);
    }

    // Thêm bệnh nhân mới
    public function store(Request $request)
    {
        $request->validate([
            'name'  => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:255',
            'gender'  => 'nullable|string|max:10',
            'date_of_birth' => 'nullable|date',
            'health_insurance' => 'nullable|string|max:255',
        ]);

        DB::beginTransaction();
        try {
            $user = User::create([
                'name'     => $request->name,
                'email'    => $request->email,
                'phone'    => $request->phone,
                'password' => bcrypt('123456'),
            ]);

            $patient = Patient::create([
                'user_id' => $user->id,
                'address' => $request->address,
                'gender'  => $request->gender,
                'date_of_birth' => $request->date_of_birth,
                'health_insurance' => $request->health_insurance,
            ]);

            DB::commit();
            return response()->json($patient, 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => '❌ Lỗi khi thêm bệnh nhân',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    // Lấy chi tiết bệnh nhân
    public function show($id)
    {
        $patient = Patient::with('user')->findOrFail($id);
        return response()->json($patient);
    }

    // Cập nhật thông tin bệnh nhân
    public function update(Request $request, $id)
    {
        $patient = Patient::findOrFail($id);
        $user = $patient->user;

        DB::beginTransaction();
        try {
            if ($user) {
                $user->update([
                    'name'  => $request->name ?? $user->name,
                    'email' => $request->email ?? $user->email,
                    'phone' => $request->phone ?? $user->phone,
                ]);
            }

            $patient->update([
                'address' => $request->address ?? $patient->address,
                'gender'  => $request->gender ?? $patient->gender,
                'date_of_birth' => $request->date_of_birth ?? $patient->date_of_birth,
                'health_insurance' => $request->health_insurance ?? $patient->health_insurance,
            ]);

            DB::commit();
            return response()->json(['message' => '✅ Cập nhật bệnh nhân thành công']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => '❌ Lỗi khi cập nhật bệnh nhân',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    // Xóa bệnh nhân (và user liên kết, kèm các quan hệ phụ thuộc)
    public function destroy($id)
    {
        $patient = Patient::with(['user', 'appointments', 'feedbacks', 'favorites'])->find($id);

        if (!$patient) {
            return response()->json(['message' => '❌ Không tìm thấy bệnh nhân'], 404);
        }

        DB::beginTransaction();
        try {
            // Xóa các quan hệ phụ
            $patient->appointments()->delete();
            $patient->feedbacks()->delete();
            $patient->favorites()->delete();

            // Xóa user liên kết (nếu có)
            if ($patient->user) {
                $patient->user->delete();
            }

            // Cuối cùng, xóa chính bệnh nhân
            $patient->delete();

            DB::commit();
            return response()->json(['message' => '🗑️ Đã xóa bệnh nhân thành công']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => '❌ Lỗi khi xóa bệnh nhân',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}