<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 各Seederを呼び出す
        $this->call([
            UserSeeder::class,
            MemoCategorySeeder::class,
            StocksSeeder::class,
            MemosSeeder::class,
            StockUserSeeder::class,
        ]);
    }
}
