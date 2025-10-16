<?php

// namespace App\Http\Controllers\Api;

namespace App\Http\Controllers;
use App\Models\User;
use App\Models\Patient;
use Illuminate\Http\Request;

class PatientController extends Controller
{
    // ✅ Danh sách bệnh nhân (tìm kiếm + phân trang)
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

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    // ✅ Thêm bệnh nhân
    public function store(Request $request)
    {
        $request->validate([
            'name'  => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'phone' => 'nullable|string|max:20',
        ]);

        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'phone'    => $request->phone,
            'password' => bcrypt('123456'),
        ]);

        $patient = Patient::create([
            'id' => $user->id,
            'address' => $request->address,
            'gender'  => $request->gender,
            'date_of_birth' => $request->date_of_birth,
            'health_insurance' => $request->health_insurance
        ]);

        return response()->json($patient, 201);
    }

    // ✅ Lấy thông tin 1 bệnh nhân
    public function show($id)
    {
        $patient = Patient::with('user')->findOrFail($id);
        return response()->json($patient);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Patient $patient)
    {
        //
    }

    // ✅ Sửa bệnh nhân
    public function update(Request $request, $id)
    {
        $patient = Patient::findOrFail($id);
        $user = $patient->user;

        $user->update([
            'name'  => $request->name ?? $user->name,
            'email' => $request->email ?? $user->email,
            'phone' => $request->phone ?? $user->phone,
        ]);

        $patient->update([
            'address' => $request->address ?? $patient->address,
            'gender'  => $request->gender ?? $patient->gender,
            'date_of_birth' => $request->date_of_birth ?? $patient->date_of_birth,
            'health_insurance' => $request->health_insurance ?? $patient->health_insurance,
        ]);

        return response()->json(['message' => 'Cập nhật thành công']);
    }

    // ✅ Xóa bệnh nhân
    public function destroy($id)
    {
        $patient = Patient::findOrFail($id);
        $patient->user->delete();
        $patient->delete();

        return response()->json(['message' => 'Đã xóa thành công']);
    }
}
