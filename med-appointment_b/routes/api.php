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
<<<<<<< HEAD
// ================================
// 🔐 LOGIN GOOGLE
// ================================
Route::get('/auth/google/redirect', [SocialAuthController::class, 'redirectToGoogle']);
Route::get('/auth/google/callback', [SocialAuthController::class, 'handleGoogleCallback']);
=======





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

>>>>>>> DinhThanhToan/5-DatLichKham

// ================================
// 📢 BANNER
// ================================
Route::apiResource('banners', BannerController::class);

<<<<<<< HEAD
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
=======

// DOCTORS (CRUD + PROFILE + Ảnh + Chứng chỉ)
>>>>>>> DinhThanhToan/5-DatLichKham


// ===============================
// 🧑‍⚕️ DOCTORS
// ===============================
<<<<<<< HEAD
>>>>>>> origin/master
=======

>>>>>>> DinhThanhToan/5-DatLichKham
Route::prefix('doctors')->group(function () {
    // CRUD DOCTOR
    Route::get('/', [DoctorController::class, 'index']);
    Route::post('/', [DoctorController::class, 'store']);
    Route::put('/{id}', [DoctorController::class, 'update']);
    Route::delete('/{id}', [DoctorController::class, 'destroy']);

<<<<<<< HEAD
<<<<<<< HEAD
=======

    // Hồ sơ bác sĩ


>>>>>>> DinhThanhToan/5-DatLichKham
    Route::get('/{doctor_id}/profile', [DoctorController::class, 'showProfile']);
    Route::post('/{doctor_id}/profile', [DoctorController::class, 'updateProfile']);

    Route::post('/{doctor_id}/avatar', [DoctorController::class, 'uploadAvatar']);

<<<<<<< HEAD
=======
=======

    // Chứng chỉ

>>>>>>> DinhThanhToan/5-DatLichKham
    // HỒ SƠ BÁC SĨ
    Route::get('/{doctor_id}/profile', [DoctorController::class, 'showProfile']);
    Route::post('/{doctor_id}/profile', [DoctorController::class, 'updateProfile']);

    // ẢNH ĐẠI DIỆN
    Route::post('/{doctor_id}/avatar', [DoctorController::class, 'uploadAvatar']);

    // CHỨNG CHỈ / BẰNG CẤP
<<<<<<< HEAD
>>>>>>> origin/master
=======

>>>>>>> DinhThanhToan/5-DatLichKham
    Route::get('/{doctor_id}/certificates', [DoctorController::class, 'getCertificates']);
    Route::post('/{doctor_id}/certificates', [DoctorController::class, 'uploadCertificate']);
    Route::delete('/certificates/{id}', [DoctorController::class, 'deleteCertificate']);

<<<<<<< HEAD
<<<<<<< HEAD
=======
    // TÌM KIẾM BÁC SĨ
>>>>>>> origin/master
=======

    // Tìm kiếm bác sĩ

    // TÌM KIẾM BÁC SĨ


>>>>>>> DinhThanhToan/5-DatLichKham
    Route::get('/search', [DoctorController::class, 'search']);

    

});

<<<<<<< HEAD
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
=======

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

>>>>>>> DinhThanhToan/5-DatLichKham

// ===============================
// ⏰ Lịch làm việc bác sĩ
// ===============================
Route::get('/schedules/getbyid/{doctor_id}', [ScheduleController::class, 'getScheduleById']);
<<<<<<< HEAD

<<<<<<< HEAD
// PATIENTS
// hai route này phải đặt trước route resource để không bị nhầm với {patient}
=======
=======
// PATIENTS
// hai route này phải đặt trước route resource để không bị nhầm với {patient}

>>>>>>> DinhThanhToan/5-DatLichKham

// ===============================
// 🧍‍♂️ PATIENTS
// ===============================
// Hai route này phải đặt trước route resource để không bị nhầm với {patient}
<<<<<<< HEAD
>>>>>>> DangThanhPhong/14-InDSGuiGhiChuCuaBenhNhan
=======
>>>>>>> DinhThanhToan/5-DatLichKham
Route::get('/patients/statistics', [PatientController::class, 'getStatistics']);
Route::get('/patients/newest', [PatientController::class, 'getNewest']);
Route::apiResource('patients', PatientController::class);


<<<<<<< HEAD
<<<<<<< HEAD
// USERS (CRUD + Profile + Ảnh + Chứng chỉ)
=======
// ===============================
// 👤 USERS (CRUD + Hồ sơ + Chứng chỉ)
// ===============================
>>>>>>> DangThanhPhong/14-InDSGuiGhiChuCuaBenhNhan
>>>>>>> origin/master
=======
// USERS (CRUD + Profile + Ảnh + Chứng chỉ)
// ===============================
// 👤 USERS (CRUD + Hồ sơ + Chứng chỉ)
// ===============================



>>>>>>> DinhThanhToan/5-DatLichKham
Route::apiResource('users', UserController::class);
Route::get('/users/{id}/profile', [UserController::class, 'showProfile']);
Route::post('/users/{id}/profile', [UserController::class, 'updateProfile']);
Route::get('/users/{id}/certificates', [UserController::class, 'getCertificates']);
Route::post('/users/{id}/certificates', [UserController::class, 'uploadCertificate']);
Route::delete('/users/certificates/{id}', [UserController::class, 'deleteCertificate']);

<<<<<<< HEAD
<<<<<<< HEAD
=======

// DEPARTMENTS
Route::get('/departments', [DepartmentController::class, 'index']);

>>>>>>> DinhThanhToan/5-DatLichKham
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

<<<<<<< HEAD
=======

// (REGISTER + LOGIN)

>>>>>>> DinhThanhToan/5-DatLichKham
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
<<<<<<< HEAD
=======
=======

>>>>>>> DinhThanhToan/5-DatLichKham

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
<<<<<<< HEAD
>>>>>>> origin/master
=======


>>>>>>> DinhThanhToan/5-DatLichKham
Route::post('/register', [UserController::class, 'register']);
Route::post('/login', [UserController::class, 'login']);
Route::post('/forgot-password', [UserController::class, 'forgotPassword']);
Route::post('/register/send-otp', [UserController::class, 'sendOtp']);
Route::post('/register/verify-otp', [UserController::class, 'verifyOtp']);

<<<<<<< HEAD
<<<<<<< HEAD
// ================================
// ❤️ FAVORITES
// ================================
=======
=======

// Bác sĩ yêu thích
// Dành cho khách hoặc hiển thị danh sách user khác

// ================================
// ❤️ FAVORITES
// ================================
>>>>>>> DinhThanhToan/5-DatLichKham

// ===============================
// ❤️ BÁC SĨ YÊU THÍCH (Favorites)
// ===============================
<<<<<<< HEAD
>>>>>>> origin/master
=======


>>>>>>> DinhThanhToan/5-DatLichKham
Route::get('/favorites/{user_id?}', [FavoriteController::class, 'index']);
Route::get('/favorites/doctor/{doctor_id}', [FavoriteController::class, 'getDoctor']);
Route::get('/doctors/top', [DoctorController::class, 'topDoctors']);

<<<<<<< HEAD
<<<<<<< HEAD
// ================================
// 🗒️ NOTES
// ================================
=======
=======

// Các route yêu cầu đăng nhập (token Sanctum)

// ================================
// 🗒️ NOTES
// ================================

>>>>>>> DinhThanhToan/5-DatLichKham

// ===============================
// 🔒 CÁC ROUTE YÊU CẦU ĐĂNG NHẬP (Sanctum)
// ===============================
<<<<<<< HEAD
=======

>>>>>>> DinhThanhToan/5-DatLichKham
Route::middleware('auth:sanctum')->group(function () {
    // 👤 Tài khoản người dùng
    Route::get('/profile', [UserController::class, 'profile']);
    Route::post('/logout', [UserController::class, 'logout']);
    Route::post('/change-password', [UserController::class, 'changePassword']);

<<<<<<< HEAD
<<<<<<< HEAD
=======

    // Quản lý bác sĩ yêu thích


>>>>>>> DinhThanhToan/5-DatLichKham
    // ===============================
    // 👥 USER thông tin & kiểm tra đăng nhập
    // ===============================
    Route::get('/user', [UserController::class, 'me']);
    Route::get('/user/{id}', [UserController::class, 'getUserById']);

    // 📝 Quản lý phản hồi bài viết
<<<<<<< HEAD
=======
    // 📝 Phản hồi bài viết
>>>>>>> DangThanhPhong/14-InDSGuiGhiChuCuaBenhNhan
=======

    // 📝 Phản hồi bài viết

>>>>>>> DinhThanhToan/5-DatLichKham
    Route::prefix('feedbacks')->group(function () {
        Route::get('/', [PostFeedbackController::class, 'index']);
        Route::put('/{id}', [PostFeedbackController::class, 'update']);
        Route::delete('/{id}', [PostFeedbackController::class, 'destroy']);
    });

    // 🆕 Feedback theo từng bài viết
    Route::get('/posts/{id}/feedbacks', [PostFeedbackController::class, 'index']);
    Route::post('/posts/{id}/feedbacks', [PostFeedbackController::class, 'store']);

    // ❤️ Quản lý bác sĩ yêu thích
<<<<<<< HEAD
=======

>>>>>>> DinhThanhToan/5-DatLichKham
    Route::post('/favorites', [FavoriteController::class, 'store']);
    Route::delete('/favorites/{doctor_id}', [FavoriteController::class, 'destroy']);
    Route::post('/favorites/remove', [FavoriteController::class, 'destroy']);

    // 📜 Lịch sử bệnh nhân
    Route::get('/patient/history', [PatientHistoryController::class, 'index']);
<<<<<<< HEAD
});
=======
    
    Route::middleware('auth:sanctum')->post('/logout', [UserController::class, 'logout']);


>>>>>>> DinhThanhToan/5-DatLichKham



<<<<<<< HEAD
=======
// Gửi ghi chú cho bệnh nhân


>>>>>>> DinhThanhToan/5-DatLichKham


// ===============================
// 🗒️ GHI CHÚ (NOTES) cho bệnh nhân
// ===============================
<<<<<<< HEAD
>>>>>>> origin/master
=======


>>>>>>> DinhThanhToan/5-DatLichKham
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

<<<<<<< HEAD
// 🧩 Xuất Excel cho ghi chú (mới thêm)
Route::get('/notes/{id}/export-excel', [NoteController::class, 'exportExcel']);
=======
// ================================
// 💬 FEEDBACKS
// ================================

// ⚙️ Xuất PDF cho ghi chú
Route::get('/notes/{id}/export-pdf', [NoteController::class, 'exportPdf']);

// Tìm kiếm bác sĩ theo tên hoặc chuyên khoa
Route::get('/doctors/search', [DoctorController::class, 'search']);
>>>>>>> DinhThanhToan/5-DatLichKham


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


<<<<<<< HEAD
// ===============================
// ⭐ FEEDBACK (Đánh giá bác sĩ)
// ===============================
>>>>>>> origin/master
=======

// Viết và Xem feedback/bình luận từ bệnh nhân

// ===============================
// ⭐ FEEDBACK (Đánh giá bác sĩ)
// ===============================


>>>>>>> DinhThanhToan/5-DatLichKham
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
=======

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
>>>>>>> DinhThanhToan/5-DatLichKham
// ===============================
// 🤖 CHATBOT hỗ trợ bệnh nhân
// ===============================
Route::post('/chatbot', [ChatbotController::class, 'getReply']);
<<<<<<< HEAD


=======


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
>>>>>>> DinhThanhToan/5-DatLichKham
// ===============================
// 📊 DASHBOARD
// ===============================
Route::get('/dashboard', [AppointmentController::class, 'dashboard']);
<<<<<<< HEAD
>>>>>>> origin/master
=======

Route::get('/doctors/list', [DoctorController::class, 'list']);



// Tạo lịch hẹn (đặt lịch khám)
Route::post('/appointments', [AppointmentController::class, 'store']);


Route::get('/doctors/list', [DoctorController::class, 'list']);  
>>>>>>> DinhThanhToan/5-DatLichKham
