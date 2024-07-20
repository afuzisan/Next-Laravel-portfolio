<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\memo_logs;
use Illuminate\Support\Facades\Auth;

class LogController extends Controller
{
    public function getAll(Request $request)
    {   
        try {
            $user = Auth::id();
            $logs = memo_logs::where('user_id', $user)->get();
            return response()->json($logs);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error($e->getMessage());
            return response()->json(['error' => 'Internal Server Error'], 500);
        }
    }
}