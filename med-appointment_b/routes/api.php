<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\Api\ChangePasswordController;


Route::get('/test', function () {
    return response()->json(['message' => 'Hello API']);
});

// Chức Năng Đăng kÝ
Route::post('/register', [UserController::class, 'register']);
Route::post('/login', [UserController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/profile', [UserController::class, 'profile']);
    Route::post('/logout', [UserController::class, 'logout']);
});

// chức năng đăng nhập
Route::post('/login', [UserController::class, 'login']);

// chức năng đổi mật khẩu        
Route::middleware('auth:sanctum')->post('/change-password', [UserController::class, 'changePassword']);