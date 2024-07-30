<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Support\Facades\DB;
use App\Models\Memo;
use App\Models\User;
use Illuminate\Routing\Controller;
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
            }, 'categories'])->skip($pagination * $viewStocks)->take($viewStocks); // categoriesリレーションを追加
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
        $id = $request->input('id');

        Log::info('Received id: ' . $id); // 取得したIDをログに出力

        // 特定のメモ情報を取得
        $memo = null;
        if ($id) {
            $memo = Memo::find($id); // プライマリーキーに一致する行をすべて取得
            if (!$memo) {
                return response()->json(['message' => 'Memo not found'], 404);
            }
        } else {
            return response()->json(['message' => 'ID is required'], 400);
        }

        return response()->json($memo);
    }

    public function memoUpdate(Request $request)
    {
        // リクエストから memo_id を取得
        $memoId = $request->input('memo_id');
        $newContent = $request->input('memo');
        $order = $request->input('order');

        // memo_id に基づいて Memo ブジェクトを取得
        $memo = Memo::find($memoId);

        if ($memo) {
            // createdイベントをスキップするフラグを設定
            Memo::$skipCreatedEvent = false;

            // メモの内容を更新
            $memo->memo = $newContent;
            $memo->order = $order;
            $memo->save();

            // フラグをリセット
            Memo::$skipCreatedEvent = true;

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
            'memo' => 'nullable|string',
            'memo_title' => 'nullable|string',
        ]);

        // 既存のメモを確認
        $existingMemo = Memo::where('stock_id', $request->input('stockNumber'))
            ->where('user_id', Auth::id())
            ->first();

        if ($existingMemo) {
            return response()->json(['message' => 'Memo already exists for this stock'], 400);
        }

        Category::create([
            'name' => '未分類',
            'user_id' => Auth::id(),
            'stock_id' => $request->input('stockNumber'),
        ]);

        // 新しいメモを作成
        $memo = Memo::create([
            'stock_id' => $request->input('stockNumber'),
            'user_id' => Auth::id(),
            'memo' => $request->input('memo', '{"blocks":[{"key":"cchb4","text":"","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}'),
            'memo_title' => $request->input('memo_title', null),
            'order' => 0
        ]);

        return response()->json(['message' => 'Stock stored successfully', 'memo' => $memo]);
    }
    /**
     * メモのタイトルを編集
     */
    public function memoEdit(Request $request)
    {
        $stockNumber = $request->input('stock');
        $userId = Auth::id();

        $memo = Memo::where('stock_id', $stockNumber)
            ->where('user_id', $userId)
            ->get();

        return response()->json(['message' => 'Memo edited successfully', 'memo' => $memo]);
    }

    public function memoTitleUpdate(Request $request)
    {
        $memoData = $request->input('memos');
        Log::info('Received memo:', ['memos' => $memoData]);

        foreach ($memoData as $data) {
            $memo = Memo::find($data['id']);
            if ($memo && $memo->memo_title !== $data['memo_title']) {
                $memo->memo_title = $data['memo_title'];
                $memo->save();
            }
        }

        return response()->json(['message' => 'Memo titles updated successfully']);
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
        $user = Auth::id();
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
            'memo' => 'required|string',
        ]);

        DB::table('memos')->insert([
            'user_id' => $user,
            'stock_id' => $request->input('stockNumber'),
            'memo_title' => $request->input('memo_title'),
            'memo' => $request->input('memo'), // 修正: リクエストからメモを取得
        ]);

        return response()->json(['message' => 'Memo title created successfully']); // 修正: レスポンスを追加
    }

    /**
     * メモを削除する
     * TODO:更新したメモを保存する新しいテーブルの作成
     * TODO:削除したメモを保存する新しいテーブルの成
     * TODO:メモを削除する前に削除したメモをコピーして、したメモを保存する新しいテーブルにコピー
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
        $pairs = $request->input('pairs');
        Log::info('Received pairs:', $pairs);

        DB::transaction(function () use ($pairs) {
            // すべてのペアを一度に処理するためのマッピング
            $memos = Memo::whereIn('id', array_merge(array_column($pairs, 'newId'), array_column($pairs, 'oldId')))->get()->keyBy('id');

            foreach ($pairs as $pair) {
                $newId = $pair['newId'];
                $oldId = $pair['oldId'];
                $newOrder = $pair['newOrder'];

                Log::info("Processing pair: newId={$newId}, oldId={$oldId}");

                $newMemo = $memos->get($newId);
                $oldMemo = $memos->get($oldId);

                if ($newMemo && $oldMemo) {
                    Log::info("Found memos: newMemo={$newMemo->order}, oldMemo={$oldMemo->order}");

                    // メモの内容を交換
                    $tempMemo = $newMemo->memo;
                    $newMemo->memo = $oldMemo->memo;
                    $oldMemo->memo = $tempMemo;

                    // メモのタイトルを交換
                    $tempTitle = $newMemo->memo_title;
                    $newMemo->memo_title = $oldMemo->memo_title;
                    $oldMemo->memo_title = $tempTitle;

                    // orderをnewOrderの値に書換え
                    $newMemo->order = $newOrder;

                    // 保存前のログ出力
                    Log::info("Before save: newMemo=" . json_encode($newMemo->toArray()));
                    Log::info("Before save: oldMemo=" . json_encode($oldMemo->toArray()));

                    $newMemo->save();
                    $oldMemo->save(); // コメントを解

                    // 保存後のログ出力
                    Log::info("After save: newMemo=" . json_encode($newMemo->toArray()));
                    Log::info("After save: oldMemo=" . json_encode($oldMemo->toArray()));

                    Log::info("Memos exchanged: newMemo={$newMemo->id}, oldMemo={$oldMemo->id}");
                } else {
                    Log::warning("Memo not found: newId={$newId}, oldId={$oldId}");
                }
            }
        });

        return response()->json(['message' => 'Memos exchanged successfully']);
    }



}