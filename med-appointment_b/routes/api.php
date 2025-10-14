<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ServiceController;


Route::get('/test', function () {
    return response()->json(['message' => 'Hello API']);
});

// Định tuyến cho ServiceController
Route::apiResource('services', ServiceController::class);