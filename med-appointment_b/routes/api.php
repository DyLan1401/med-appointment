<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;

// Route test
Route::get('/test', function () {
    return response()->json(['message' => 'Hello API']);
});

// CRUD User
Route::apiResource('users', UserController::class);