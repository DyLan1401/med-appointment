<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Default Broadcaster
    |--------------------------------------------------------------------------
    |
    | Laravel hỗ trợ nhiều driver broadcast khác nhau: "pusher", "redis",
    | "log", "null". Bạn có thể đổi mặc định bằng cách chỉnh trong .env
    | (BROADCAST_DRIVER).
    |
    */

    'default' => env('BROADCAST_DRIVER', 'pusher'), // ✅ Đổi mặc định từ 'log' sang 'pusher' để realtime hoạt động

    /*
    |--------------------------------------------------------------------------
    | Broadcast Connections
    |--------------------------------------------------------------------------
    |
    | Đây là cấu hình cho từng kết nối broadcast.
    | Khi bạn dùng Laravel Echo Server (giả lập Pusher) thì sẽ dùng "pusher".
    |
    */

    'connections' => [

        // ==========================================================
        // 📡 PUSHER / LARAVEL ECHO SERVER (Realtime)
        // ==========================================================
        'pusher' => [
            'driver' => 'pusher',
            'key' => env('PUSHER_APP_KEY', 'local'),          // ✅ Thêm default 'local' để không lỗi khi thiếu .env
            'secret' => env('PUSHER_APP_SECRET', 'local'),
            'app_id' => env('PUSHER_APP_ID', 'local'),
            'options' => [
                // ⚙️ Cấu hình Pusher dùng local Echo Server
                'cluster' => env('PUSHER_APP_CLUSTER', 'mt1'),
                'useTLS' => false, // ⚠️ false vì bạn đang dùng HTTP local
                'host' => env('PUSHER_HOST', '127.0.0.1'),
                'port' => env('PUSHER_PORT', 6001),
                'scheme' => env('PUSHER_SCHEME', 'http'),
                'encrypted' => false, // ✅ thêm để đảm bảo không mã hóa
            ],
        ],

        // ==========================================================
        // 🧠 REDIS (phục vụ cho Queue hoặc Cache)
        // ==========================================================
        'redis' => [
            'driver' => 'redis',
            'connection' => 'default',
        ],

        // ==========================================================
        // 🪵 LOG (ghi log event, dùng khi dev không realtime)
        // ==========================================================
        'log' => [
            'driver' => 'log',
        ],

        // ==========================================================
        // 🚫 NULL (vô hiệu hóa broadcast)
        // ==========================================================
        'null' => [
            'driver' => 'null',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Mặc định fallback cho môi trường local
    |--------------------------------------------------------------------------
    |
    | Dòng này không có trong bản mặc định của Laravel, mình thêm để khi
    | bạn quên cấu hình .env thì Laravel vẫn hoạt động được với Echo Server.
    |
    */
    'local_defaults' => [
        'host' => '127.0.0.1',
        'port' => 6001,
        'scheme' => 'http',
        'key' => 'local',
        'app_id' => 'local',
        'secret' => 'local',
    ],

];  