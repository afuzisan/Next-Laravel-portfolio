<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Stock;

class StockUserSeeder extends Seeder
{
    public function run()
    {
        // すべてのユーザーを取得
        $users = User::all();
        $users->each(function ($user) {
            // ランダムにStockを割り当てる
            $stocks = Stock::inRandomOrder()->take(rand(1, 5))->pluck('id');
            $user->stocks()->sync($stocks);
        });
    }
}
