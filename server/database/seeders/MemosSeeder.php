<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Memo;
use Illuminate\Support\Facades\Storage;

class MemosSeeder extends Seeder
{
    public function run(): void
    {
        $userStocks = json_decode(Storage::disk('local')->get('user_stocks.json'), true);

        foreach ($userStocks as $userId => $stocks) {
            foreach ($stocks as $stockId) {
                Memo::factory()->create([
                    'user_id' => $userId,
                    'stock_id' => $stockId
                ]);
            }
        }
    }
}

