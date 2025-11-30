<?php

namespace App\Http\Controllers;

use App\Models\Department;
use Illuminate\Http\Request;
use Carbon\Carbon;

class DepartmentController extends Controller
{
    public function index(Request $request)
    {
        return response()->json(Department::getDepartments($request->get('limit', 10)));
    }

    public function search(Request $request)
    {
        $query = $request->get('query', '');
        $departments = Department::searchDepartments($query, $request->get('limit', 10));

        return response()->json([
            'message' => $query ? "Kết quả tìm kiếm cho: $query" : 'Danh sách tất cả chuyên khoa.',
            'data' => $departments->items(),
            'pagination' => [
                'current_page' => $departments->currentPage(),
                'last_page' => $departments->lastPage(),
                'total' => $departments->total(),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'description' => 'nullable|string|max:1000',
        ]);

        return response()->json([
            'message' => 'Department created successfully',
            'data' => Department::createDepartment($validated),
        ], 201);
    }

    public function show($id)
    {
        $department = Department::find($id);

        if (!$department) {
            return response()->json([
                'message' => 'Không tìm thấy chuyên khoa.',
            ], 404);
        }

        return response()->json($department);
    }

    public function update(Request $request, $id)
    {
        $department = Department::find($id);

        if (!$department) {
            return response()->json([
                'message' => 'Không tìm thấy chuyên khoa để cập nhật.',
            ], 404);
        }

        if ($request->has('updated_at') && $department->updated_at->ne(Carbon::parse($request->updated_at))) {
            return response()->json([
                'message' => 'Dữ liệu đã được thay đổi. Vui lòng tải lại trang.',
            ], 409);
        }

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:100',
            'description' => 'nullable|string|max:1000',
        ]);

        $department->updateDepartment($validated);

        return response()->json([
            'message' => 'Department updated successfully',
            'data' => $department,
        ]);
    }

    public function destroy($id)
    {
        $department = Department::find($id);

        if (!$department) {
            return response()->json([
                'message' => 'Không tìm thấy chuyên khoa để xóa.',
            ], 404);
        }

        $department->delete();
        
        return response()->json(['message' => 'Department deleted successfully']);
    }
}