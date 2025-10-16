<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
<<<<<<< HEAD
use App\Http\Controllers\PatientController;
=======
use App\Http\Controllers\UserController;
>>>>>>> origin/DangThanhPhong-QuanLyUser

// Route test
Route::get('/test', function () {
    return response()->json(['message' => 'Hello API']);
});

<<<<<<< HEAD
// Quản lý bệnh nhân (CRUD)
Route::apiResource('patients', PatientController::class);
=======
// CRUD User
Route::apiResource('users', UserController::class);
>>>>>>> origin/DangThanhPhong-QuanLyUser
