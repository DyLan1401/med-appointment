<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | File này cấu hình CORS để cho phép Frontend (React/Vite)
    | truy cập vào API Laravel an toàn và hợp lệ.
    |
    | Bao gồm:
    | - Cookie xác thực của Sanctum
    | - Laravel Echo (Realtime)
    | - Các route /api/*
    |
    */

    /*
    |--------------------------------------------------------------------------
    | Paths
    |--------------------------------------------------------------------------
    |
    | Những endpoint nào được phép xử lý CORS.
    | ⚠️ Bắt buộc thêm sanctum/csrf-cookie để Sanctum hoạt động.
    |
    */
    'paths' => [
        'api/*',                  // ✅ Toàn bộ API Laravel
        'sanctum/csrf-cookie',    // ✅ Bắt buộc cho Laravel Sanctum
        'broadcasting/auth',      // ✅ Laravel Echo cần xác thực channel
        'login',                  // ✅ Route login
        'logout',                 // ✅ Route logout
        'register',               // ✅ Route register (nếu có)
    ],

    /*
    |--------------------------------------------------------------------------
    | Allowed Methods
    |--------------------------------------------------------------------------
    |
    | Cho phép tất cả các phương thức HTTP (GET, POST, PUT, PATCH, DELETE...).
    |
    */
    'allowed_methods' => ['*'],

    /*
    |--------------------------------------------------------------------------
    | Allowed Origins
    |--------------------------------------------------------------------------
    |
    | Các domain Frontend được phép gửi request tới API.
    | ⚠️ Nên có cả localhost & 127.0.0.1 để cookie hoạt động chính xác.
    |
    | 👉 Khi deploy thật, hãy cập nhật domain FE vào đây.
    | Ví dụ:
    | 'https://myapp.com', 'https://www.myapp.com'
    |
    */
    'allowed_origins' => [
        'http://localhost:5173',   // ✅ FE React/Vite (localhost)
        'http://127.0.0.1:5173',   // ✅ FE React/Vite (IP local)
    ],

    /*
    |--------------------------------------------------------------------------
    | Allowed Origins Patterns
    |--------------------------------------------------------------------------
    |
    | Dùng khi bạn muốn match nhiều origin bằng wildcard (VD: *.myapp.com)
    | Để trống khi bạn chỉ cần khai báo cụ thể từng domain ở trên.
    |
    */
    'allowed_origins_patterns' => [],

    /*
    |--------------------------------------------------------------------------
    | Allowed Headers
    |--------------------------------------------------------------------------
    |
    | Cho phép tất cả header từ phía client (Authorization, X-CSRF-TOKEN, ...)
    |
    */
    'allowed_headers' => ['*'],

    /*
    |--------------------------------------------------------------------------
    | Exposed Headers
    |--------------------------------------------------------------------------
    |
    | Nếu bạn cần cho phép trình duyệt đọc một số header cụ thể.
    | Mặc định để trống (đa số không cần thiết).
    |
    */
    'exposed_headers' => [],

    /*
    |--------------------------------------------------------------------------
    | Max Age
    |--------------------------------------------------------------------------
    |
    | Thời gian cache CORS preflight (OPTIONS) trên trình duyệt (tính bằng giây).
    | Đặt 0 trong môi trường dev để dễ test thay đổi CORS.
    |
    */
    'max_age' => 0,

    /*
    |--------------------------------------------------------------------------
    | Supports Credentials
    |--------------------------------------------------------------------------
    |
    | Cho phép gửi cookie (và Authorization header) trong các request CORS.
    | ⚠️ BẮT BUỘC phải bật nếu dùng Laravel Sanctum.
    |
    | Nếu bạn chỉ dùng API token (không cookie) thì có thể tắt = false.
    |
    */
    'supports_credentials' => true,
];