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


Route::apiResource('banners', BannerController::class);


// đăng nhập với google
// ================================
// 🩺 DOCTORS
// ================================


// ===============================
// 🌐 Xác thực Google
// ===============================

Route::get('/auth/google/redirect', [SocialAuthController::class, 'redirectToGoogle']);
Route::get('/auth/google/callback', [SocialAuthController::class, 'handleGoogleCallback']);



// Banner
Route::apiResource('banners', BannerController::class);


// DOCTORS (CRUD + PROFILE + Ảnh + Chứng chỉ)


// ===============================
// 🧑‍⚕️ DOCTORS
// ===============================

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

    // HỒ SƠ BÁC SĨ
    Route::get('/{doctor_id}/profile', [DoctorController::class, 'showProfile']);
    Route::post('/{doctor_id}/profile', [DoctorController::class, 'updateProfile']);

    // ẢNH ĐẠI DIỆN
    Route::post('/{doctor_id}/avatar', [DoctorController::class, 'uploadAvatar']);

    // CHỨNG CHỈ / BẰNG CẤP

    Route::get('/{doctor_id}/certificates', [DoctorController::class, 'getCertificates']);
    Route::post('/{doctor_id}/certificates', [DoctorController::class, 'uploadCertificate']);
    Route::delete('/certificates/{id}', [DoctorController::class, 'deleteCertificate']);


    // Tìm kiếm bác sĩ

    // TÌM KIẾM BÁC SĨ


    Route::get('/search', [DoctorController::class, 'search']);
});


// PATIENTS
Route::apiResource('patients', PatientController::class);

// USERS (CRUD + PROFILE)

// Doctor Schedule
Route::get('/schedules/getbyid/{doctor_id}', [ScheduleController::class, 'getScheduleById']);

// ================================
// 🧍 PATIENTS
// ================================
Route::apiResource('patients', PatientController::class);

// ================================
// 👤 USERS
// ================================


// ===============================
// ⏰ Lịch làm việc bác sĩ
// ===============================
Route::get('/schedules/getbyid/{doctor_id}', [ScheduleController::class, 'getScheduleById']);
// PATIENTS
// hai route này phải đặt trước route resource để không bị nhầm với {patient}


// ===============================
// 🧍‍♂️ PATIENTS
// ===============================
// Hai route này phải đặt trước route resource để không bị nhầm với {patient}
Route::get('/patients/statistics', [PatientController::class, 'getStatistics']);
Route::get('/patients/newest', [PatientController::class, 'getNewest']);
Route::apiResource('patients', PatientController::class);


// USERS (CRUD + Profile + Ảnh + Chứng chỉ)
// ===============================
// 👤 USERS (CRUD + Hồ sơ + Chứng chỉ)
// ===============================



Route::apiResource('users', UserController::class);
Route::get('/users/{id}/profile', [UserController::class, 'showProfile']);
Route::post('/users/{id}/profile', [UserController::class, 'updateProfile']);

// Ảnh & Chứng chỉ User
Route::get('/users/{id}/certificates', [UserController::class, 'getCertificates']);
Route::post('/users/{id}/certificates', [UserController::class, 'uploadCertificate']);
Route::delete('/users/certificates/{id}', [UserController::class, 'deleteCertificate']);


// DEPARTMENTS
Route::get('/departments', [DepartmentController::class, 'index']);

// ================================
// 🏥 DEPARTMENTS
// ================================
Route::get('/departments/search', [DepartmentController::class, 'search']);
Route::apiResource('departments', DepartmentController::class);

//lấy lịch làm việc bác sĩ theo id
Route::get('/schedules/getbyid/{doctor_id}', [ScheduleController::class, 'getScheduleById']);

// CONTACTS
Route::apiResource('contacts', ContactController::class);

// POSTS & CATEGORIES
Route::apiResource('categories', CategoryPostController::class);
Route::apiResource('posts', PostController::class);

// SERVICES
Route::apiResource('services', ServiceController::class);

// APPOINTMENTS
Route::apiResource('appointments', AppointmentController::class);


// (REGISTER + LOGIN)

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


// Bác sĩ yêu thích
// Dành cho khách hoặc hiển thị danh sách user khác

// ================================
// ❤️ FAVORITES
// ================================

// ===============================
// ❤️ BÁC SĨ YÊU THÍCH (Favorites)
// ===============================


Route::get('/favorites/{user_id?}', [FavoriteController::class, 'index']);

// Lấy chi tiết 1 bác sĩ yêu thích 
Route::get('/favorites/doctor/{doctor_id}', [FavoriteController::class, 'getDoctor']);


// Các route yêu cầu đăng nhập (token Sanctum)

// ================================
// 🗒️ NOTES
// ================================


// ===============================
// 🔒 CÁC ROUTE YÊU CẦU ĐĂNG NHẬP (Sanctum)
// ===============================

Route::middleware('auth:sanctum')->group(function () {
    // Tài khoản người dùng
    Route::get('/profile', [UserController::class, 'profile']);
    Route::post('/logout', [UserController::class, 'logout']);
    Route::post('/change-password', [UserController::class, 'changePassword']);


    // Quản lý bác sĩ yêu thích


    // ===============================
    // 👥 USER thông tin & kiểm tra đăng nhập
    // ===============================
    Route::get('/user', [UserController::class, 'me']);
    Route::get('/user/{id}', [UserController::class, 'getUserById']);

    // 📝 Quản lý phản hồi bài viết

    // 📝 Phản hồi bài viết

    Route::prefix('feedbacks')->group(function () {
        Route::get('/', [PostFeedbackController::class, 'index']);
        Route::put('/{id}', [PostFeedbackController::class, 'update']);
        Route::delete('/{id}', [PostFeedbackController::class, 'destroy']);
    });

    // 🆕 Feedback theo từng bài viết
    Route::get('/posts/{id}/feedbacks', [PostFeedbackController::class, 'index']);
    Route::post('/posts/{id}/feedbacks', [PostFeedbackController::class, 'store']);

    // ❤️ Quản lý bác sĩ yêu thích

    Route::post('/favorites', [FavoriteController::class, 'store']);
    Route::delete('/favorites/{doctor_id}', [FavoriteController::class, 'destroy']);

    // Tùy chọn xóa yêu thích bằng body (frontend LikeDoctor.jsx)
    Route::post('/favorites/remove', [FavoriteController::class, 'destroy']);
    Route::get('/patient/history', [PatientHistoryController::class, 'index']);
    
    Route::middleware('auth:sanctum')->post('/logout', [UserController::class, 'logout']);



    Route::get('/user', [UserController::class, 'me']);
});
// Lấy thông tin user theo ID
Route::get('/user/{id}', [UserController::class, 'getUserById']);


// Gửi ghi chú cho bệnh nhân




// ===============================
// 🗒️ GHI CHÚ (NOTES) cho bệnh nhân
// ===============================


Route::get('/notes/{patient}', [NoteController::class, 'index']);
Route::post('/notes', [NoteController::class, 'store']);
Route::put('/notes/{note}/read', [NoteController::class, 'markAsRead']);
Route::delete('/notes/{note}', [NoteController::class, 'destroy']);


// ================================
// 💬 FEEDBACKS
// ================================

// ⚙️ Xuất PDF cho ghi chú
Route::get('/notes/{id}/export-pdf', [NoteController::class, 'exportPdf']);

// Tìm kiếm bác sĩ theo tên hoặc chuyên khoa
Route::get('/doctors/search', [DoctorController::class, 'search']);

//in danh sách lịch hẹn
Route::get('/export-completed/xlsx', [AppointmentController::class, 'exportCompletedAppointmentsXlsx']);
Route::get('/export-completed/pdf', [AppointmentController::class, 'exportCompletedAppointmentsPdf']);

// Thanh toán PayOS
Route::post('/payment/create', [PaymentController::class, 'createPayment']);
Route::post('/payment/webhook', [PaymentController::class, 'webhook']);
Route::get('/test-payos', [PaymentController::class, 'testPayOS']);

// Gửi và xác minh OTP trong đăng ký
Route::post('/register/send-otp', [UserController::class, 'sendOtp']);
Route::post('/register/verify-otp', [UserController::class, 'verifyOtp']);


// Viết và Xem feedback/bình luận từ bệnh nhân

// ===============================
// ⭐ FEEDBACK (Đánh giá bác sĩ)
// ===============================


Route::get('/feedbacks/{doctor_id}', [FeedbackController::class, 'getByDoctor']);
Route::post('/feedbacks', [FeedbackController::class, 'store']);
Route::delete('/feedbacks/{id}', [FeedbackController::class, 'destroy']);



// DOCTORS (CRUD + PROFILE + Ảnh + Chứng chỉ)
// Route::prefix('doctors')->group(function () {
//     Route::get('/', [DoctorController::class, 'index']);
//     Route::post('/', [DoctorController::class, 'store']);
//     Route::put('/{id}', [DoctorController::class, 'update']);
//     Route::delete('/{id}', [DoctorController::class, 'destroy']);
    Route::post('/favorites', [FavoriteController::class, 'store']);
    Route::delete('/favorites/{doctor_id}', [FavoriteController::class, 'destroy']);
    Route::post('/favorites/remove', [FavoriteController::class, 'destroy']);


//     // Hồ sơ bác sĩ
    Route::get('/{doctor_id}/profile', [DoctorController::class, 'showProfile']);
    Route::post('/{doctor_id}/profile', [DoctorController::class, 'updateProfile']);

//     // Ảnh đại diện
    Route::post('/{doctor_id}/avatar', [DoctorController::class, 'uploadAvatar']);

//     // Chứng chỉ
    Route::get('/{doctor_id}/certificates', [DoctorController::class, 'getCertificates']);
    Route::post('/{doctor_id}/certificates', [DoctorController::class, 'uploadCertificate']);
    Route::delete('/certificates/{id}', [DoctorController::class, 'deleteCertificate']);


//     // Tìm kiếm bác sĩ
    Route::get('/search', [DoctorController::class, 'search']);

Route::get('/doctors/list', [DoctorController::class, 'list']);
// ===============================
// 🤖 CHATBOT hỗ trợ bệnh nhân
// ===============================
Route::post('/chatbot', [ChatbotController::class, 'getReply']);


// PATIENTS
 Route::apiResource('patients', PatientController::class);


// USERS (CRUD + PROFILE)
Route::apiResource('users', UserController::class);
Route::get('/users/{id}/profile', [UserController::class, 'showProfile']);
Route::post('/users/{id}/profile', [UserController::class, 'updateProfile']);

// Ảnh & Chứng chỉ User
Route::get('/users/{id}/certificates', [UserController::class, 'getCertificates']);
Route::post('/users/{id}/certificates', [UserController::class, 'uploadCertificate']);
Route::delete('/users/certificates/{id}', [UserController::class, 'deleteCertificate']);

// // DEPARTMENTS
Route::get('/departments', [DepartmentController::class, 'index']);
Route::get('/departments/search', [DepartmentController::class, 'search']);
Route::apiResource('departments', DepartmentController::class);

// // CONTACTS
Route::apiResource('contacts', ContactController::class);

// // POSTS & CATEGORIES
Route::apiResource('categories', CategoryPostController::class);
Route::apiResource('posts', PostController::class);

// // SERVICES
Route::apiResource('services', ServiceController::class);
// ===============================
// 📊 DASHBOARD
// ===============================
Route::get('/dashboard', [AppointmentController::class, 'dashboard']);

Route::get('/doctors/list', [DoctorController::class, 'list']);



// Tạo lịch hẹn (đặt lịch khám)
Route::post('/appointments', [AppointmentController::class, 'store']);


Route::get('/doctors/list', [DoctorController::class, 'list']);  