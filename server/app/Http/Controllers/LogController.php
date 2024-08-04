<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\memo_logs;
use App\Models\Stock;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class LogController extends Controller
{
    public function getAll(Request $request)
    {   
        try {
            $user = Auth::id();
            $logs = memo_logs::where('user_id', $user)->get();
            $stockIds = $logs->pluck('stock_id')->unique();
            $stocks = Stock::whereIn('id', $stockIds)->get();
            
            // logsにstocksを追加
            $logsWithStocks = $logs->map(function ($log) use ($stocks) {
                $log->stock = $stocks->firstWhere('id', $log->stock_id);
                return $log;
            });
            
            return response()->json(['logs' => $logsWithStocks]);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return response()->json(['error' => 'Internal Server Error'], 500);
        }
    }

    public function getStockLog(Request $request)
    {
        $user_id = Auth::id();
        $stock = Stock::where('stock_code', $request->query('stockCode'))->first();
        Log::info('stock'.$stock);
        $memo_logs = memo_logs::where('stock_id', $stock->id)->where('user_id', $user_id)->get();
        Log::info('$memo_logs'.$memo_logs);
        // クエリパラメータを使った処理
        return response()->json(['memo_logs' => $memo_logs]);
    }
}