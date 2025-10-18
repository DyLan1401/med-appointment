<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
<<<<<<< HEAD
use Illuminate\Support\Facades\Storage;
=======
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
>>>>>>> DinhThanhToan-DangNhap

class UserController extends Controller
{
    /**
<<<<<<< HEAD
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
=======
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
>>>>>>> DinhThanhToan-DangNhap
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
}

    /**
     * 🧩 Kiểm tra chuỗi có phải URL đầy đủ hay không
     */
    private function isFullUrl($path)
    {
        return filter_var($path, FILTER_VALIDATE_URL) !== false;
    }
}