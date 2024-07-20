<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MemoController;
use App\Http\Controllers\ExternalLinkController;
use App\Http\Controllers\LogController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\SearchController;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard/reviews/', [MemoController::class, 'index']);
    Route::post('dashboard/memo', [MemoController::class, 'memo']);
    Route::post('dashboard/memoUpdate', [MemoController::class, 'memoUpdate']);
    Route::post('dashboard/memoEdit', [MemoController::class, 'memoEdit']);
    Route::post('dashboard/memoTitle/update', [MemoController::class, 'memoTitleUpdate']);
    Route::post('dashboard/stockStore', [MemoController::class, 'stockStore']);
    Route::post('dashboard/stockDelete', [MemoController::class, 'stockDelete']);
    Route::post('dashboard/memoTitleCreate', [MemoController::class, 'memoTitleCreate']);
    Route::post('dashboard/memo/exchange', [MemoController::class, 'exchange']);
    Route::delete('dashboard/memoDelete', [MemoController::class, 'memoDelete']);
    Route::get('mypage/externallinks', [ExternalLinkController::class, 'index']);
    Route::post('mypage/externallinks/create', [ExternalLinkController::class, 'create']);
    Route::post('mypage/externallinks/delete', [ExternalLinkController::class, 'destroy']);
    Route::get('mypage/memo_display_number', [UserController::class, 'memo_display_number']);
    Route::post('mypage/memo_display_number_update', [UserController::class, 'memo_display_number_update']);
    Route::post('mypage/deleteAccount', [UserController::class, 'deleteAccount']);
    Route::get('search/memo', [SearchController::class, 'searchMemo']);
    Route::post('Log/getAll', [LogController::class, 'getAll']);
});
