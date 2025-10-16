<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PatientController;


Route::get('/test', function () {
    return response()->json(['message' => 'Hello API']);
});

// Quản lý bệnh nhân (CRUD)
Route::apiResource('patients', PatientController::class);