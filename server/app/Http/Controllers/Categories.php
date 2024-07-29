<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class Categories extends Controller
{
    public function index(Request $request)
    {
        $user_id = Auth::id(); // 認証されたユーザーのIDを取得
        $pagination = $request->query('param');
        $viewStocks = $request->query('page');
        $category = $request->query('category');
        Log::info('Received param:' . $pagination * $viewStocks);
        Log::info('Received category:' . $category);

        // カテゴリとユーザーIDでstock_idを取得
        $stockIds = DB::table('categories')
            ->where('user_id', $user_id)
            ->where('name', $category)
            ->pluck('stock_id');
        
            Log::info('Received stockIds:' . $stockIds);

        $user = User::with(['stocks' => function ($query) use ($user_id, $pagination, $viewStocks, $stockIds) {
            $query->where('user_id', $user_id)
                  ->whereIn('id', $stockIds) // stock_idで絞り込み
                  ->with(['memos' => function ($query) use ($user_id) {
                      $query->where('user_id', $user_id);
                  }])->skip($pagination * $viewStocks)->take($viewStocks);
        }, 'links', 'categories'])->where('id', $user_id)->first(); 

        if (!$user || $user->stocks->isEmpty()) {
            return response()->json(['message' => 'Stocks not found']);
        }

        // 全体のstocksの数を取得
        $totalStockCount = User::withCount('stocks')->where('id', $user_id)->first()->stocks_count;

        return response()->json(['user' => $user, 'totalStockCount' => $totalStockCount]); // ユーザー情報と全体のstocksの数をJSON形式で返す
    }
}