<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Authentication Defaults
    |--------------------------------------------------------------------------
    */

    'defaults' => [
        'guard' => env('AUTH_GUARD', 'web'),
        'passwords' => env('AUTH_PASSWORD_BROKER', 'users'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Authentication Guards
    |--------------------------------------------------------------------------
    */

    'guards' => [

        // Guard người dùng bình thường
        'web' => [
            'driver' => 'session',
            'provider' => 'users',
        ],

        // API cho user
        'api' => [
            'driver' => 'sanctum',
            'provider' => 'users',
        ],

        // 🚀 Guard mới cho Doctor
        'doctor' => [
            'driver' => 'sanctum',
            'provider' => 'doctors',
        ],

        // (Nếu có dùng admin)
        // 'admin' => [
        //     'driver' => 'sanctum',
        //     'provider' => 'admins',
        // ],
    ],

    /*
    |--------------------------------------------------------------------------
    | User Providers
    |--------------------------------------------------------------------------
    */

    'providers' => [

        // Provider User
        'users' => [
            'driver' => 'eloquent',
            'model' => App\Models\User::class,
        ],

        // 🚀 Provider Doctor – QUAN TRỌNG
        'doctors' => [
            'driver' => 'eloquent',
            'model' => App\Models\Doctor::class,
        ],

        // Nếu bạn có admin model
        // 'admins' => [
        //     'driver' => 'eloquent',
        //     'model' => App\Models\Admin::class,
        // ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Password Resetting
    |--------------------------------------------------------------------------
    */

    'passwords' => [

        // reset password user
        'users' => [
            'provider' => 'users',
            'table' => 'password_reset_tokens',
            'expire' => 60,
            'throttle' => 60,
        ],

        // reset password doctor (nếu cần)
        // 'doctors' => [
        //     'provider' => 'doctors',
        //     'table' => 'password_reset_tokens_doctor',
        //     'expire' => 60,
        //     'throttle' => 60,
        // ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Password Confirmation Timeout
    |--------------------------------------------------------------------------
    */

    'password_timeout' => 10800,

];