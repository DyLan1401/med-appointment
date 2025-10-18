<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
<<<<<<< HEAD
use App\Http\Controllers\DoctorController;

use App\Http\Controllers\PatientController;

use App\Http\Controllers\UserController;


// Route test

use App\Http\Controllers\DepartmentController;
=======
use App\Http\Controllers\UserController;
>>>>>>> DinhThanhToan-DangNhap


Route::get('/test', function () {
    return response()->json(['message' => 'Hello API']);
});

<<<<<<< HEAD

Route::apiResource('patients', PatientController::class);

Route::apiResource('users', UserController::class);


Route::get('/departments', [DepartmentController::class, 'index']);
Route::get('/departments/search', [DepartmentController::class, 'search']);
Route::apiResource('departments', DepartmentController::class);


Route::get('/doctors', [DoctorController::class, 'index']);
Route::post('/doctors', [DoctorController::class, 'store']);
Route::put('/doctors/{id}', [DoctorController::class, 'update']);
Route::delete('/doctors/{id}', [DoctorController::class, 'destroy']);
=======
// Chức Năng Đăng kÝ
Route::post('/register', [UserController::class, 'register']);
Route::post('/login', [UserController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/profile', [UserController::class, 'profile']);
    Route::post('/logout', [UserController::class, 'logout']);
});

// chức năng đăng nhập
Route::post('/login', [UserController::class, 'login']);
>>>>>>> DinhThanhToan-DangNhap
