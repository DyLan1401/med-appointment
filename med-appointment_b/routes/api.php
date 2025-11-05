<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// 🧩 Controllers
use App\Http\Controllers\DoctorController;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\CategoryPostController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\ChangePasswordController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\SocialAuthController;
use App\Http\Controllers\BannerController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\NoteController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\FeedbackController;
use App\Http\Controllers\PatientHistoryController;
use App\Http\Controllers\ScheduleController;

// ================================
// 🔐 LOGIN GOOGLE
// ================================
Route::get('/auth/google/redirect', [SocialAuthController::class, 'redirectToGoogle']);
Route::get('/auth/google/callback', [SocialAuthController::class, 'handleGoogleCallback']);

// ================================
// 📢 BANNER
// ================================
Route::apiResource('banners', BannerController::class);

// ================================
// 🩺 DOCTORS
// ================================
Route::prefix('doctors')->group(function () {
    Route::get('/', [DoctorController::class, 'index']);
    Route::post('/', [DoctorController::class, 'store']);
    Route::put('/{id}', [DoctorController::class, 'update']);
    Route::delete('/{id}', [DoctorController::class, 'destroy']);

    Route::get('/{doctor_id}/profile', [DoctorController::class, 'showProfile']);
    Route::post('/{doctor_id}/profile', [DoctorController::class, 'updateProfile']);

    Route::post('/{doctor_id}/avatar', [DoctorController::class, 'uploadAvatar']);

    Route::get('/{doctor_id}/certificates', [DoctorController::class, 'getCertificates']);
    Route::post('/{doctor_id}/certificates', [DoctorController::class, 'uploadCertificate']);
    Route::delete('/certificates/{id}', [DoctorController::class, 'deleteCertificate']);

    Route::get('/search', [DoctorController::class, 'search']);

    

});

// Doctor Schedule
Route::get('/schedules/getbyid/{doctor_id}', [ScheduleController::class, 'getScheduleById']);

// ================================
// 🧍 PATIENTS
// ================================
Route::apiResource('patients', PatientController::class);

// ================================
// 👤 USERS
// ================================
Route::apiResource('users', UserController::class);
Route::get('/users/{id}/profile', [UserController::class, 'showProfile']);
Route::post('/users/{id}/profile', [UserController::class, 'updateProfile']);
Route::get('/users/{id}/certificates', [UserController::class, 'getCertificates']);
Route::post('/users/{id}/certificates', [UserController::class, 'uploadCertificate']);
Route::delete('/users/certificates/{id}', [UserController::class, 'deleteCertificate']);

// ================================
// 🏥 DEPARTMENTS
// ================================
Route::get('/departments/search', [DepartmentController::class, 'search']);
Route::apiResource('departments', DepartmentController::class);

// ================================
// 📞 CONTACTS
// ================================
Route::apiResource('contacts', ContactController::class);

// ================================
// 📰 POSTS
// ================================
Route::apiResource('categories', CategoryPostController::class);
Route::apiResource('posts', PostController::class);

// ================================
// 💊 SERVICES
// ================================
Route::apiResource('services', ServiceController::class);

// ================================
// 📅 APPOINTMENTS (Booking)
// ================================
Route::apiResource('appointments', AppointmentController::class);

// ✅ API kiểm tra slot trùng
Route::get('/appointments/check', [AppointmentController::class, 'checkSlot']);

// ✅ API lấy slot trống theo bác sĩ + ngày
Route::get('/appointments/available/{doctor_id}', [AppointmentController::class, 'getAvailableSlots']);

// ✅ Export lịch khám
Route::get('/export-completed/xlsx', [AppointmentController::class, 'exportCompletedAppointmentsXlsx']);
Route::get('/export-completed/pdf', [AppointmentController::class, 'exportCompletedAppointmentsPdf']);

// ================================
// 💳 PAYMENT
// ================================
Route::post('/payment/create', [PaymentController::class, 'createPayment']);
Route::post('/payment/webhook', [PaymentController::class, 'webhook']);
Route::get('/test-payos', [PaymentController::class, 'testPayOS']);

// ================================
// 🔐 AUTH & OTP
// ================================
Route::post('/register', [UserController::class, 'register']);
Route::post('/login', [UserController::class, 'login']);
Route::post('/forgot-password', [UserController::class, 'forgotPassword']);
Route::post('/register/send-otp', [UserController::class, 'sendOtp']);
Route::post('/register/verify-otp', [UserController::class, 'verifyOtp']);

// ================================
// ❤️ FAVORITES
// ================================
Route::get('/favorites/{user_id?}', [FavoriteController::class, 'index']);
Route::get('/favorites/doctor/{doctor_id}', [FavoriteController::class, 'getDoctor']);

// ================================
// 🗒️ NOTES
// ================================
Route::get('/notes/{patient}', [NoteController::class, 'index']);
Route::post('/notes', [NoteController::class, 'store']);
Route::put('/notes/{note}/read', [NoteController::class, 'markAsRead']);
Route::delete('/notes/{note}', [NoteController::class, 'destroy']);

// ================================
// 💬 FEEDBACKS
// ================================
Route::get('/feedbacks/{doctor_id}', [FeedbackController::class, 'getByDoctor']);
Route::post('/feedbacks', [FeedbackController::class, 'store']);
Route::delete('/feedbacks/{id}', [FeedbackController::class, 'destroy']);

// ================================
// 🔐 PROTECTED ROUTES
// ================================
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/profile', [UserController::class, 'profile']);
    Route::post('/logout', [UserController::class, 'logout']);
    Route::post('/change-password', [UserController::class, 'changePassword']);

    Route::post('/favorites', [FavoriteController::class, 'store']);
    Route::delete('/favorites/{doctor_id}', [FavoriteController::class, 'destroy']);
    Route::post('/favorites/remove', [FavoriteController::class, 'destroy']);

    Route::get('/patient/history', [PatientHistoryController::class, 'index']);
});

// ================================
// 👤 USER INFO (Public)
// ================================
Route::get('/user', [UserController::class, 'me']);
Route::get('/user/{id}', [UserController::class, 'getUserById']);


Route::get('/doctors/list', [DoctorController::class, 'list']);