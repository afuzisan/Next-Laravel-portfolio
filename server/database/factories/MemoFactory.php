<?php

namespace Database\Factories;

use App\Models\Memo;
use App\Models\MemoCategory;
use App\Models\Stock;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class MemoFactory extends Factory
{
    // protected $model = Memo::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::inRandomOrder()->first(),
            'category_id' => MemoCategory::inRandomOrder()->first(),
            'stock_id' => Stock::inRandomOrder()->first(),
            'memo' => $this->faker->text,
            'memo_at_create' => $this->faker->dateTime,
            'memo_at_edit' => $this->faker->dateTime,
            'created_at' => $this->faker->dateTime,
            'updated_at' => $this->faker->dateTime,
            'deleted_at' => $this->faker->optional()->dateTime,
        ];
    }
}
