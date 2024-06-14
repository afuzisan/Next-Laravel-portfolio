<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Stock;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Stock>
 */
class StockFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $uniqueNumber = $this->faker->unique()->numberBetween(1000, 9999); // 4桁のユニークな数字を生成

        return [
            'id' => $uniqueNumber,
            'stock_code' => $uniqueNumber, // ユニークな数字を生成して設定
            'stock_name' => $this->faker->company,
            'stock_at_create' => $this->faker->dateTimeThisDecade(),
            'stock_at_edit' => $this->faker->dateTimeThisYear(),
            'created_at' => now(),
            'updated_at' => now(),
            'deleted_at' => null,
        ];
    }
}
