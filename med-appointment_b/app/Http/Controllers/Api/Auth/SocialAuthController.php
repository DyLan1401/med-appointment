<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Exception;

class SocialAuthController extends Controller
{
    public function redirectToGoogle()
    {
        // Gửi URL đăng nhập Google về cho React
        $url = Socialite::driver('google')->stateless()->redirect()->getTargetUrl();
        return response()->json(['url' => $url]);
    }

    public function handleGoogleCallback()
    {
        try {
            $googleUser = Socialite::driver('google')->stateless()->user();

            $user = User::where('google_id', $googleUser->getId())
                        ->orWhere('email', $googleUser->getEmail())
                        ->first();

            if (!$user) {
                $user = User::create([
                    'name' => $googleUser->getName(),
                    'email' => $googleUser->getEmail(),
                    'google_id' => $googleUser->getId(),
                    'password' => bcrypt('123456dummy'),
                ]);
            }

            // ✅ Tạo token JWT hoặc Sanctum
            $token = $user->createToken('auth_token')->plainTextToken;

            // ✅ Redirect về frontend (React) với token
            return redirect(env('FRONTEND_URL') . '/auth/callback?token=' . $token);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
