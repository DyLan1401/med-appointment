<?php

namespace App\Http\Controllers;

use App\Models\Department;
use Illuminate\Http\Request;

class DepartmentController extends Controller
{
   // 🟢 Lấy danh sách departments (có phân trang)
    public function index(Request $request)
    {
        $limit = $request->get('limit', 10); // Số bản ghi mỗi trang
        $departments = Department::paginate($limit);

        return response()->json([
            'data' => $departments->items(),
            'pagination' => [
                'current_page' => $departments->currentPage(),
                'last_page' => $departments->lastPage(),
                'total' => $departments->total(),
            ],
        ]);
    }

    // 🟣 Tìm kiếm departments (có phân trang, query rỗng => tất cả)
    public function search(Request $request)
    {
        $query = trim($request->get('query', ''));
        $limit = $request->get('limit', 10);

        if ($query === '') {
            $departments = Department::paginate($limit);
        } else {
            $departments = Department::where('name', 'like', "%{$query}%")
                ->orWhere('description', 'like', "%{$query}%")
                ->paginate($limit);
        }

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
