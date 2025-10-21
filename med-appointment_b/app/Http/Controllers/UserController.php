<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
class UserController extends Controller
{
    /**
     * ✅ Lấy danh sách user (phân trang + tìm kiếm)
     */
    public function index(Request $request)
    {
        $search = $request->query('search');
        $query = User::query();

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $users = $query->orderBy('id', 'asc')->paginate(5);

        // Thêm URL đầy đủ cho avatar
        $users->getCollection()->transform(function ($user) {
            $user->avatar_url = $this->getAvatarUrl($user->avatar);
            return $user;
        });

        return response()->json($users);
    }

    /**
     * ✅ Thêm user mới
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:100',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:6',
            'role' => 'required|in:user,doctor,admin',
            'phone' => 'nullable|string|max:20',
            'insurance_info' => 'nullable|string',
            'avatar' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        // 🖼️ Lưu ảnh nếu có
        if ($request->hasFile('avatar')) {
            $data['avatar'] = $request->file('avatar')->store('avatars', 'public');
        }

        // 🔒 Mã hóa mật khẩu
        $data['password'] = bcrypt($data['password']);

        $user = User::create($data);
        $user->avatar_url = $this->getAvatarUrl($user->avatar);

        return response()->json($user, 201);
    }

    /**
     * ✅ Lấy chi tiết user theo ID
     */
    public function show($id)
    {
        $user = User::findOrFail($id);
        $user->avatar_url = $this->getAvatarUrl($user->avatar);

        return response()->json($user);
    }

    /**
     * ✅ Cập nhật user theo ID
     */
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $data = $request->validate([
            'name' => 'required|string|max:100',
            'email' => "required|email|unique:users,email,{$user->id}",
            'role' => 'required|in:user,doctor,admin',
            'phone' => 'nullable|string|max:20',
            'insurance_info' => 'nullable|string',
            'avatar' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        // 🖼️ Nếu có upload avatar mới
        if ($request->hasFile('avatar')) {
            if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
                Storage::disk('public')->delete($user->avatar);
            }

            $data['avatar'] = $request->file('avatar')->store('avatars', 'public');
        }

        $user->update($data);
        $user->avatar_url = $this->getAvatarUrl($user->avatar);

        return response()->json($user);
    }

    /**
     * ✅ Xóa user theo ID
     */
    public function destroy($id)
    {
        $user = User::findOrFail($id);

        if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
            Storage::disk('public')->delete($user->avatar);
        }

        $user->delete();

        return response()->json(['message' => 'Xóa thành công']);
    }

    /**
     * 🧩 Hàm helper xử lý URL ảnh
     */
    private function getAvatarUrl($path)
{
    // Nếu không có ảnh -> trả về ảnh mặc định (không thêm 'storage/')
    if (!$path) {
        return asset('images/default-avatar.png');
    }

 
    // Nếu là URL đầy đủ thì trả nguyên
    if ($this->isFullUrl($path)) {
        return $path;
    }

    // Nếu ảnh nằm trong thư mục storage (được lưu bằng store('avatars', 'public'))
    if (str_starts_with($path, 'avatars/')) {
        return asset('storage/' . $path);
    }

    // Nếu ảnh nằm trong thư mục images (như ảnh mặc định)
    if (str_starts_with($path, 'images/')) {
        return asset($path);
    }

    // Trường hợp khác
    return asset('storage/' . ltrim($path, '/'));

        /**
     * 🟢 API Đổi mật khẩu người dùng
     * Yêu cầu: người dùng phải đăng nhập (có token Sanctum)
     */
   
}

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



/**
     * 🧩 Kiểm tra chuỗi có phải URL đầy đủ hay không
     */
    private function isFullUrl($path)
    {
        return filter_var($path, FILTER_VALIDATE_URL) !== false;
    }
    
}