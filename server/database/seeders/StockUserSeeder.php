<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Stock;

class StockUserSeeder extends Seeder
{
    public function run()
    {
        User::factory()->count(10)->create()->each(function ($user) {
            // ランダムにStockを割り当てる
            $stocks = Stock::inRandomOrder()->take(rand(1, 5))->pluck('id');
            $user->stocks()->attach($stocks);
        });
    }
}
