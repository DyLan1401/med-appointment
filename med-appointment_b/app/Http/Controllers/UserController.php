<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class UserController extends Controller
{
    /**
     * 🟢 API Đăng ký tài khoản mới
     */
    public function register(Request $request)
    {
        try {
            // Validate dữ liệu đầu vào
            $request->validate([
                'name' => 'required|string|max:100',
                'email' => 'required|email|unique:users,email',
                'password' => 'required|string|min:6',
            ]);

            // Tạo user mới
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => 'user', // mặc định role = user
            ]);

            // Tạo token đăng nhập (nếu dùng Sanctum)
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'success' => true,
                'message' => 'Đăng ký thành công!',
                'user' => $user,
                'token' => $token,
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Đăng ký thất bại!',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * 🟢 API Đăng nhập
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string|min:6',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Email hoặc mật khẩu không chính xác!',
            ], 401);
        }

        // Tạo token mới
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Đăng nhập thành công!',
            'user' => $user,
            'token' => $token,
        ]);
    }

    /**
     * 🟢 API Đăng xuất
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Đăng xuất thành công!',
        ]);
    }

    /**
     * 🟢 API Lấy thông tin người dùng hiện tại
     */
    public function profile(Request $request)
    {
        return response()->json([
            'success' => true,
            'user' => $request->user(),
        ]);
    }

    // ===============================
    // Các hàm resource mặc định
    // ===============================

    public function index()
    {
        return response()->json(User::all());
    }

    public function show($id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'Không tìm thấy user!'], 404);
        }
        return response()->json($user);
    }

    public function update(Request $request, $id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'Không tìm thấy user!'], 404);
        }

        $user->update($request->only(['name', 'email', 'phone', 'avatar_url']));
        return response()->json(['message' => 'Cập nhật thành công!', 'user' => $user]);
    }

    public function destroy($id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'Không tìm thấy user!'], 404);
        }

        $user->delete();
        return response()->json(['message' => 'Xóa user thành công!']);
    }

    // 🧩 THÊM MỚI: xử lý lỗi xác thực / token
    public function unauthorized()
    {
        return response()->json([
            'success' => false,
            'message' => 'Bạn chưa đăng nhập hoặc token không hợp lệ!',
        ], 401);
    }

        /**
     * 🟢 API Đổi mật khẩu người dùng
     * Yêu cầu: người dùng phải đăng nhập (có token Sanctum)
     */
    public function changePassword(Request $request)
    {
        try {
            // Xác thực dữ liệu đầu vào
            $request->validate([
                'current_password' => 'required|string|min:6',
                'new_password' => 'required|string|min:6|confirmed', // cần có field new_password_confirmation
            ]);

            $user = $request->user(); // Lấy user hiện tại từ token

            // Kiểm tra mật khẩu hiện tại có đúng không
            if (!Hash::check($request->current_password, $user->password)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Mật khẩu hiện tại không chính xác!',
                ], 400);
            }

            // Cập nhật mật khẩu mới
            $user->password = Hash::make($request->new_password);
            $user->save();

            return response()->json([
                'success' => true,
                'message' => 'Đổi mật khẩu thành công!',
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Dữ liệu không hợp lệ!',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Đổi mật khẩu thất bại!',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

}
