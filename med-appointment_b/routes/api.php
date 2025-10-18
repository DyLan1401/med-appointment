<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DoctorController;

use App\Http\Controllers\PatientController;

use App\Http\Controllers\UserController;


// Route test

use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\AppointmentController;

Route::get('/test', function () {
    return response()->json(['message' => 'Hello API']);
});


Route::apiResource('patients', PatientController::class);

Route::apiResource('users', UserController::class);


Route::get('/departments', [DepartmentController::class, 'index']);
Route::get('/departments/search', [DepartmentController::class, 'search']);
Route::apiResource('departments', DepartmentController::class);

Route::apiResource('appointments', AppointmentController::class);


Route::get('/doctors', [DoctorController::class, 'index']);
Route::post('/doctors', [DoctorController::class, 'store']);
Route::put('/doctors/{id}', [DoctorController::class, 'update']);
Route::delete('/doctors/{id}', [DoctorController::class, 'destroy']);
