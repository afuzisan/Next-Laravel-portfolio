<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use App\Models\Memo;
use App\Models\User;
use Illuminate\Routing\Controller; // Added this line
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Throwable;
use Illuminate\Support\Facades\Log;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Validation\Rule;

class MemoController extends Controller
{
    /**
     * 初期画面表示時の処理
     */
    public function index(Request $request)
    {
        $user_id = Auth::id(); // 認証されたユーザーのIDを取得
        $pagination = $request->query('param');
        $viewStocks = $request->query('page');
        Log::info('Received param:' . $pagination * $viewStocks);

        $user = User::with(['stocks' => function ($query) use ($user_id, $pagination, $viewStocks) {
            $query->where('user_id', $user_id)->with(['memos' => function ($query) use ($user_id) {
                $query->where('user_id', $user_id);
            }])->skip($pagination * $viewStocks)->take($viewStocks);
        }, 'links'])->where('id', $user_id)->first();

        if (!$user || $user->stocks->isEmpty()) {
            return response()->json(['message' => 'Stocks not found']);
        }

        // 全体のstocksの数を取得
        $totalStockCount = User::withCount('stocks')->where('id', $user_id)->first()->stocks_count;

        return response()->json(['user' => $user, 'totalStockCount' => $totalStockCount]); // ユーザー情報と全体のstocksの数をJSON形式で返す
    }

    public function memo(Request $request)
    {
        $id = $request->query('id');
        // 特定のメモ情報を取得
        $memo = null;
        if ($id) {
            $memo = Memo::select('memo')->find($id);
            if (!$memo) {
                return response()->json(['message' => 'Memo not found'], 404);
            }
        }
        $response = $memo;
        return response()->json($response);
    }

    public function memoUpdate(Request $request)
    {
        // リクエストから memo_id を取得
        $memoId = $request->input('memo_id');
        $newContent = $request->input('memo');

        // memo_id に基づいて Memo ブジェクトを取得
        $memo = Memo::find($memoId);

        if ($memo) {
            // メモの内容を更新
            $memo->memo = $newContent;
            $memo->save();

            return response()->json(['message' => 'Memo updated successfully', 'memo' => $memo]);
        } else {
            return response()->json(['message' => 'Memo not found'], 404);
        }
    }

    /**
     * 銘柄登録
     */
    public function stockStore(Request $request)
    {
        $request->validate([
            'stockNumber' => 'required|integer',
        ]);

        $memo = Memo::create([
            'stock_id' => $request->input('stockNumber'),
            'user_id' => Auth::id(),
            'memo' => null,
            'memo_title' => null
        ]);

        return response()->json(['message' => 'Stock stored successfully', 'memo' => $memo]);
    }

    /**
     * 銘柄の削除
     */
    public function stockDelete(Request $request)
    {
        $stockNumber = $request->input('stockNumber');
        $userId = Auth::id();

        $deletedRows = Memo::where('stock_id', $stockNumber)
            ->where('user_id', $userId)
            ->forceDelete();

        if ($deletedRows) {
            DB::table('stock_user')
                ->where('stock_id', $stockNumber)
                ->where('user_id', $userId)
                ->Delete();

            return response()->json(['message' => 'Stock deleted successfully']);
        } else {
            return response()->json(['message' => 'Stock not found'], 404);
        }
    }

    /**
     * メモのタイルを作成追
     */
    public function memoTitleCreate(Request $request)
    {

        $user = 3;
        // $user = Auth::id();
        $request->validate([
            'stockNumber' => 'required|integer',
            'memo_title' => [
                'required',
                'string',
                Rule::unique('memos')->where(function ($query) use ($request, $user) {
                    return $query->where('user_id', $user)
                        ->where('stock_id', $request->input('stockNumber'));
                }),
            ],
        ]);

        DB::table('memos')->insert([
            'user_id' => $user,
            'stock_id' => $request->input('stockNumber'),
            'memo_title' => $request->input('memo_title'),
        ]);
    }

    /**
     * メモを削除する
     * TODO:更新したメモを保存する新しいテーブルの作成
     * TODO:削除したメモを保存する新しいテーブルの作成
     * TODO:メモを削除する前に削除したメモをコピーして、削除したメモを保存する新しいテーブルにコピー
     */
    public function memoDelete(Request $request)
    {
        $user = Auth::id();
        $stockNumber = $request->input('stockNumber');
        $memoNumber = $request->input('memoNumber');

        $deletedRows = Memo::where('user_id', $user)
            ->where('stock_id', $stockNumber)
            ->where('id', $memoNumber)
            ->forceDelete();

        if ($deletedRows) {
            return response()->json(['message' => 'Memo deleted successfully']);
        } else {
            return response()->json(['message' => 'Memo not found'], 404);
        }
    }
    public function exchange(Request $request)
    {
        $newId = $request->input('newId');
        $oldId = $request->input('oldId');

        DB::transaction(function () use ($newId, $oldId) {
            $newMemo = Memo::find($newId);
            $oldMemo = Memo::find($oldId);

            if ($newMemo && $oldMemo) {
                // メモの内容を交換
                $tempMemo = $newMemo->memo;
                $newMemo->memo = $oldMemo->memo;
                $oldMemo->memo = $tempMemo;

                // メモのタイトルを交換
                $tempTitle = $newMemo->memo_title;
                $newMemo->memo_title = $oldMemo->memo_title;
                $oldMemo->memo_title = $tempTitle;

                // stock_idを交換
                $tempStockId = $newMemo->stock_id;
                $newMemo->stock_id = $oldMemo->stock_id;
                $oldMemo->stock_id = $tempStockId;

                $newMemo->save();
                $oldMemo->save();
            }
        });

        return response()->json(['message' => 'Memos exchanged successfully']);
    }
}