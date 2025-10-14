<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DepartmentController;

Route::get('/test', function () {
    return response()->json(['message' => 'Hello API']);
});



Route::apiResource('departments', DepartmentController::class);
