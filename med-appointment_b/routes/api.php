<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\DoctorController;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\DepartmentController;

Route::get('/test', fn() => response()->json(['message' => 'API đang hoạt động! ✅']));

//   DOCTORS (CRUD + PROFILE + AVATAR + CERTIFICATES)
Route::prefix('doctors')->group(function () {

    // ---- CRUD ----
    Route::get('/', [DoctorController::class, 'index']);            
    Route::post('/', [DoctorController::class, 'store']);            
    Route::put('/{id}', [DoctorController::class, 'update']);        
    Route::delete('/{id}', [DoctorController::class, 'destroy']);    

    // ---- Hồ sơ bác sĩ ----
    Route::get('/{doctor_id}/profile', [DoctorController::class, 'showProfile']);    
    Route::post('/{doctor_id}/profile', [DoctorController::class, 'updateProfile']); 

    // ---- Upload ảnh đại diện ----
    Route::post('/{doctor_id}/avatar', [DoctorController::class, 'uploadAvatar']);   

    // ---- Upload & quản lý chứng chỉ ----
    Route::get('/{doctor_id}/certificates', [DoctorController::class, 'getCertificates']);     
    Route::post('/{doctor_id}/certificates', [DoctorController::class, 'uploadCertificate']);  
    Route::delete('/certificates/{id}', [DoctorController::class, 'deleteCertificate']);        
});

//   USERS (CRUD + PROFILE + CERTIFICATES)

Route::apiResource('users', UserController::class);

// Hồ sơ người dùng
Route::get('/users/{id}/profile', [UserController::class, 'showProfile']);     
Route::post('/users/{id}/profile', [UserController::class, 'updateProfile']);  

// Upload & quản lý chứng chỉ cho user (nếu có)
Route::get('/users/{id}/certificates', [UserController::class, 'getCertificates']);    
Route::post('/users/{id}/certificates', [UserController::class, 'uploadCertificate']); 
Route::delete('/users/certificates/{id}', [UserController::class, 'deleteCertificate']); 

//   PATIENTS (CRUD)

Route::apiResource('patients', PatientController::class);

//   DEPARTMENTS (CRUD + SEARCH)

Route::get('/departments/search', [DepartmentController::class, 'search']);   // GET /api/departments/search
Route::apiResource('departments', DepartmentController::class);