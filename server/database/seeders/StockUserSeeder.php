<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Stock;
use Illuminate\Support\Facades\Storage;

class StockUserSeeder extends Seeder
{
    public function run()
    {
        // $users = User::all();
        // $userStocks = [];



        // $users->each(function ($user) use (&$userStocks) {
        //     $stocks = Stock::inRandomOrder()->take(rand(1, 5))->pluck('id');
        //     $user->stocks()->sync($stocks);
        //     $userStocks[$user->id] = $stocks->toArray();
        // });

        // // 割り当てたstock_idをファイルに保存
        // Storage::disk('local')->put('user_stocks.json', json_encode($userStocks));
    }
}
