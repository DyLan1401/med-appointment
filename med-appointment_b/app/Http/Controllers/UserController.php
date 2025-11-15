<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;

use App\Mail\SendOtpMail;
use App\Models\UserOtp;
use Carbon\Carbon;
use App\Models\PendingUser;

class UserController extends Controller
{
    // ======================================================
    // USER CRUD
    // ======================================================

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


    // ======================================================
    // LOGIN (WEB)
    // ======================================================

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

        Auth::login($user, true);

        return response()->json([
            'success' => true,
            'message' => 'Đăng nhập thành công!',
            'user' => $user,
            'role' => $user->role,
        ]);
    }


    // ======================================================
    // TOKEN LOGIN (API + FE React) — FIX specialization → department
    // ======================================================

    public function tokenLogin(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string|min:6',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $request->password)) {
            return response()->json(['message' => 'Email hoặc mật khẩu không đúng'], 401);
        }

        // Xóa token cũ để tránh tràn
        $user->tokens()->delete();

        // Load thông tin bác sĩ + specialization
        $doctor = null;

        if ($user->role === 'doctor') {
            $user->load(['doctor.specialization']);

            $doctorModel = $user->doctor;

            $doctor = [
                'id' => $doctorModel->id ?? null,

                // ⭐ FIX CHÍNH — convert specialization → department
                'department_id' => $doctorModel->specialization_id ?? null,
                'department_name' => $doctorModel->specialization->name ?? "Không xác định",
            ];
        }

        // Tạo token FE
        $token = $user->createToken('frontend')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Đăng nhập thành công!',
            'user' => $user,
            'doctor' => $doctor,
            'token' => $token,
        ]);
    }


    public function tokenLogout(Request $request)
    {
        $request->user()->tokens()->delete();
        return response()->json(['message' => 'Đăng xuất thành công!']);
    }

    public function tokenUser(Request $request)
    {
        $user = $request->user();
        $user->load('doctor.specialization');

        if ($user->doctor) {
            $user->doctor->department_id = $user->doctor->specialization_id;
            $user->doctor->department_name = $user->doctor->specialization->name ?? "Không xác định";
        }

        return response()->json(['user' => $user]);
    }


    // ======================================================
    // OTP / RESET PASSWORD
    // ======================================================

    public function forgotPassword(Request $request)
    {
        $request->validate(['email' => 'required|email']);
        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'Email không tồn tại trong hệ thống'], 404);
        }

        $newPassword = Str::random(10);
        $user->password = Hash::make($newPassword);
        $user->save();

        Mail::raw("Mật khẩu mới của bạn là: {$newPassword}", function ($message) use ($user) {
            $message->to($user->email)->subject('Cấp lại mật khẩu mới');
        });

        return response()->json(['message' => 'Mật khẩu mới đã được gửi đến email của bạn']);
    }

    public function sendOtp(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:6',
        ]);

        $otp = rand(100000, 999999);

        UserOtp::updateOrCreate(
            ['email' => $request->email],
            ['otp' => $otp, 'expires_at' => Carbon::now()->addMinutes(5)]
        );

        Mail::to($request->email)->send(new SendOtpMail($otp));

        PendingUser::updateOrCreate(
            ['email' => $request->email],
            [
                'name' => $request->name,
                'password' => Hash::make($request->password)
            ]
        );

        return response()->json(['message' => 'OTP đã được gửi đến email của bạn']);
    }

    public function verifyOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'otp' => 'required'
        ]);

        $record = UserOtp::where('email', $request->email)
            ->where('otp', $request->otp)
            ->where('expires_at', '>', now())
            ->first();

        if (!$record) {
            return response()->json(['message' => 'OTP không hợp lệ hoặc đã hết hạn'], 400);
        }

        $pending = PendingUser::where('email', $request->email)->first();
        if (!$pending) {
            return response()->json(['message' => 'Không tìm thấy thông tin đăng ký'], 400);
        }

        User::create([
            'name' => $pending->name,
            'email' => $pending->email,
            'password' => $pending->password,
        ]);

        $record->delete();
        $pending->delete();

        return response()->json([
            'success' => true,
            'message' => 'Đăng ký thành công! Tài khoản của bạn đã được kích hoạt.'
        ], 201);
    }


    // ======================================================
    // HELPER
    // ======================================================

    private function getAvatarUrl($path)
    {
        if (!$path) return asset('images/default-avatar.png');
        if ($this->isFullUrl($path)) return $path;
        if (str_starts_with($path, 'avatars/')) return asset('storage/' . $path);
        if (str_starts_with($path, 'images/')) return asset($path);
        return asset('storage/' . ltrim($path, '/'));
    }

    private function isFullUrl($path)
    {
        return filter_var($path, FILTER_VALIDATE_URL) !== false;
    }

    public function unauthorized()
    {
        return response()->json([
            'success' => false,
            'message' => 'Bạn chưa đăng nhập hoặc phiên đã hết hạn!',
        ], 401);
    }

    public function me(Request $request)
    {
        return response()->json($request->user());
    }

    public function getUserById($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        return response()->json($user);
    }
}