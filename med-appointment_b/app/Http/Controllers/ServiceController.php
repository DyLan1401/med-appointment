<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ServiceController extends Controller
{
    /**
     * Lấy danh sách tất cả service
     */
    public function index()
    {
        $services = Service::all();

        return response()->json([
            'success' => true,
            'message' => 'Danh sách dịch vụ',
            'data' => $services
        ]);
    }

    /**
     * Thêm service mới
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Dữ liệu không hợp lệ',
                'errors' => $validator->errors()
            ], 422);
        }

        $service = Service::create($validator->validated());

        return response()->json([
            'success' => true,
            'message' => 'Thêm dịch vụ thành công',
            'data' => $service
        ], 201);
    }

    /**
     * Lấy chi tiết service theo ID
     */
    public function show($id)
    {
        $service = Service::find($id);

        if (!$service) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy dịch vụ'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $service
        ]);
    }

    /**
     * Cập nhật service
     */
    public function update(Request $request, $id)
    {
        $service = Service::find($id);

        if (!$service) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy dịch vụ'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'sometimes|required|numeric|min:0'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Dữ liệu không hợp lệ',
                'errors' => $validator->errors()
            ], 422);
        }

        $service->update($validator->validated());

        return response()->json([
            'success' => true,
            'message' => 'Cập nhật dịch vụ thành công',
            'data' => $service
        ]);
    }

    /**
     * Xóa service
     */
    public function destroy($id)
    {
        $service = Service::find($id);

        if (!$service) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy dịch vụ'
            ], 404);
        }

        $service->delete();

        return response()->json([
            'success' => true,
            'message' => 'Xóa dịch vụ thành công'
        ]);
    }
}
