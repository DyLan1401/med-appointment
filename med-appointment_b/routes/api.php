<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Controllers
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
use App\Http\Controllers\PostFeedbackController;


// Đăng nhập với Google
Route::get('/auth/google/redirect', [SocialAuthController::class, 'redirectToGoogle']);
Route::get('/auth/google/callback', [SocialAuthController::class, 'handleGoogleCallback']);

// Banner
Route::apiResource('banners', BannerController::class);

// DOCTORS (CRUD + Profile + Ảnh + Chứng chỉ + Tìm kiếm)
Route::prefix('doctors')->group(function () {
    Route::get('/', [DoctorController::class, 'index']);
    Route::post('/', [DoctorController::class, 'store']);
    Route::put('/{id}', [DoctorController::class, 'update']);
    Route::delete('/{id}', [DoctorController::class, 'destroy']);

    // Hồ sơ bác sĩ
    Route::get('/{doctor_id}/profile', [DoctorController::class, 'showProfile']);
    Route::post('/{doctor_id}/profile', [DoctorController::class, 'updateProfile']);

    // Ảnh đại diện
    Route::post('/{doctor_id}/avatar', [DoctorController::class, 'uploadAvatar']);

    // Chứng chỉ
    Route::get('/{doctor_id}/certificates', [DoctorController::class, 'getCertificates']);
    Route::post('/{doctor_id}/certificates', [DoctorController::class, 'uploadCertificate']);
    Route::delete('/certificates/{id}', [DoctorController::class, 'deleteCertificate']);

    // Tìm kiếm bác sĩ theo tên hoặc chuyên khoa
    Route::get('/search', [DoctorController::class, 'search']);
});

// Lịch làm việc bác sĩ
Route::get('/schedules/getbyid/{doctor_id}', [ScheduleController::class, 'getScheduleById']);

// PATIENTS
Route::apiResource('patients', PatientController::class);

// USERS (CRUD + Profile + Ảnh + Chứng chỉ)
Route::apiResource('users', UserController::class);
Route::get('/users/{id}/profile', [UserController::class, 'showProfile']);
Route::post('/users/{id}/profile', [UserController::class, 'updateProfile']);
Route::get('/users/{id}/certificates', [UserController::class, 'getCertificates']);
Route::post('/users/{id}/certificates', [UserController::class, 'uploadCertificate']);
Route::delete('/users/certificates/{id}', [UserController::class, 'deleteCertificate']);

// DEPARTMENTS
Route::get('/departments/search', [DepartmentController::class, 'search']);
Route::apiResource('departments', DepartmentController::class);

// CONTACTS
Route::apiResource('contacts', ContactController::class);

// POSTS & CATEGORIES
Route::apiResource('categories', CategoryPostController::class);
Route::apiResource('posts', PostController::class);

// SERVICES
Route::apiResource('services', ServiceController::class);

// APPOINTMENTS
Route::apiResource('appointments', AppointmentController::class);

// AUTH (Đăng ký + Đăng nhập + OTP + Đổi mật khẩu)
Route::post('/register', [UserController::class, 'register']);
Route::post('/login', [UserController::class, 'login']);
Route::post('/forgot-password', [UserController::class, 'forgotPassword']);
Route::post('/register/send-otp', [UserController::class, 'sendOtp']);
Route::post('/register/verify-otp', [UserController::class, 'verifyOtp']);

// Bác sĩ yêu thích (Favorites)
Route::get('/favorites/{user_id?}', [FavoriteController::class, 'index']); // Cho khách hoặc user khác
Route::get('/favorites/doctor/{doctor_id}', [FavoriteController::class, 'getDoctor']); // Chi tiết bác sĩ yêu thích

// Lấy chi tiết 1 bác sĩ yêu thích 
Route::get('/favorites/doctor/{doctor_id}', [FavoriteController::class, 'getDoctor']);

// Các route yêu cầu đăng nhập (token Sanctum)
Route::middleware('auth:sanctum')->group(function () {
    // Tài khoản người dùng
    Route::get('/profile', [UserController::class, 'profile']);
    Route::post('/logout', [UserController::class, 'logout']);
    Route::post('/change-password', [UserController::class, 'changePassword']);

//Quản lí phản hồi bài viết
// ✅ Quản lí phản hồi bài viết
Route::prefix('feedbacks')->group(function () {
    Route::get('/', [PostFeedbackController::class, 'index']);      // Lấy toàn bộ feedback (cho trang quản lý)
    Route::put('/{id}', [PostFeedbackController::class, 'update']); // Cập nhật feedback
    Route::delete('/{id}', [PostFeedbackController::class, 'destroy']); // Xóa feedback
});

// ✅ Route cho từng bài viết
Route::get('/posts/{id}/feedbacks', [PostFeedbackController::class, 'index']); // lấy feedback theo post
Route::post('/posts/{id}/feedbacks', [PostFeedbackController::class, 'store']); // thêm feedback mới

    // Quản lý bác sĩ yêu thích
    Route::post('/favorites', [FavoriteController::class, 'store']);
    Route::delete('/favorites/{doctor_id}', [FavoriteController::class, 'destroy']);

    // Tùy chọn xóa yêu thích bằng body (frontend LikeDoctor.jsx)
    Route::post('/favorites/remove', [FavoriteController::class, 'destroy']);
    Route::get('/patient/history', [PatientHistoryController::class, 'index']);
    
    Route::middleware('auth:sanctum')->post('/logout', [UserController::class, 'logout']);

});

    Route::get('/user', [UserController::class, 'me']);

// Lấy thông tin user theo ID
Route::get('/user/{id}', [UserController::class, 'getUserById']);

// Gửi ghi chú cho bệnh nhân
// Notes (Ghi chú cho bệnh nhân)
// Route::get('/notes/{patientId}', [NoteController::class, 'index']);
// Route::post('/notes', [NoteController::class, 'store']);
// Route::delete('/notes/{id}', [NoteController::class, 'destroy']);
Route::get('/notes/{patient}', [NoteController::class, 'index']);
Route::post('/notes', [NoteController::class, 'store']);
Route::put('/notes/{note}/read', [NoteController::class, 'markAsRead']);
Route::delete('/notes/{note}', [NoteController::class, 'destroy']);

// Xuất danh sách lịch hẹn (Excel/PDF)
Route::get('/export-completed/xlsx', [AppointmentController::class, 'exportCompletedAppointmentsXlsx']);
Route::get('/export-completed/pdf', [AppointmentController::class, 'exportCompletedAppointmentsPdf']);

// Thanh toán PayOS
Route::post('/payment/create', [PaymentController::class, 'createPayment']);
Route::post('/payment/webhook', [PaymentController::class, 'webhook']);
Route::get('/test-payos', [PaymentController::class, 'testPayOS']);

// Feedback (Đánh giá bác sĩ)
Route::get('/feedbacks/{doctor_id}', [FeedbackController::class, 'getByDoctor']);
Route::post('/feedbacks', [FeedbackController::class, 'store']);
Route::delete('/feedbacks/{id}', [FeedbackController::class, 'destroy']);

// ROUTES yêu cầu đăng nhập (token Sanctum)
Route::middleware('auth:sanctum')->group(function () {
    // Thông tin tài khoản
    Route::get('/profile', [UserController::class, 'profile']);
    Route::post('/logout', [UserController::class, 'logout']);
    Route::post('/change-password', [UserController::class, 'changePassword']);

    // Quản lý bác sĩ yêu thích
    Route::post('/favorites', [FavoriteController::class, 'store']);
    Route::delete('/favorites/{doctor_id}', [FavoriteController::class, 'destroy']);
    Route::post('/favorites/remove', [FavoriteController::class, 'destroy']);

    // Lịch sử bệnh nhân
    Route::get('/patient/history', [PatientHistoryController::class, 'index']);
});

// Lấy thông tin user theo ID hoặc chính mình
Route::get('/user', [UserController::class, 'me']);
Route::get('/user/{id}', [UserController::class, 'getUserById']);


// Chatbot hỗ trợ bệnh nhân đặt lịch tự động    
Route::post('/chatbot', [ChatbotController::class, 'getReply']);