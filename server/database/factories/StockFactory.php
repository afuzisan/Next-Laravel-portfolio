<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Stock;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Stock>
 */
class StockFactory extends Factory
{
    private static $counter = 1;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'id' => self::$counter,
            'stock_code' => self::$counter++, // 1から9999まで順番に増加
            'stock_name' => $this->faker->company,
            'stock_at_create' => $this->faker->dateTimeThisDecade(),
            'stock_at_edit' => $this->faker->dateTimeThisYear(),
            'created_at' => now(),
            'updated_at' => now(),
            'deleted_at' => null,
        ];
    }


    /**
     * メモリレーションを含む
     */
    public function withMemos($count = 5)
    {
        return $this->has(
            \App\Models\Memo::factory()->count($count),
            'memos'
        );
    }
}
