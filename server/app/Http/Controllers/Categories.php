<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\CategoriesList;
use App\Models\Category;
use App\Models\Stock;
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
                  ->whereIn('id', $stockIds)
                  ->with(['memos' => function ($query) use ($user_id) {
                      $query->where('user_id', $user_id);
                  }, 'categories' => function ($query) use ($user_id) {
                      $query->where('user_id', $user_id);
                  }])
                  ->skip($pagination * $viewStocks)->take($viewStocks);
        }, 'links'])->where('id', $user_id)->first(); 

        if (!$user || $user->stocks->isEmpty()) {
            return response()->json(['message' => 'Stocks not found']);
        }

        // 全体のstocksの数を取得
        $totalStockCount = User::withCount('stocks')->where('id', $user_id)->first()->stocks_count;

        Log::info('user:' . $user);
        Log::info('totalStockCount:' . $totalStockCount);

        return response()->json(['user' => $user, 'totalStockCount' => $totalStockCount]); // ユーザー情報と全体のstocksの数をJSON形式で返す
    }

    public function update(Request $request)
    {
        try {
            $stockCode = $request->stockCode;
            $category = $request->category;
            $user_id = Auth::id();

            $stock = Stock::where('stock_code', $stockCode)->first();
            $stockId = $stock->id;
            $updated = Category::where('user_id', $user_id)
                ->where('stock_id', $stockId)
                ->update(['name' => $category]);

            if ($updated) {
                return response()->json(['message' => 'カテゴリを「'.$category.'」に変更しました'], 200);
            } else {
                return response()->json(['message' => 'カテゴリ更新失敗'], 404);
            }
        } catch (\Exception $e) {
            Log::error('カテゴリ更新エラー: ' . $e->getMessage());
            return response()->json(['message' => 'エラー発生'], 500);
        }
    }

    public function getCategoryList()
    {
        $user_id = Auth::id();
        $categories = CategoriesList::where('user_id', $user_id)->pluck('name');
        return response()->json($categories);
    }

    public function deleteCategoryList($category)
    {
        try {
            $user_id = Auth::id();
            if($category !== '未分類'){
                $deleted = CategoriesList::where('user_id', $user_id)->where('name', $category)->delete();
                if($deleted === 0) {
                    return response()->json(['message' => 'カテゴリが見つかりません'], 404);
                }
                $updated = DB::table('categories')->where('user_id', $user_id)->where('name', $category)->update(['name' => '未分類']);
                return response()->json(['message' => 'カテゴリ「'.$category.'」を削除しました'], 200);
            } else {
                return response()->json(['message' => '未分類は削除できません'], 400);
            }
        } catch (\Exception $e) {
            Log::error('カテゴリ削除エラー: ' . $e->getMessage());
            return response()->json(['message' => 'エラーが発生しました'], 500);
        }
    }

    public function editCategoryList($newCategory, $category)
    {
        try {
            $user_id = Auth::id();
            if($newCategory !== '未分類'){
                $updated = CategoriesList::where('user_id', $user_id)->where('name', $category)->update(['name' => $newCategory]);
                DB::table('categories')->where('user_id', $user_id)->where('name', $category)->update(['name' => $newCategory]);
                if($updated === 0) {
                    return response()->json(['message' => 'カテゴリが見つかりません'], 404);
                }
                return response()->json(['message' => 'カテゴリ「'.$newCategory.'」を編集しました'], 200);
            } else {
                return response()->json(['message' => '未分類は編集できません'], 400);
            }
        } catch (\Exception $e) {
            Log::error('カテゴリ編集エラー: ' . $e->getMessage());
            return response()->json(['message' => 'エラーが発生しました'], 500);
        }
    }

    public function AddCategoryList(Request $request)
    {
        $categoryName = $request->categoryName;
        $user_id = Auth::id();

        if (mb_strlen($categoryName) > 15) {
            return response()->json(['message' => 'カテゴリ名は15文字以内にしてください'], 400);
        }

        // 既存のカテゴリ名をチェック
        $existingCategory = CategoriesList::where('user_id', $user_id)
                                          ->where('name', $categoryName)
                                          ->first();

        if ($existingCategory) {
            return response()->json(['message' => 'このカテゴリ名は既に存在します'], 400);
        }

        try {
            $category = CategoriesList::create(['name' => $categoryName, 'user_id' => $user_id]);
            return response()->json(['message' => 'カテゴリ「'.$categoryName.'」を追加しました'], 200);
        } catch (\Exception $e) {
            Log::error('カテゴリ追加エラー: ' . $e->getMessage());
            return response()->json(['message' => 'カテゴリの追加中にエラーが発生しました'], 500);
        }
    }
}