<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Stock; // Stock モデルを使用

class StocksSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Stock モデルを使用して、データベースにレコードを挿入
        Stock::factory()->count(8999)->create(); // 例えば50個の株式データを生成
    }
}
