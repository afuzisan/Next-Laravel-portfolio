<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Memo;
use App\Models\Stock;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class SearchController extends Controller
{
    public function searchMemo(Request $request)
    {
        $user = Auth::user();
        $memos = Memo::with('stock')->where('user_id', $user->id)->get();
        Log::info($memos);
        return response()->json($memos);
    }
}