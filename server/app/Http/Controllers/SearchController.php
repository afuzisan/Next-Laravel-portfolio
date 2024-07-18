<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Memo;
use App\Models\Stock;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SearchController extends Controller
{
    public function searchMemo(Request $request)
    {
        $user = Auth::user();
        $memos = Memo::where('user_id', $user->id)->get();
        return response()->json($memos);
    }
}
