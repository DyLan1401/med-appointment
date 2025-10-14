<?php

namespace App\Http\Controllers;

use App\Models\Department;
use Illuminate\Http\Request;

class DepartmentController extends Controller
{
    // Lấy danh sách tất cả departments
    public function index()
    {
        return response()->json(Department::all());
    }

    // Tạo mới department
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'description' => 'nullable|string|max:1000',
        ]);

        $department = Department::create($validated);

        return response()->json([
            'message' => 'Department created successfully',
            'data' => $department,
        ], 201);
    }

    // Xem chi tiết department theo id
    public function show($id)
    {
        $department = Department::find($id);

        if (!$department) {
            return response()->json(['message' => 'Department not found'], 404);
        }

        return response()->json($department);
    }

    // Cập nhật department
   public function update(Request $request, $id)
{
    $department = Department::find($id);

    if (!$department) {
        return response()->json(['message' => 'Department not found'], 404);
    }

    // Nếu là PUT với form-data, lấy tất cả dữ liệu trực tiếp
    $data = $request->all();

    // Validate thủ công
    $validated = validator($data, [
        'name' => 'sometimes|required|string|max:100',
        'description' => 'nullable|string|max:1000',
    ])->validate();

    $department->fill($validated)->save();

    return response()->json([
        'message' => 'Department updated successfully nhe',
        'data' => $department,
    ]);
}


    // Xóa department
    public function destroy($id)
    {
        $department = Department::find($id);

        if (!$department) {
            return response()->json(['message' => 'Department not found'], 404);
        }

        $department->delete();

        return response()->json(['message' => 'Department deleted successfully']);
    }
}
