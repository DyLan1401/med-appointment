<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DoctorController;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\AppointmentController;

use App\Http\Controllers\CategoryPostController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\Api\ChangePasswordController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\FavoriteController;

Route::apiResource('categories', CategoryPostController::class);
Route::apiResource('posts', PostController::class);

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



Route::apiResource('patients', PatientController::class);

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

Route::get('/doctors', [DoctorController::class, 'index']);
Route::post('/doctors', [DoctorController::class, 'store']);
Route::put('/doctors/{id}', [DoctorController::class, 'update']);
Route::delete('/doctors/{id}', [DoctorController::class, 'destroy']);
// Chức Năng Đăng kÝ
Route::post('/register', [UserController::class, 'register']);
Route::post('/login', [UserController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/profile', [UserController::class, 'profile']);
    Route::post('/logout', [UserController::class, 'logout']);
});

// chức năng đăng nhập
Route::post('/login', [UserController::class, 'login']);
Route::apiResource('patients', PatientController::class);

//   DEPARTMENTS (CRUD + SEARCH)
Route::get('/departments', [DepartmentController::class, 'index']);
Route::get('/departments/search', [DepartmentController::class, 'search']);   // GET /api/departments/search
Route::apiResource('departments', DepartmentController::class);

use App\Http\Controllers\ServiceController;



Route::get('/test', function () {
    return response()->json(['message' => 'Hello API']);
});

// Định tuyến cho ServiceController
Route::apiResource('services', ServiceController::class);

// chức năng đổi mật khẩu        
Route::middleware('auth:sanctum')->post('/change-password', [UserController::class, 'changePassword']);


//CRUD Quản lí Contact 
Route::apiResource('contacts', ContactController::class);

<<<<<<< HEAD
Route::apiResource('users', UserController::class);

//Quản lý Appointment
Route::apiResource('appointments', AppointmentController::class);




=======
// Lưu danh sách bác sĩ yêu thích
Route::post('/favorites', [FavoriteController::class, 'store']);
Route::get('/favorites/{patient_id}', [FavoriteController::class, 'index']);
Route::delete('/favorites/{id}', [FavoriteController::class, 'destroy']);
>>>>>>> DangThanhPhong-LuuBacSiYeuThich
