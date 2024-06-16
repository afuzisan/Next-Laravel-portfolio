<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\User;

class UserFactory extends Factory
{
    protected $model = User::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->name,
            'email' => $this->faker->unique()->safeEmail,
            'password' => Hash::make('password'), // 実際のパスワードをハッシュ化
            'remember_token' => Str::random(10),
        ];
    }


    /**
     * 株式リレーションを含む
     */
    public function withStocks($count = 2)
    {
        return $this->hasAttached(
            \App\Models\Stock::factory()->count($count),
            [], // 中間テーブルの属性が必要な場合はここに追加
            'stocks'
        );
    }
}
