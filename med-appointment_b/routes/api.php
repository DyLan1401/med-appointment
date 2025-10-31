<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// ===============================
// 📦 Controllers
// ===============================
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
use App\Http\Controllers\Api\ChatbotController;
use App\Models\Appointment;


// ===============================
// 🌐 Xác thực Google
// ===============================
Route::get('/auth/google/redirect', [SocialAuthController::class, 'redirectToGoogle']);
Route::get('/auth/google/callback', [SocialAuthController::class, 'handleGoogleCallback']);


// ===============================
// 🖼️ Banner
// ===============================
Route::apiResource('banners', BannerController::class);


Route::prefix('doctors')->group(function () {

    // CRUD DOCTOR
    Route::get('/', [DoctorController::class, 'index']);          // Danh sách bác sĩ (có phân trang)
    Route::post('/', [DoctorController::class, 'store']);         // Thêm bác sĩ mới
    Route::put('/{id}', [DoctorController::class, 'update']);     // Cập nhật thông tin bác sĩ
    Route::delete('/{id}', [DoctorController::class, 'destroy']); // Xóa bác sĩ


    // HỒ SƠ BÁC SĨ
    Route::get('/{doctor_id}/profile', [DoctorController::class, 'showProfile']);   // Xem hồ sơ
    Route::post('/{doctor_id}/profile', [DoctorController::class, 'updateProfile']); // Cập nhật hồ sơ


    // ẢNH ĐẠI DIỆN
    Route::post('/{doctor_id}/avatar', [DoctorController::class, 'uploadAvatar']);  // Upload ảnh đại diện


    // CHỨNG CHỈ / BẰNG CẤP
    Route::get('/{doctor_id}/certificates', [DoctorController::class, 'getCertificates']);   // Lấy danh sách chứng chỉ
    Route::post('/{doctor_id}/certificates', [DoctorController::class, 'uploadCertificate']); // Upload chứng chỉ mới
    Route::delete('/certificates/{id}', [DoctorController::class, 'deleteCertificate']);      // Xóa chứng chỉ


    // TÌM KIẾM BÁC SĨ
    Route::get('/search', [DoctorController::class, 'search']); // Tìm kiếm theo tên / chuyên khoa

});


// ===============================
// ⏰ Lịch làm việc bác sĩ
// ===============================
Route::get('/schedules/getbyid/{doctor_id}', [ScheduleController::class, 'getScheduleById']);


// ===============================
// 🧍‍♂️ PATIENTS
// ===============================
Route::apiResource('patients', PatientController::class);


// ===============================
// 👤 USERS (CRUD + Hồ sơ + Chứng chỉ)
// ===============================
Route::apiResource('users', UserController::class);
Route::get('/users/{id}/profile', [UserController::class, 'showProfile']);
Route::post('/users/{id}/profile', [UserController::class, 'updateProfile']);
Route::get('/users/{id}/certificates', [UserController::class, 'getCertificates']);
Route::post('/users/{id}/certificates', [UserController::class, 'uploadCertificate']);
Route::delete('/users/certificates/{id}', [UserController::class, 'deleteCertificate']);


// ===============================
// 🏥 DEPARTMENTS
// ===============================
Route::get('/departments/search', [DepartmentController::class, 'search']);
Route::apiResource('departments', DepartmentController::class);


// ===============================
// 📬 CONTACTS
// ===============================
Route::apiResource('contacts', ContactController::class);


// ===============================
// 📰 POSTS & CATEGORIES
// ===============================
Route::apiResource('categories', CategoryPostController::class);
Route::apiResource('posts', PostController::class);


// ===============================
// 💼 SERVICES
// ===============================
Route::apiResource('services', ServiceController::class);


// ===============================
// 📅 APPOINTMENTS
// ===============================
Route::apiResource('appointments', AppointmentController::class);


// ===============================
// 🔐 AUTH (Đăng ký + Đăng nhập + OTP + Mật khẩu)
// ===============================
Route::post('/register', [UserController::class, 'register']);
Route::post('/login', [UserController::class, 'login']);
Route::post('/forgot-password', [UserController::class, 'forgotPassword']);
Route::post('/register/send-otp', [UserController::class, 'sendOtp']);
Route::post('/register/verify-otp', [UserController::class, 'verifyOtp']);


// ===============================
// ❤️ BÁC SĨ YÊU THÍCH (Favorites)
// ===============================
Route::get('/favorites/{user_id?}', [FavoriteController::class, 'index']);
Route::get('/favorites/doctor/{doctor_id}', [FavoriteController::class, 'getDoctor']);


// ===============================
// 🔒 CÁC ROUTE YÊU CẦU ĐĂNG NHẬP (Sanctum)
// ===============================
Route::middleware('auth:sanctum')->group(function () {
    // 👤 Thông tin tài khoản người dùng
    Route::get('/profile', [UserController::class, 'profile']);
    Route::post('/logout', [UserController::class, 'logout']);
    Route::post('/change-password', [UserController::class, 'changePassword']);

    // 📝 Quản lý phản hồi bài viết
    Route::prefix('feedbacks')->group(function () {
        Route::get('/', [PostFeedbackController::class, 'index']);
        Route::put('/{id}', [PostFeedbackController::class, 'update']);
        Route::delete('/{id}', [PostFeedbackController::class, 'destroy']);
    });

    // 🆕 Route feedback theo từng bài viết
    Route::get('/posts/{id}/feedbacks', [PostFeedbackController::class, 'index']);
    Route::post('/posts/{id}/feedbacks', [PostFeedbackController::class, 'store']);

    // ❤️ Quản lý bác sĩ yêu thích
    Route::post('/favorites', [FavoriteController::class, 'store']);
    Route::delete('/favorites/{doctor_id}', [FavoriteController::class, 'destroy']);
    Route::post('/favorites/remove', [FavoriteController::class, 'destroy']);

    // 📜 Lịch sử bệnh nhân
    Route::get('/patient/history', [PatientHistoryController::class, 'index']);
});


// ===============================
// 👥 USER thông tin & kiểm tra đăng nhập
// ===============================
Route::get('/user', [UserController::class, 'me']);
Route::get('/user/{id}', [UserController::class, 'getUserById']);


// ===============================
// 🗒️ GHI CHÚ (NOTES) cho bệnh nhân
// ===============================
Route::get('/notes/{patient}', [NoteController::class, 'index']);
Route::post('/notes', [NoteController::class, 'store']);
Route::put('/notes/{note}/read', [NoteController::class, 'markAsRead']);
Route::delete('/notes/{note}', [NoteController::class, 'destroy']);


// ===============================
// 📤 XUẤT FILE (Excel / PDF)
// ===============================
Route::get('/export-completed/xlsx', [AppointmentController::class, 'exportCompletedAppointmentsXlsx']);
Route::get('/export-completed/pdf', [AppointmentController::class, 'exportCompletedAppointmentsPdf']);


// ===============================
// 💰 THANH TOÁN (PayOS)
// ===============================
Route::post('/payment/create', [PaymentController::class, 'createPayment']);
Route::post('/payment/webhook', [PaymentController::class, 'webhook']);
Route::get('/test-payos', [PaymentController::class, 'testPayOS']);


// ===============================
// ⭐ FEEDBACK (Đánh giá bác sĩ)
// ===============================
Route::get('/feedbacks/{doctor_id}', [FeedbackController::class, 'getByDoctor']);
Route::post('/feedbacks', [FeedbackController::class, 'store']);
Route::delete('/feedbacks/{id}', [FeedbackController::class, 'destroy']);


// ===============================
// 🤖 CHATBOT hỗ trợ bệnh nhân
// ===============================
Route::post('/chatbot', [ChatbotController::class, 'getReply']);


// ===============================
// 📊 DASHBOARD
// ===============================
Route::get('/dashboard', [AppointmentController::class, 'dashboard']);