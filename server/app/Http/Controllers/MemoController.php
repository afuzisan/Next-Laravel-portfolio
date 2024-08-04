<?php

namespace App\Http\Controllers;

use App\Models\CategoriesList;
use App\Models\Category;
use Illuminate\Support\Facades\DB;
use App\Models\Memo;
use App\Models\Stock;
use App\Models\User;
use Illuminate\Routing\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Throwable;
use Illuminate\Support\Facades\Log;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;

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
        }, 'links', 'categoriesLists'])->where('id', $user_id)->first();

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
        // リクエストから memo_id 取
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

        // アルファベットを1バイト文字に変換
        $memo = mb_convert_kana($request->input('memo', ''), 'a');
        $memoTitle = mb_convert_kana($request->input('memo_title', ''), 'a');

        Log::info('Received memo:', ['memo' => $memo]);
        Log::info('Received memo_title:', ['memo_title' => $memoTitle]);

        $stock = Stock::where('stock_code', $request->input('stockNumber'))->first();
        // 既のメモを確認
        $existingMemo = Memo::where('stock_id', $stock->id)
            ->where('user_id', Auth::id())
            ->first();

        if ($existingMemo) {
            return response()->json(['message' => 'Memo already exists for this stock'], 400);
        }

        $userId = Auth::id();

        // 「未分類」カテゴリ取得or作成
        $uncategorized = CategoriesList::firstOrCreate(
            ['name' => '未分類', 'user_id' => $userId],
            ['order' => 0]
        );

        $category = new Category([
            'name' => '未分類',
            'user_id' => $userId,
            'stock_id' => $stock->id,
            'categories_list_id' => $uncategorized->id,
        ]);

        $category->save();

        // 新しいメモを作成
        $memo = Memo::create([
            'stock_id' => $stock->id,
            'user_id' => Auth::id(),
            'memo' => $memo ?: '{"blocks":[{"key":"cchb4","text":"","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}',
            'memo_title' => $memoTitle,
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
        $stock = Stock::where('stock_code', $stockNumber)->first();
        $userId = Auth::id();

        $memo = Memo::where('stock_id', $stock->id)
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
        $stock = Stock::where('stock_code', $stockNumber)->first();
        $userId = Auth::id();

        $deletedRows = Memo::where('stock_id', $stock->id)
            ->where('user_id', $userId)
            ->forceDelete();

        if ($deletedRows) {
            DB::table('stock_user')
                ->where('stock_id', $stock->id)
                ->where('user_id', $userId)
                ->Delete();

            DB::table('categories')
                ->where('stock_id', $stock->id)
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
        $stock = Stock::where('stock_code', $request->input('stockNumber'))->first();
        $request->validate([
            'stockNumber' => 'required',
            'memo_title' => [
                'required',
                'string',
                Rule::unique('memos')->where(function ($query) use ($stock, $user) {
                    return $query->where('user_id', $user)
                        ->where('stock_id',  $stock->id);
                }),
            ],
            'memo' => 'required|string',
        ]);

        DB::table('memos')->insert([
            'user_id' => $user,
            'stock_id' => $stock->id,
            'memo_title' => $request->input('memo_title'),
            'memo' => $request->input('memo'), // 修正: リクエストからメモを取得
        ]);

        return response()->json(['message' => 'Memo title created successfully']); // 修: レスンスを追加
    }

    /**
     * を削除する
     * TODO:更新したメモを保存する新しいテーブルの作成
     * TODO:削除したメモを保存する新しいテーブルの成
     * TODO:メモを削除する前に削除メモをコピーして、したメモを保存する新しいテーブルにコピー
     */
    public function memoDelete(Request $request)
    {
        $user = Auth::id();
        $stock = Stock::where('stock_code', $request->input('stockNumber'))->first();
        $memoNumber = $request->input('memoNumber');

        $deletedRows = Memo::where('user_id', $user)
            ->where('stock_id', $stock->id)
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

                    // のタイトルを交換
                    $tempTitle = $newMemo->memo_title;
                    $newMemo->memo_title = $oldMemo->memo_title;
                    $oldMemo->memo_title = $tempTitle;

                    // orderをnewOrder値に書換え
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

    public function PhantomJS()
    {
        $key = env('PHANTOMJS_API_KEY');
        $url = 'http://PhantomJScloud.com/api/browser/v2/'.$key.'/';
        $payload = [
            'url' => 'https://nikkeiyosoku.com/stock/all/',
            'renderType' => 'html',
            'outputAsJson' => true
        ];

        try {
            $response = Http::timeout(60)
                ->withOptions(['verify' => false])
                ->retry(3, 1000)
                ->post($url, $payload);

            if ($response->successful()) {
                $result = $response->json();
                
                // HTMLコンテンツ取得方法変更
                $htmlContent = $result['content']['data'] ?? '';
                
                if (is_string($htmlContent)) {
                    Log::info('受信HTMLコンテンツ', ['content' => substr($htmlContent, 0, 1000)]);
                    
                    $dom = new \DOMDocument();
                    @$dom->loadHTML($htmlContent);
                    $xpath = new \DOMXPath($dom);

                    // stock-txt-xsクラスを持つ要素を取得
                    $elements = $xpath->query("//*[contains(@class, 'stock-txt-xs')]");

                    $stockInfo = [];
                    foreach ($elements as $element) {
                        $stockInfo[] = trim($element->textContent);
                    }

                    Log::info('取得データ', ['stockInfo' => $stockInfo]);

                    $tdElements = $xpath->query('//table[@class="table table-bordered table-striped"]/tbody//td');

                    $stockData = [];
                    foreach ($tdElements as $index => $td) {
                        $key = $index % 4;
                        $value = trim($td->textContent);
                        
                        if ($key == 0) {
                            $stockData[] = [
                                'stock_code' => $value,
                                'stock_name' => '',
                                'Industry' => '',
                                'market' => ''
                            ];
                        } else {
                            $lastIndex = count($stockData) - 1;
                            switch ($key) {
                                case 1:
                                    $stockData[$lastIndex]['stock_name'] = $value;
                                    break;
                                case 2:
                                    $stockData[$lastIndex]['Industry'] = $value;
                                    break;
                                case 3:
                                    $stockData[$lastIndex]['market'] = $value;
                                    break;
                            }
                        }
                    }

                    Log::info('取得データ', ['stockData' => $stockData]);

                    // JSON形式に変換
                    $jsonData = json_encode($stockData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

                    $updatedStockCodes = [];

                    foreach ($stockData as $stock) {
                        DB::table('stocks')->updateOrInsert(
                            ['stock_code' => $stock['stock_code']],
                            [
                                'stock_name' => $stock['stock_name'],
                                'stock_at_edit' => now(),
                                'updated_at' => now(),
                            ]
                        );
                        $updatedStockCodes[] = $stock['stock_code'];
                    }

                    // 更新されなかった銘柄を削除
                    DB::table('stocks')
                        ->whereNotIn('stock_code', $updatedStockCodes)
                        ->delete();

                    return response()->json(['message' => 'データ更新・削除成功', 'data' => $stockData]);
                } else {
                    Log::error('HTMLコンテンツが文字列でない', ['content' => $htmlContent]);
                    return response()->json(['error' => 'HTMLコンテンツ無効'], 500);
                }
            } else {
                Log::error('PhantomJSCloud APIエラー', ['status' => $response->status(), 'body' => $response->body()]);
                return response()->json(['error' => 'APIエラー'], 500);
            }
        } catch (\Exception $e) {
            Log::error('PhantomJSCloud接続エラー', ['message' => $e->getMessage()]);
            return response()->json(['error' => '接続エラー'], 500);
        }
    }
}