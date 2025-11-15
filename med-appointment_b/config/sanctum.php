<?php

use Laravel\Sanctum\Sanctum;

return [

    /*
    |--------------------------------------------------------------------------
    | Stateful Domains
    |--------------------------------------------------------------------------
    |
    | Các domain / host sau sẽ được coi là "stateful", nghĩa là
    | các request từ đó sẽ nhận được cookie xác thực của Sanctum.
    |
    | ⚙️ Dành cho môi trường local:
    | - BE chạy ở 127.0.0.1:8000
    | - FE chạy ở localhost:5173
    |
    | Việc liệt kê cả localhost & 127.0.0.1 là bắt buộc
    | để tránh lỗi cookie không khớp domain.
    |
    | ⚠️ Nếu bạn deploy lên server thật, hãy thay dòng dưới bằng:
    | 'yourdomain.com,www.yourdomain.com'
    |
    */

    'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS',
        'localhost,127.0.0.1,localhost:5173,127.0.0.1:5173'
    )),

    /*
    |--------------------------------------------------------------------------
    | Sanctum Guards
    |--------------------------------------------------------------------------
    |
    | Danh sách các guard Sanctum sẽ dùng để xác thực người dùng.
    | Mặc định là "web", tương ứng với session/cookie.
    | Nếu bạn sử dụng API token thủ công, vẫn giữ nguyên "web" để tránh lỗi.
    |
    */

    'guard' => ['web'],

    /*
    |--------------------------------------------------------------------------
    | Expiration Minutes
    |--------------------------------------------------------------------------
    |
    | Thời gian sống của token (phút).
    | Nếu để null => token sẽ không tự hết hạn (phù hợp cho môi trường dev).
    |
    | 👉 Khi deploy production, bạn có thể đổi thành 43200 (30 ngày)
    | để người dùng đăng nhập lâu dài mà vẫn an toàn.
    |
    */

    'expiration' => env('SANCTUM_EXPIRATION', null), // ✅ Không tự hết hạn khi dev local

    /*
    |--------------------------------------------------------------------------
    | Token Prefix
    |--------------------------------------------------------------------------
    |
    | Tiền tố thêm vào trước các token cá nhân (optional).
    | Có thể đặt ENV SANCTUM_TOKEN_PREFIX trong .env nếu muốn.
    |
    */

    'token_prefix' => env('SANCTUM_TOKEN_PREFIX', ''),

    /*
    |--------------------------------------------------------------------------
    | Sanctum Middleware
    |--------------------------------------------------------------------------
    |
    | Các middleware mà Sanctum sử dụng khi xử lý request.
    | KHÔNG nên sửa trừ khi bạn hiểu rõ mục đích.
    |
    */

    'middleware' => [
        'authenticate_session' => Laravel\Sanctum\Http\Middleware\AuthenticateSession::class,
        'encrypt_cookies' => Illuminate\Cookie\Middleware\EncryptCookies::class,
        'validate_csrf_token' => Illuminate\Foundation\Http\Middleware\ValidateCsrfToken::class,
    ],

    /*
    |--------------------------------------------------------------------------
    | Personal Access Token Model
    |--------------------------------------------------------------------------
    |
    | Đây là model được Sanctum sử dụng cho token cá nhân.
    | Mặc định là model của Sanctum, không cần đổi trong hầu hết trường hợp.
    |
    */

    'personal_access_token_model' => Laravel\Sanctum\PersonalAccessToken::class,
];