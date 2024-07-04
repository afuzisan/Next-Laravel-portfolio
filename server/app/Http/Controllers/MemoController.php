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
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user_id = Auth::id(); // 認証されたユーザーのIDを取得

        $user = User::with(['stocks' => function ($query) use ($user_id) {
            $query->where('user_id', $user_id)->with(['memos' => function ($query) use ($user_id) {
                $query->where('user_id', $user_id); // memosをuser_idでフィルタリング
            }]);
        }, 'links'])->find($user_id);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404); // ユーザーが見つからない場合のエラーレスポンス
        }

        return response()->json($user); // ユーザー情報をJSON形式で返す
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

        // memo_id に基づいて Memo オブジェクトを取得
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
            ->delete();

        if ($deletedRows) {
            DB::table('stock_user')
                ->where('stock_id', $stockNumber)
                ->where('user_id', $userId)
                ->delete();

            return response()->json(['message' => 'Stock deleted successfully']);
        } else {
            return response()->json(['message' => 'Stock not found'], 404);
        }
    }

    /**
     * メモのタイトルを作成追加する
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
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        DB::transaction(function () {
            // Memoの作成と保存
            $memo = new Memo([
                'memo' => 'ここにメモの内容を入力',
                'memo_title' => 'メモのタイトル',
                'user_id' => 1,
                'stock_id' => 1
            ]);
            $memo->save();
        });
    }

    /**
     * Display the specified resource.
     */
    public function show(Memo $memo)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Memo $memo)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Memo $memo)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Memo $memo)
    {
        //
    }
}
