<?php

namespace App\Http\Controllers;

use App\Models\Department;
use Illuminate\Http\Request;
use Carbon\Carbon;

class DepartmentController extends Controller
{

    public function index(Request $request)
    {
        $limit = $request->get('limit', 10);
        $departments = Department::getDepartments($limit);

        return response()->json([
            'data' => $departments->items(),
            'pagination' => [
                'current_page' => $departments->currentPage(),
                'last_page' => $departments->lastPage(),
                'total' => $departments->total(),
            ],
        ]);
    }

    // Tìm kiếm departments (có phân trang, query rỗng => tất cả)
    public function search(Request $request)
    {
        $query = $request->get('query', '');
        $limit = $request->get('limit', 10);
        $departments = Department::searchDepartments($query, $limit);

        return response()->json([
            'message' => $query === ''
                ? 'Danh sách tất cả chuyên khoa.'
                : "Kết quả tìm kiếm cho: {$query}",
            'data' => $departments->items(),
            'pagination' => [
                'current_page' => $departments->currentPage(),
                'last_page' => $departments->lastPage(),
                'total' => $departments->total(),
            ],
        ]);
    }

    // Tạo mới
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'description' => 'nullable|string|max:1000',
        ]);

        $department = Department::createDepartment($validated);

        return response()->json([
            'message' => 'Department created successfully',
            'data' => $department,
        ], 201);
    }

    // Xem chi tiết
    public function show($id)
    {
        $department = Department::find($id);

        if (!$department) {
            return response()->json(['message' => 'Department not found'], 404);
        }

        return response()->json($department);
    }

    // Cập nhật
    public function update(Request $request, $id)
    {
        $department = Department::find($id);

        if (!$department) {
            return response()->json(['message' => 'Department not found'], 404);
        }

        // --- BẮT ĐẦU SỬA: Kiểm tra Optimistic Locking ---
        if ($request->has('updated_at')) {
            $clientUpdatedAt = Carbon::parse($request->updated_at)->format('Y-m-d H:i:s');
            $dbUpdatedAt = $department->updated_at->format('Y-m-d H:i:s');

            if ($clientUpdatedAt !== $dbUpdatedAt) {
                return response()->json([
                    'message' => 'Dữ liệu đã được thay đổi ở thiết bị khác. Vui lòng tải lại trang trước khi cập nhật.'
                ], 409); // 409 Conflict
            }
        }
        // --- KẾT THÚC SỬA ---

        $data = $request->all();

        $validated = validator($data, [
            'name' => 'sometimes|required|string|max:100',
            'description' => 'nullable|string|max:1000',
        ])->validate();

        // Giả sử updateDepartment là method custom của bạn
        // Nếu dùng chuẩn Laravel thì: $department->update($validated);
        $department->updateDepartment($validated);

        return response()->json([
            'message' => 'Department updated successfully',
            'data' => $department,
        ]);
    }

    // Xóa
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
