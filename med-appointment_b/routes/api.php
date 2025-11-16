<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use Illuminate\Support\Facades\Artisan;

use Illuminate\Support\Facades\Hash;
use App\Models\User;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
| Đây là toàn bộ API dùng cho hệ thống MedCare.
| Bao gồm login bằng token, chat admin, chat bác sĩ chuyên khoa...
|--------------------------------------------------------------------------
*/

// ======================================================
// 🧩 TOKEN LOGIN / LOGOUT / USER (cho frontend React/Vue)
// ======================================================

// 🧩 Đăng nhập bằng token
Route::post('/token-login', function (Request $request) {
    $request->validate([
        'email' => 'required|email',
        'password' => 'required',
    ]);

    $user = User::where('email', $request->email)->first();

    if (!$user || !Hash::check($request->password, $user->password)) {
        return response()->json(['message' => 'Email hoặc mật khẩu không đúng'], 401);
    }

    // Xóa token cũ để tránh trùng lặp
    $user->tokens()->delete();

    // ✅ Tạo token mới
    $token = $user->createToken('frontend_token')->plainTextToken;

    return response()->json([
        'message' => 'Đăng nhập thành công!',
        'user' => $user,
        'token' => $token,
    ]);
});

// 🧩 Đăng xuất
Route::middleware('auth:sanctum')->post('/token-logout', function (Request $request) {
    $request->user()->tokens()->delete();
    return response()->json(['message' => 'Đăng xuất thành công!']);
});

// 🧩 Lấy thông tin user hiện tại
Route::middleware('auth:sanctum')->get('/token-user', function (Request $request) {
    return response()->json([
        'message' => 'Lấy thông tin user thành công!',
        'user' => $request->user(),
    ]);
});

// 🧩 Kiểm tra route bảo vệ
Route::middleware('auth:sanctum')->get('/token-protected', function (Request $request) {
    return response()->json([
        'message' => 'Bạn đã đăng nhập thành công!',
        'user' => $request->user(),
    ]);
});


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
use App\Http\Controllers\InvoiceController;
use App\Models\Appointment;
use App\Http\Controllers\Api\ChatController;
use App\Http\Controllers\Api\DoctorChatController;



Route::prefix('schedules')->group(function () {
    Route::get('/', [ScheduleController::class, 'index']);
    Route::get('/{id}', [ScheduleController::class, 'show']);
    Route::post('/', [ScheduleController::class, 'store']);
    Route::put('/{id}', [ScheduleController::class, 'update']);
    Route::delete('/{id}', [ScheduleController::class, 'destroy']);

    // ⭐ Lấy lịch theo doctor_id
    Route::get('/getbyid/{doctor_id}', [ScheduleController::class, 'getScheduleById']);
});


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

// =======================================
// Doctor login bằng user table (email nằm ở bảng users)
Route::post('/doctor/login', function (Request $request) {
    $request->validate([
        'email' => 'required|email',
        'password' => 'required',
    ]);

    // Tìm user có role = doctor
    $user = User::where('email', $request->email)
                ->where('role', 'doctor')
                ->first();

    if (!$user || !Hash::check($request->password, $user->password)) {
        return response()->json(['message' => 'Email hoặc mật khẩu không đúng'], 401);
    }

    // Xóa token cũ (nếu muốn)
    $user->tokens()->delete();

    // Tạo token mới
    $token = $user->createToken('doctor_token')->plainTextToken;

    // Lấy doctor record liên kết (nếu có)
    $doctor = $user->doctor()->with('specialization')->first();

    // Map specialization -> department nếu bạn đang dùng hướng 1
    $doctorPayload = null;
    if ($doctor) {
        $doctorPayload = [
            'id' => $doctor->id,
            'department_id' => $doctor->specialization_id ?? null,
            'department_name' => $doctor->specialization->name ?? null,
            'bio' => $doctor->bio ?? null,
            // thêm các trường cần thiết
        ];
    }

    return response()->json([
        'message' => 'Đăng nhập bác sĩ thành công',
        'token' => $token,
        'user' => $user,
        'doctor' => $doctorPayload,
    ], 200);
});



// ===============================
// 🌐 Xác thực Google, Facebook
// ===============================
Route::get('/auth/google/redirect', [SocialAuthController::class, 'redirectToGoogle']);
Route::get('/auth/google/callback', [SocialAuthController::class, 'handleGoogleCallback']);

Route::get('/auth/facebook/redirect', [SocialAuthController::class, 'redirectToFacebook']);
Route::get('/auth/facebook/callback', [SocialAuthController::class, 'handleFacebookCallback']);
// ===============================
// 🧑‍⚕️ DOCTORS
// ===============================

Route::prefix('doctors')->group(function () {
    // CRUD DOCTOR
    Route::get('/', [DoctorController::class, 'index']);
    Route::post('/', [DoctorController::class, 'store']);
    Route::put('/{id}', [DoctorController::class, 'update']);
    Route::delete('/{id}', [DoctorController::class, 'destroy']);


    // Hồ sơ bác sĩ


    Route::get('/{doctor_id}/profile', [DoctorController::class, 'showProfile']);
    Route::post('/{doctor_id}/profile', [DoctorController::class, 'updateProfile']);

    Route::post('/{doctor_id}/avatar', [DoctorController::class, 'uploadAvatar']);

    // HỒ SƠ BÁC SĨ
    Route::get('/{doctor_id}/profile', [DoctorController::class, 'showProfile']);
    Route::post('/{doctor_id}/profile', [DoctorController::class, 'updateProfile']);

    // ẢNH ĐẠI DIỆN
    Route::post('/{doctor_id}/avatar', [DoctorController::class, 'uploadAvatar']);

    // CHỨNG CHỈ / BẰNG CẤP

    Route::get('/{doctor_id}/certificates', [DoctorController::class, 'getCertificates']);
    Route::post('/{doctor_id}/certificates', [DoctorController::class, 'uploadCertificate']);
    Route::delete('/certificates/{id}', [DoctorController::class, 'deleteCertificate']);


    // TÌM KIẾM BÁC SĨ



    // TÌM KIẾM BÁC SĨ

    Route::get('/search', [DoctorController::class, 'search']);

    // TÌM KIẾM BÁC SĨ

    Route::get('/search', [DoctorController::class, 'search']);

    Route::get('/search', [DoctorController::class, 'search']);

});



// Doctor Schedule
Route::get('/schedules/getbyid/{doctor_id}', [ScheduleController::class, 'getScheduleById']);


// Doctor Schedule
// Route::get('/schedules/getbyid/{doctor_id}', [ScheduleController::class, 'getScheduleById']);



// ================================
// 👤 USERS
// ================================





// USERS (CRUD + PROFILE)

// Doctor Schedule
Route::get('/schedules/getbyid/{doctor_id}', [ScheduleController::class, 'getScheduleById']);





// ===============================
// ⏰ Lịch làm việc bác sĩ
// ===============================
// Route::get('/schedules/getbyid/{doctor_id}', [ScheduleController::class, 'getScheduleById']);



// PATIENTS
// Các route này phải đặt trước route resource để không bị nhầm với {patient}

// PATIENTS

// hai route này phải đặt trước route resource để không bị nhầm với {patient}


// ===============================
// 🧍‍♂️ PATIENTS
// ===============================
// Hai route này phải đặt trước route resource để không bị nhầm với {patient}


Route::get('/patients/statistics', [PatientController::class, 'getStatistics']);
Route::get('/patients/newest', [PatientController::class, 'getNewest']);
Route::get('/patients/count', [PatientController::class, 'countPatients']);
Route::get('/patients/export', [PatientController::class, 'export']);
Route::get('/patients/daily-summary', [PatientController::class, 'dailySummary']);
Route::get('/appointments/completed/daily-summary', [AppointmentController::class, 'completedDailySummary']);
Route::apiResource('patients', PatientController::class);



// ===============================
// 👤 USERS (CRUD + Hồ sơ + Chứng chỉ)
// ===============================

// USERS (CRUD + Profile + Ảnh + Chứng chỉ)

// ===============================
// 👤 USERS (CRUD + Hồ sơ + Chứng chỉ)
// ===============================



// USERS (CRUD + Profile + Ảnh + Chứng chỉ)

// ===============================
// 👤 USERS (CRUD + Hồ sơ + Chứng chỉ)
// ===============================


Route::apiResource('users', UserController::class);
Route::get('/users/{id}/profile', [UserController::class, 'showProfile']);
Route::post('/users/{id}/profile', [UserController::class, 'updateProfile']);
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
// Đếm lịch hẹn đã hoàn thành
Route::get('/appointments/completed/count', [AppointmentController::class, 'countCompleted']);
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
Route::post('/register/send-otp', [UserController::class, 'sendOtp']);
Route::post('/register/verify-otp', [UserController::class, 'verifyOtp']);

// ================================
// ❤️ FAVORITES
// ================================

// ================================
// ❤️ FAVORITES
// ================================



// ===============================
// ❤️ BÁC SĨ YÊU THÍCH (Favorites)
// ===============================




Route::get('/favorites/{user_id?}', [FavoriteController::class, 'index']);
Route::get('/favorites/doctor/{doctor_id}', [FavoriteController::class, 'getDoctor']);
Route::get('/doctors/top', [DoctorController::class, 'topDoctors']);




// ================================
// 🗒️ NOTES
// ================================
// Các route yêu cầu đăng nhập (token Sanctum)



// ================================
// 🗒️ NOTES
// ================================

// ================================
// 🗒️ NOTES
// ================================


// ===============================
// 🔒 CÁC ROUTE YÊU CẦU ĐĂNG NHẬP (Sanctum)
// ===============================

Route::middleware('auth:sanctum')->group(function () {
    // 👤 Tài khoản người dùng
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






    // 📝 Phản hồi bài viết



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
    Route::post('/favorites/remove', [FavoriteController::class, 'destroy']);

    // 📜 Lịch sử bệnh nhân
    Route::get('/patient/history', [PatientHistoryController::class, 'index']);
});
    
    Route::middleware('auth:sanctum')->post('/logout', [UserController::class, 'logout']);










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

// 🧩 Xuất Excel cho ghi chú (mới thêm)
Route::get('/notes/{id}/export-excel', [NoteController::class, 'exportExcel']);
// ================================
// 💬 FEEDBACKS
// ================================

// ⚙️ Xuất PDF cho ghi chú
Route::get('/notes/{id}/export-pdf', [NoteController::class, 'exportPdf']);

// Tìm kiếm bác sĩ theo tên hoặc chuyên khoa
Route::get('/doctors/search', [DoctorController::class, 'search']);


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
// 💰 Quản lý hóa đơn 
// ===============================

Route::get('invoices/cancel-invoice', [InvoiceController::class, 'cancelInvoice']);
Route::apiResource('invoices', InvoiceController::class);


// ===============================
// ⭐ FEEDBACK (Đánh giá bác sĩ)
// ===============================

// Lấy tất cả feedback (có thể lọc theo bác sĩ hoặc bệnh nhân)
Route::get('/feedbacks', [FeedbackController::class, 'index']);



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
    // ================================
// 👤 USER INFO (Public)
// ================================
Route::get('/user', [UserController::class, 'me']);
Route::get('/user/{id}', [UserController::class, 'getUserById']);
});




Route::get('/doctors/list', [DoctorController::class, 'list']);


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

// ===============================
// 📊 Appointment
// ===============================
Route::get('/appointments/show/{id}', [AppointmentController::class, 'shownew']);

//tải hóa đơn
Route::get('/invoices/{id}/download', [InvoiceController::class, 'download']);

Route::put('/invoices/{id}/status', [InvoiceController::class, 'updateStatus']);

Route::get('/doctors/list', [DoctorController::class, 'list']);



// Tạo lịch hẹn (đặt lịch khám)
Route::post('/appointments', [AppointmentController::class, 'store']);

//đặt tái lịch khám
Route::post('/appointments/rebook/{id}', [AppointmentController::class, 'rebook'])
    ->middleware('auth:sanctum');


Route::get('/doctors/list', [DoctorController::class, 'list']);  


Route::get('/test-email/{id?}', [PaymentController::class, 'testSendInvoiceEmail']);

Route::get('/test/remind', function () {
    Artisan::call('appointments:remind');
    return response()->json([
        'status' => 'ok',
        'message' => 'Đã chạy command gửi mail nhắc lịch (giả lập 00:00).'
    ]);
});


Route::get('/doctors', [DoctorController::class, 'index']);
Route::get('/doctors/list', [DoctorController::class, 'list']);

// Quản lí lịch rãnh bác sĩ 

Route::get('/doctors/list', [DoctorFreeTimeController::class, 'getDoctors']);
Route::get('/doctor-free-times', [DoctorFreeTimeController::class, 'index']);
Route::post('/doctor-free-times', [DoctorFreeTimeController::class, 'store']);
Route::delete('/doctor-free-times/{id}', [DoctorFreeTimeController::class, 'destroy']);
Route::put('/doctor-free-times/{id}', [DoctorFreeTimeController::class, 'update']);


// Route::get('/schedules/getbyid/{id}', [ScheduleController::class, 'getByDoctor']);
// Route::post('/schedules', [ScheduleController::class, 'store']);
// Route::get('/schedules', [ScheduleController::class, 'index']);
// Route::post('/schedules', [ScheduleController::class, 'store']);
// Route::get('/schedules/{id}', [ScheduleController::class, 'show']);
// Route::put('/schedules/{schedule}', [ScheduleController::class, 'update']);
// Route::delete('/schedules/{schedule}', [ScheduleController::class, 'destroy']);
// Route::get('/schedules/getbyid/{doctor_id}', [ScheduleController::class, 'getScheduleById']);

