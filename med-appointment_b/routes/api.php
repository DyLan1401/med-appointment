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

<<<<<<< HEAD
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
=======

// ===============================
// 🌐 Xác thực Google
// ===============================
Route::get('/auth/google/redirect', [SocialAuthController::class, 'redirectToGoogle']);
Route::get('/auth/google/callback', [SocialAuthController::class, 'handleGoogleCallback']);


// ===============================
// 🖼️ Banner
// ===============================
Route::apiResource('banners', BannerController::class);


// ===============================
// 🧑‍⚕️ DOCTORS
// ===============================
>>>>>>> origin/master
Route::prefix('doctors')->group(function () {
    // CRUD DOCTOR
    Route::get('/', [DoctorController::class, 'index']);
    Route::post('/', [DoctorController::class, 'store']);
    Route::put('/{id}', [DoctorController::class, 'update']);
    Route::delete('/{id}', [DoctorController::class, 'destroy']);

<<<<<<< HEAD
    Route::get('/{doctor_id}/profile', [DoctorController::class, 'showProfile']);
    Route::post('/{doctor_id}/profile', [DoctorController::class, 'updateProfile']);

    Route::post('/{doctor_id}/avatar', [DoctorController::class, 'uploadAvatar']);

=======
    // HỒ SƠ BÁC SĨ
    Route::get('/{doctor_id}/profile', [DoctorController::class, 'showProfile']);
    Route::post('/{doctor_id}/profile', [DoctorController::class, 'updateProfile']);

    // ẢNH ĐẠI DIỆN
    Route::post('/{doctor_id}/avatar', [DoctorController::class, 'uploadAvatar']);

    // CHỨNG CHỈ / BẰNG CẤP
>>>>>>> origin/master
    Route::get('/{doctor_id}/certificates', [DoctorController::class, 'getCertificates']);
    Route::post('/{doctor_id}/certificates', [DoctorController::class, 'uploadCertificate']);
    Route::delete('/certificates/{id}', [DoctorController::class, 'deleteCertificate']);

<<<<<<< HEAD
=======
    // TÌM KIẾM BÁC SĨ
>>>>>>> origin/master
    Route::get('/search', [DoctorController::class, 'search']);

    

});

<<<<<<< HEAD
// Doctor Schedule
Route::get('/schedules/getbyid/{doctor_id}', [ScheduleController::class, 'getScheduleById']);

// ================================
// 🧍 PATIENTS
// ================================
Route::apiResource('patients', PatientController::class);

// ================================
// 👤 USERS
// ================================
=======

// ===============================
// ⏰ Lịch làm việc bác sĩ
// ===============================
Route::get('/schedules/getbyid/{doctor_id}', [ScheduleController::class, 'getScheduleById']);

<<<<<<< HEAD
// PATIENTS
// hai route này phải đặt trước route resource để không bị nhầm với {patient}
=======

// ===============================
// 🧍‍♂️ PATIENTS
// ===============================
// Hai route này phải đặt trước route resource để không bị nhầm với {patient}
>>>>>>> DangThanhPhong/14-InDSGuiGhiChuCuaBenhNhan
Route::get('/patients/statistics', [PatientController::class, 'getStatistics']);
Route::get('/patients/newest', [PatientController::class, 'getNewest']);
Route::apiResource('patients', PatientController::class);


<<<<<<< HEAD
// USERS (CRUD + Profile + Ảnh + Chứng chỉ)
=======
// ===============================
// 👤 USERS (CRUD + Hồ sơ + Chứng chỉ)
// ===============================
>>>>>>> DangThanhPhong/14-InDSGuiGhiChuCuaBenhNhan
>>>>>>> origin/master
Route::apiResource('users', UserController::class);
Route::get('/users/{id}/profile', [UserController::class, 'showProfile']);
Route::post('/users/{id}/profile', [UserController::class, 'updateProfile']);
Route::get('/users/{id}/certificates', [UserController::class, 'getCertificates']);
Route::post('/users/{id}/certificates', [UserController::class, 'uploadCertificate']);
Route::delete('/users/certificates/{id}', [UserController::class, 'deleteCertificate']);

<<<<<<< HEAD
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
=======

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
>>>>>>> origin/master
Route::post('/register', [UserController::class, 'register']);
Route::post('/login', [UserController::class, 'login']);
Route::post('/forgot-password', [UserController::class, 'forgotPassword']);
Route::post('/register/send-otp', [UserController::class, 'sendOtp']);
Route::post('/register/verify-otp', [UserController::class, 'verifyOtp']);

<<<<<<< HEAD
// ================================
// ❤️ FAVORITES
// ================================
=======

// ===============================
// ❤️ BÁC SĨ YÊU THÍCH (Favorites)
// ===============================
>>>>>>> origin/master
Route::get('/favorites/{user_id?}', [FavoriteController::class, 'index']);
Route::get('/favorites/doctor/{doctor_id}', [FavoriteController::class, 'getDoctor']);
Route::get('/doctors/top', [DoctorController::class, 'topDoctors']);

<<<<<<< HEAD
// ================================
// 🗒️ NOTES
// ================================
=======

// ===============================
// 🔒 CÁC ROUTE YÊU CẦU ĐĂNG NHẬP (Sanctum)
// ===============================
Route::middleware('auth:sanctum')->group(function () {
    // 👤 Tài khoản người dùng
    Route::get('/profile', [UserController::class, 'profile']);
    Route::post('/logout', [UserController::class, 'logout']);
    Route::post('/change-password', [UserController::class, 'changePassword']);

<<<<<<< HEAD
    // ===============================
    // 👥 USER thông tin & kiểm tra đăng nhập
    // ===============================
    Route::get('/user', [UserController::class, 'me']);
    Route::get('/user/{id}', [UserController::class, 'getUserById']);

    // 📝 Quản lý phản hồi bài viết
=======
    // 📝 Phản hồi bài viết
>>>>>>> DangThanhPhong/14-InDSGuiGhiChuCuaBenhNhan
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
    Route::post('/favorites/remove', [FavoriteController::class, 'destroy']);

    // 📜 Lịch sử bệnh nhân
    Route::get('/patient/history', [PatientHistoryController::class, 'index']);
});





// ===============================
// 🗒️ GHI CHÚ (NOTES) cho bệnh nhân
// ===============================
>>>>>>> origin/master
Route::get('/notes/{patient}', [NoteController::class, 'index']);
Route::post('/notes', [NoteController::class, 'store']);
Route::put('/notes/{note}/read', [NoteController::class, 'markAsRead']);
Route::delete('/notes/{note}', [NoteController::class, 'destroy']);

<<<<<<< HEAD
// ================================
// 💬 FEEDBACKS
// ================================
=======
// ⚙️ Xuất PDF cho ghi chú
Route::get('/notes/{id}/export-pdf', [NoteController::class, 'exportPdf']);

// 🧩 Xuất Excel cho ghi chú (mới thêm)
Route::get('/notes/{id}/export-excel', [NoteController::class, 'exportExcel']);


// ===============================
// 📤 XUẤT FILE (Excel / PDF) cho lịch hẹn
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
>>>>>>> origin/master
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

<<<<<<< HEAD
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
=======
// ===============================
// 🤖 CHATBOT hỗ trợ bệnh nhân
// ===============================
Route::post('/chatbot', [ChatbotController::class, 'getReply']);


// ===============================
// 📊 DASHBOARD
// ===============================
Route::get('/dashboard', [AppointmentController::class, 'dashboard']);
>>>>>>> origin/master
