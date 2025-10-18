<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Log;

class ServiceController extends Controller
{
    /**
     * Index - trả về phân trang.
     * Hỗ trợ query params:
     *  - page (mặc định 1)
     *  - per_page (mặc định 10)
     *  - with (optional) => tên quan hệ cần eager load, ví dụ: with=appointments,bookings
     *  - search (optional) => tìm theo tên (partial)
     */
    public function index(Request $request)
    {
        try {
            $perPage = (int) $request->get('per_page', 10);
            $page = (int) $request->get('page', 1);
            $with = $request->get('with'); // ví dụ: "appointments,bookings"
            $search = $request->get('search');

            $query = Service::withBasicInfo();

            // Eager load nếu có yêu cầu
            if (!empty($with)) {
                // lọc input để tránh injection tên không hợp lệ
                $relations = array_filter(array_map('trim', explode(',', $with)));
                if (!empty($relations)) {
                    $query = $query->with($relations);
                }
            }

            // 🟢 Bộ lọc tìm kiếm
            if (!empty($search)) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', '%' . $search . '%')
                    ->orWhere('description', 'like', '%' . $search . '%');
                });
            }

            $services = $query->paginate($perPage, ['*'], 'page', $page);

            return response()->json([
                'success' => true,
                'message' => 'Danh sách dịch vụ (phân trang)',
                'data' => $services->items(),
                'pagination' => [
                    'current_page' => $services->currentPage(),
                    'last_page' => $services->lastPage(),
                    'total' => $services->total(),
                    'per_page' => $services->perPage(),
                ],
            ]);
        } catch (\Throwable $e) {
            \Log::error('ServiceController@index error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi lấy danh sách dịch vụ',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Show - trả về 1 service chi tiết (kèm quan hệ nếu yêu cầu)
     * Route: GET /api/services/{id}
     * Query param optional: with=appointments,...
     */
    public function show(Request $request, $id)
    {
        try {
            $with = $request->get('with');
            $query = Service::query();

            if (!empty($with)) {
                $relations = array_filter(array_map('trim', explode(',', $with)));
                if (!empty($relations)) {
                    $query = $query->with($relations);
                }
            }

            $service = $query->find($id);

            if (!$service) {
                return response()->json([
                    'success' => false,
                    'message' => 'Không tìm thấy dịch vụ',
                ], 404);
            }

            return response()->json([
                'success' => true,
                'message' => 'Chi tiết dịch vụ',
                'data' => $service,
            ]);
        } catch (\Throwable $e) {
            \Log::error('ServiceController@show error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi lấy chi tiết dịch vụ',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Store - tạo dịch vụ mới
     * Route: POST /api/services
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'description' => 'nullable|string',
                'price' => 'required|numeric|min:0',
            ]);

            // Kiểm tra trùng tên
            $exists = Service::whereRaw('LOWER(name) = ?', [strtolower($validated['name'])])->exists();
            if ($exists) {
                return response()->json([
                    'success' => false,
                    'message' => 'Tên dịch vụ đã tồn tại, vui lòng nhập tên khác!',
                ], 409);
            }

            $service = Service::create($validated);

            return response()->json([
                'success' => true,
                'message' => 'Thêm dịch vụ thành công',
                'data' => $service,
            ]);
        } catch (ValidationException $ve) {
            return response()->json([
                'success' => false,
                'message' => 'Dữ liệu không hợp lệ',
                'errors' => $ve->errors(),
            ], 422);
        } catch (\Throwable $e) {
            \Log::error('ServiceController@store error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi thêm dịch vụ',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update - cập nhật dịch vụ
     * Route: PUT /api/services/{id}
     */
    public function update(Request $request, $id)
    {
        try {
            $service = Service::find($id);
            if (!$service) {
                return response()->json(['success' => false, 'message' => 'Không tìm thấy dịch vụ'], 404);
            }

            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'description' => 'nullable|string',
                'price' => 'required|numeric|min:0',
            ]);

            $exists = Service::whereRaw('LOWER(name) = ?', [strtolower($validated['name'])])
                ->where('id', '<>', $id)
                ->exists();
            if ($exists) {
                return response()->json([
                    'success' => false,
                    'message' => 'Tên dịch vụ đã tồn tại, vui lòng chọn tên khác!',
                ], 409);
            }

            $service->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Cập nhật dịch vụ thành công',
                'data' => $service,
            ]);
        } catch (ValidationException $ve) {
            return response()->json([
                'success' => false,
                'message' => 'Dữ liệu không hợp lệ',
                'errors' => $ve->errors(),
            ], 422);
        } catch (\Throwable $e) {
            \Log::error('ServiceController@update error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi cập nhật dịch vụ',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Destroy - xóa dịch vụ
     * Route: DELETE /api/services/{id}
     */
    public function destroy($id)
    {
        try {
            $service = Service::find($id);
            if (!$service) {
                return response()->json(['success' => false, 'message' => 'Không tìm thấy dịch vụ'], 404);
            }

            // Nếu bạn cần kiểm tra ràng buộc (ví dụ có appointments) -> xử lý ở đây
            // if ($service->appointments()->exists()) { ... }
            if ($service->appointments()->exists()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Không thể xóa dịch vụ vì đang có lịch hẹn liên quan!',
                ], 409);
            }

            $service->delete();

            return response()->json([
                'success' => true,
                'message' => 'Xóa dịch vụ thành công',
            ]);
        } catch (\Throwable $e) {
            \Log::error('ServiceController@destroy error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi xóa dịch vụ',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
