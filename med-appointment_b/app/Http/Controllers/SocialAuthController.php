<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class SocialAuthController extends Controller
{
    // B1: Redirect người dùng đến Google OAuth
    public function redirectToGoogle()
    {
        return Socialite::driver('google')->stateless()->redirect();
    }

    // B2: Nhận callback từ Google
    public function handleGoogleCallback()
    {
        try {
            $googleUser = Socialite::driver('google')->stateless()->user();
        } catch (\Exception $e) {
            return response()->json(['error' => 'Lỗi khi lấy thông tin từ Google'], 400);
        }

        // Kiểm tra thông tin
        if (!$googleUser || !$googleUser->getEmail()) {
            return response()->json(['error' => 'Không thể lấy email người dùng từ Google'], 400);
        }

        // Tìm user đã có hoặc tạo mới
        $user = User::where('email', $googleUser->getEmail())->first();

        if (!$user) {
            $user = User::create([
                'name' => $googleUser->getName(),
                'email' => $googleUser->getEmail(),
                'google_id' => $googleUser->getId(),
                'password' => bcrypt(Str::random(16)), // tạo mật khẩu tạm
            ]);
        } else {
            if (empty($user->google_id)) {
                $user->update(['google_id' => $googleUser->getId()]);
            }
        }

        // Tạo token đăng nhập
        $token = $user->createToken('auth_token')->plainTextToken;

        // Redirect về React app kèm token (để React tự lưu vào localStorage)
        return redirect("http://localhost:5173/login?token={$token}");
    }


    // Redirect tới Facebook
    public function redirectToFacebook()
    {
        return Socialite::driver('facebook')->stateless()->redirect();
    }

    public function handleFacebookCallback()
    {
        try {
            $facebookUser = Socialite::driver('facebook')->stateless()->user();

            // Tìm user theo email hoặc facebook_id
            $user = User::where('email', $facebookUser->getEmail())
                ->orWhere('facebook_id', $facebookUser->getId())
                ->first();

            if (!$user) {
                // Tạo user mới nếu chưa có
                $user = User::create([
                    'name' => $facebookUser->getName(),
                    'email' => $facebookUser->getEmail(),
                    'facebook_id' => $facebookUser->getId(),
                    'password' => bcrypt(Str::random(16)), // random mật khẩu
                ]);
            } else {
                // Nếu có user nhưng chưa lưu facebook_id, thì cập nhật
                if (empty($user->facebook_id)) {
                    $user->update(['facebook_id' => $facebookUser->getId()]);
                }
            }

            // Tạo token đăng nhập
            $token = $user->createToken('auth_token')->plainTextToken;

            // Redirect về frontend (React)
            return redirect()->away("http://localhost:5173/login?token={$token}");

        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

}
