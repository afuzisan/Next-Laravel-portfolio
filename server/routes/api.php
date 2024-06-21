<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MemoController;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});



Route::get('dashboard/reviews',[MemoController::class,'index']);
Route::get('dashboard/memo',[MemoController::class,'memo']);
Route::post('dashboard/memoUpdate',[MemoController::class,'memoUpdate']);

