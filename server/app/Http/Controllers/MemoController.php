<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use App\Models\Memo;
use App\Models\MemoCategory;
use App\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Throwable;
use Illuminate\Support\Facades\Log; // Added this line

class MemoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // $user_id = Auth::id(); 
        $user_id = 1;

        $user = User::with(['stocks.memos'])->find($user_id);


        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        return response()->json($user);
    }

    public function memo(Request $request){
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

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
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
