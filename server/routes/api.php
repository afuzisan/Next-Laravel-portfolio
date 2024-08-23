<?php

use App\Http\Controllers\Categories;
use App\Http\Controllers\categoryController;
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

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard/reviews/', [MemoController::class, 'index']);
    Route::post('dashboard/memo', [MemoController::class, 'memo']);
    Route::post('dashboard/memoUpdate', [MemoController::class, 'memoUpdate']);
    Route::post('dashboard/memoEdit', [MemoController::class, 'memoEdit']);
    Route::post('dashboard/memoTitle/delete', [MemoController::class, 'memoTitleDelete']);
    Route::post('dashboard/memoTitle/update', [MemoController::class, 'memoTitleUpdate']);
    Route::post('dashboard/stockStore', [MemoController::class, 'stockStore']);
    Route::post('dashboard/stockDelete', [MemoController::class, 'stockDelete']);
    Route::post('dashboard/memoTitleCreate', [MemoController::class, 'memoTitleCreate']);
    Route::post('dashboard/memo/exchange', [MemoController::class, 'exchange']);
    Route::delete('dashboard/memoDelete', [MemoController::class, 'memoDelete']);
    Route::post('dashboard/PhantomJS', [MemoController::class, 'PhantomJS']);

    Route::get('mypage/externallinks', [ExternalLinkController::class, 'index']);
    Route::post('mypage/externallinks/create', [ExternalLinkController::class, 'create']);
    Route::post('mypage/externallinks/delete', [ExternalLinkController::class, 'destroy']);
    Route::get('mypage/memo_display_number', [UserController::class, 'memo_display_number']);
    Route::post('mypage/memo_display_number_update', [UserController::class, 'memo_display_number_update']);
    Route::post('mypage/deleteAccount', [UserController::class, 'deleteAccount']);
    Route::post('mypage/passwordReset', [UserController::class, 'passwordReset']);

    Route::get('search/memo', [SearchController::class, 'searchMemo']);

    Route::get('log/getAll', [LogController::class, 'getAll']);
    Route::get('log/getStockLog', [LogController::class, 'getStockLog']);

    Route::get('Categories/index', [Categories::class, 'index']);
    Route::post('Categories/update', [Categories::class, 'update']);
    Route::get('Categories/getCategoryList', [Categories::class, 'getCategoryList']);
    Route::delete('Categories/deleteCategoryList/{category}', [Categories::class, 'deleteCategoryList']);
    Route::put('Categories/editCategoryList/{newCategory}/{category}', [Categories::class, 'editCategoryList']);
    Route::post('Categories/AddCategoryList', [Categories::class, 'AddCategoryList']);
});
