<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// ===============================
// 📦 Controllers
// ===============================
use App\Http\Controllers\{
    DoctorController, PatientController, UserController, DepartmentController,
    AppointmentController, CategoryPostController, PostController, ContactController,
    FavoriteController, SocialAuthController, BannerController, ServiceController,
    NoteController, PaymentController, FeedbackController, PatientHistoryController,
    ScheduleController, PostFeedbackController, Api\ChatbotController, InvoiceController,
    DoctorFreeTimeController
};

// ======================================================
// 📅 SCHEDULES
// ======================================================
Route::prefix('schedules')->group(function () {
    Route::get('/', [ScheduleController::class, 'index']);
    Route::get('/{id}', [ScheduleController::class, 'show']);
    Route::post('/', [ScheduleController::class, 'store']);
    Route::put('/{id}', [ScheduleController::class, 'update']);
    Route::delete('/{id}', [ScheduleController::class, 'destroy']);
    Route::get('/getbyid/{doctor_id}', [ScheduleController::class, 'getScheduleById']);
});

// ======================================================
// 🖼️ BANNERS
// ======================================================
Route::apiResource('banners', BannerController::class);

// ======================================================
// 🧑‍⚕️ DOCTORS
// ======================================================
Route::prefix('doctors')->group(function () {
    Route::get('/', [DoctorController::class, 'index']);
    Route::post('/', [DoctorController::class, 'store']);
    Route::put('/{id}', [DoctorController::class, 'update']);
    Route::delete('/{id}', [DoctorController::class, 'destroy']);

    Route::get('/{id}/profile', [DoctorController::class, 'showProfile']);
    Route::post('/{id}/profile', [DoctorController::class, 'updateProfile']);

    Route::post('/{id}/avatar', [DoctorController::class, 'uploadAvatar']);

    Route::get('/{id}/certificates', [DoctorController::class, 'getCertificates']);
    Route::post('/{id}/certificates', [DoctorController::class, 'uploadCertificate']);
    Route::delete('/certificates/{id}', [DoctorController::class, 'deleteCertificate']);

    Route::get('/search', [DoctorController::class, 'search']);
    Route::get('/list', [DoctorController::class, 'list']);
    Route::get('/top', [DoctorController::class, 'topDoctors']);
});

// ======================================================
// 🧍 PATIENTS
// ======================================================
Route::get('/patients/statistics', [PatientController::class, 'getStatistics']);
Route::get('/patients/newest', [PatientController::class, 'getNewest']);
Route::get('/patients/count', [PatientController::class, 'countPatients']);
Route::get('/patients/export', [PatientController::class, 'export']);
Route::get('/patients/daily-summary', [PatientController::class, 'dailySummary']);
Route::get('/appointments/completed/daily-summary', [AppointmentController::class, 'completedDailySummary']);
Route::apiResource('patients', PatientController::class);

// ======================================================
// 👤 USERS
// ======================================================
Route::apiResource('users', UserController::class);
Route::prefix('users')->group(function () {
    Route::get('/{id}/profile', [UserController::class, 'showProfile']);
    Route::post('/{id}/profile', [UserController::class, 'updateProfile']);
    Route::get('/{id}/certificates', [UserController::class, 'getCertificates']);
    Route::post('/{id}/certificates', [UserController::class, 'uploadCertificate']);
    Route::delete('/certificates/{id}', [UserController::class, 'deleteCertificate']);
});

// ======================================================
// 📅 APPOINTMENTS
// ======================================================
Route::get('/appointments/completed/count', [AppointmentController::class, 'countCompleted']);
Route::get('/appointments/check', [AppointmentController::class, 'checkSlot']);
Route::get('/appointments/available/{doctor_id}', [AppointmentController::class, 'getAvailableSlots']);
Route::get('/appointments/show/{id}', [AppointmentController::class, 'shownew']);
Route::put('/appointments/{id}', [AppointmentController::class, 'SendMailWhenConfirmedSchedule']);
Route::post('/appointments/rebook/{id}', [AppointmentController::class, 'rebook'])
    ->middleware('auth:sanctum');
Route::apiResource('appointments', AppointmentController::class);

// Export lịch hẹn
Route::get('/export-completed/xlsx', [AppointmentController::class, 'exportCompletedAppointmentsXlsx']);
Route::get('/export-completed/pdf', [AppointmentController::class, 'exportCompletedAppointmentsPdf']);

// ======================================================
// 💳 PAYMENT
// ======================================================
Route::post('/payment/create', [PaymentController::class, 'createPayment']);
Route::post('/payment/webhook', [PaymentController::class, 'webhook']);
Route::get('/test-payos', [PaymentController::class, 'testPayOS']);

// ======================================================
// 📬 CONTACTS
// ======================================================
Route::apiResource('contacts', ContactController::class);

// ======================================================
// 📰 POSTS & CATEGORIES
// ======================================================
Route::apiResource('categories', CategoryPostController::class);
Route::apiResource('posts', PostController::class);

// ======================================================
// 💼 SERVICES
// ======================================================
Route::apiResource('services', ServiceController::class);

// ======================================================
// 🔐 AUTH
// ======================================================
Route::post('/register', [UserController::class, 'register']);
Route::post('/login', [UserController::class, 'login']);
Route::post('/forgot-password', [UserController::class, 'forgotPassword']);
Route::post('/register/send-otp', [UserController::class, 'sendOtp']);
Route::post('/register/verify-otp', [UserController::class, 'verifyOtp']);

// ======================================================
// ⚙️ PROTECTED ROUTES
// ======================================================
Route::middleware('auth:sanctum')->group(function () {

    // User
    Route::get('/user', [UserController::class, 'me']);
    Route::get('/user/{id}', [UserController::class, 'getUserById']);
    Route::get('/profile', [UserController::class, 'profile']);
    Route::post('/logout', [UserController::class, 'logout']);
    Route::post('/change-password', [UserController::class, 'changePassword']);

    // Favorites
    Route::post('/favorites', [FavoriteController::class, 'store']);
    Route::delete('/favorites/{doctor_id}', [FavoriteController::class, 'destroy']);

    // Lịch sử bệnh nhân
    Route::get('/patient/history', [PatientHistoryController::class, 'index']);

 Route::prefix('post-feedbacks')->group(function () {
    Route::get('/', [PostFeedbackController::class, 'index']);
    Route::put('/{id}', [PostFeedbackController::class, 'update']);
    Route::delete('/{id}', [PostFeedbackController::class, 'destroy']);
});
Route::get('/posts/{postId}/feedbacks', [PostFeedbackController::class, 'listByPost']);

    Route::post('/posts/{id}/feedbacks', [PostFeedbackController::class, 'store']);
});

// ======================================================
// ⭐ FEEDBACK (bác sĩ)
// ======================================================
Route::get('/feedbacks', [FeedbackController::class, 'index']);
Route::get('/feedbacks/{doctor_id}', [FeedbackController::class, 'getByDoctor']);
Route::post('/feedbacks', [FeedbackController::class, 'store']);
Route::delete('/feedbacks/{id}', [FeedbackController::class, 'destroy']);

// ======================================================
// 📜 NOTES
// ======================================================
Route::get('/notes/{patient}', [NoteController::class, 'index']);
Route::post('/notes', [NoteController::class, 'store']);
Route::put('/notes/{note}/read', [NoteController::class, 'markAsRead']);
Route::delete('/notes/{note}', [NoteController::class, 'destroy']);
Route::get('/notes/{id}/export-pdf', [NoteController::class, 'exportPdf']);
Route::get('/notes/{id}/export-excel', [NoteController::class, 'exportExcel']);

// ======================================================
// 📊 DASHBOARD
// ======================================================
Route::get('/dashboard', [AppointmentController::class, 'dashboard']);

// ======================================================
// 💰 INVOICES
// ======================================================
Route::get('invoices/cancel-invoice', [InvoiceController::class, 'cancelInvoice']);
Route::apiResource('invoices', InvoiceController::class);
Route::get('/invoices/{id}/download', [InvoiceController::class, 'download']);

// ======================================================
// 🤖 CHATBOT
// ======================================================
Route::post('/chatbot', [ChatbotController::class, 'getReply']);


Route::apiResource('departments', DepartmentController::class);
Route::get('/departments/search', [DepartmentController::class, 'search']);
