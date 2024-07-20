<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Log;
use Illuminate\Support\Facades\Auth;

class LogController extends Controller
{
    public function getAll(Request $request)
    {   
        $user = Auth::user();
        $logs = Log::where('user_id', $user->id)->get();
        return response()->json($logs);
    }
}
