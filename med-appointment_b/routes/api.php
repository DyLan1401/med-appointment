<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\PatientController;

use App\Http\Controllers\UserController;


// Route test

use App\Http\Controllers\DepartmentController;


Route::get('/test', function () {
    return response()->json(['message' => 'Hello API']);
});


// Quản lý bệnh nhân (CRUD)
Route::apiResource('patients', PatientController::class);

// CRUD User
Route::apiResource('users', UserController::class);


Route::get('/departments', [DepartmentController::class, 'index']);
Route::get('/departments/search', [DepartmentController::class, 'search']);
Route::apiResource('departments', DepartmentController::class);

