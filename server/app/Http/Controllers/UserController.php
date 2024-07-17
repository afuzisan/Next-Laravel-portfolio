<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Memo;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Throwable;
use Illuminate\Support\Facades\Log;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    public function deleteAccount()
    {
        $userId = Auth::id();

        if ($userId) {
            try {
                $user = User::find($userId);
                if ($user) {
                    $user->delete(); // ここでdeletingイベントが発火

                    return response()->json(['message' => 'アカウントを削除しました。']);
                }
            } catch (\Exception $e) {
                // エラーログに記録
                Log::error('アカウント削除エラー: ' . $e->getMessage());
                return response()->json(['message' => 'アカウント削除に失敗しました。'], 500);
            }
        }

        return response()->json(['message' => 'ユーザーが見つかりません。'], 404);
    }

    public function memo_display_number()
    {
        $userId = Auth::id();
        $memo_display_number = User::where('id', $userId)->value('memo_display_number');
        return response()->json(['memo_display_number' => $memo_display_number]);
    }

    public function memo_display_number_update(Request $request)
    {
        $userId = Auth::id();
        $memo_display_number = $request->input('memo_display_number');
        User::where('id', $userId)->update(['memo_display_number' => $memo_display_number]);
        return response()->json(['message' => '１ページに表示する銘柄数を「' . $memo_display_number . '」に変更しました。']);
    }
}