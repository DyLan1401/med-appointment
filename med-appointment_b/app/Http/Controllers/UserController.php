<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Doctor;
use App\Models\DoctorCertificate;
use Illuminate\Http\Request;
<<<<<<< HEAD
use Illuminate\Support\Facades\Storage;
<<<<<<< HEAD
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
=======
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    // ============================================================
    // ✅ CRUD USER
    // ============================================================

>>>>>>> origin/master
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

        if ($request->hasFile('avatar')) {
            $data['avatar'] = $request->file('avatar')->store('avatars', 'public');
        }

        $data['password'] = bcrypt($data['password']);
        $user = User::create($data);
        $user->avatar_url = $this->getAvatarUrl($user->avatar);

        return response()->json($user, 201);
    }

    public function show($id)
    {
        $user = User::findOrFail($id);
        $user->avatar_url = $this->getAvatarUrl($user->avatar);

        return response()->json($user);
    }

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

    public function destroy($id)
    {
        $user = User::findOrFail($id);

        if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
            Storage::disk('public')->delete($user->avatar);
        }

        $user->delete();

        return response()->json(['message' => 'Xóa thành công']);
    }

    // ============================================================
    // ✅ PROFILE (XEM + CẬP NHẬT)
    // ============================================================

    public function showProfile($user_id)
    {
        $user = User::find($user_id);
        if (!$user) {
            return response()->json(['message' => 'Không tìm thấy người dùng'], 404);
        }

        $user->avatar_url = $this->getAvatarUrl($user->avatar);

        // Nếu là bác sĩ thì lấy thêm thông tin Doctor + chứng chỉ
        if ($user->role === 'doctor') {
            $doctor = Doctor::with(['specialization', 'certificates'])
                ->where('user_id', $user->id)
                ->first();

            if ($doctor) {
                $doctor->user = $user;
                foreach ($doctor->certificates as $cert) {
                    $cert->file_url = $cert->image ? asset('storage/' . $cert->image) : null;
                }
                return response()->json($doctor);
            }
        }

        // Nếu không phải bác sĩ thì trả về user bình thường
        return response()->json($user);
    }

    public function updateProfile(Request $request, $user_id)
    {
        $user = User::findOrFail($user_id);

        $request->validate([
            'name' => 'required|string|max:100',
            'email' => "required|email|unique:users,email,{$user->id}",
            'phone' => 'nullable|string|max:20',
            'insurance_info' => 'nullable|string',
            'avatar' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        if ($request->hasFile('avatar')) {
            if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
                Storage::disk('public')->delete($user->avatar);
            }

            $user->avatar = $request->file('avatar')->store('avatars', 'public');
        }

        $user->update([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'insurance_info' => $request->insurance_info,
        ]);

        $user->avatar_url = $this->getAvatarUrl($user->avatar);

        return response()->json([
            'message' => 'Cập nhật hồ sơ thành công!',
            'user' => $user,
        ]);
    }

    // ============================================================
    // ✅ UPLOAD CHỨNG CHỈ (DÀNH CHO BÁC SĨ)
    // ============================================================

    public function uploadCertificate(Request $request, $user_id)
    {
        $user = User::findOrFail($user_id);

        if ($user->role !== 'doctor') {
            return response()->json(['message' => 'Người dùng này không phải bác sĩ'], 403);
        }

        $doctor = Doctor::where('user_id', $user->id)->firstOrFail();

        $request->validate([
            'certificate_name' => 'required|string|max:255',
            'certificate_type' => 'required|string|max:50',
            'file' => 'required|file|mimes:jpg,jpeg,png,pdf|max:5120',
        ]);

        $path = $request->file('file')->store('certificates', 'public');

        $certificate = DoctorCertificate::create([
            'doctor_id' => $doctor->id,
            'certificate_name' => $request->certificate_name,
            'certificate_type' => $request->certificate_type,
            'image' => $path,
        ]);

        return response()->json([
            'message' => 'Upload chứng chỉ thành công!',
            'certificate' => [
                'id' => $certificate->id,
                'certificate_name' => $certificate->certificate_name,
                'certificate_type' => $certificate->certificate_type,
                'file_url' => asset('storage/' . $path),
            ],
        ], 201);
    }

    public function getCertificates($user_id)
    {
        $user = User::findOrFail($user_id);
        if ($user->role !== 'doctor') {
            return response()->json(['message' => 'Người dùng này không phải bác sĩ'], 403);
        }

        $doctor = Doctor::where('user_id', $user->id)->firstOrFail();
        $certificates = DoctorCertificate::where('doctor_id', $doctor->id)->get();

        foreach ($certificates as $c) {
            $c->file_url = asset('storage/' . $c->image);
        }

        return response()->json($certificates);
    }

    public function deleteCertificate($certificate_id)
    {
        $certificate = DoctorCertificate::findOrFail($certificate_id);

        if ($certificate->image && Storage::disk('public')->exists($certificate->image)) {
            Storage::disk('public')->delete($certificate->image);
        }

        $certificate->delete();

        return response()->json(['message' => 'Xóa chứng chỉ thành công!']);
    }

    // ============================================================
    // ✅ HELPER: XỬ LÝ LINK ẢNH
    // ============================================================

    private function getAvatarUrl($path)
<<<<<<< HEAD
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
=======
    {
        if (!$path) {
            return asset('images/default-avatar.png');
        }

        if ($this->isFullUrl($path)) {
            return $path;
        }

        if (str_starts_with($path, 'avatars/')) {
            return asset('storage/' . $path);
        }

        if (str_starts_with($path, 'images/')) {
            return asset($path);
        }

        return asset('storage/' . ltrim($path, '/'));
>>>>>>> origin/master
    }

    private function isFullUrl($path)
    {
        return filter_var($path, FILTER_VALIDATE_URL) !== false;
    }
}