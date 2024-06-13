<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Memo>
 */
class MemoFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'memo' => $this->faker->text(200), // ランダムなテキストを生成
            'user_id' => \App\Models\User::inRandomOrder()->first()->id, // 既存のユーザーからランダムに1つ選ぶ
            'category_id' => \App\Models\MemoCategory::inRandomOrder()->first()->id, // 既存のカテゴリからランダムに1つ選ぶ
            'memo_at_create' => $this->faker->dateTime, // 作成日時を生成
            'memo_at_edit' => $this->faker->dateTime, // 編集日時を生成
            'created_at' => $this->faker->dateTime, // 作成日時を生成
            'updated_at' => $this->faker->dateTime, // 更新日時を生成
            'deleted_at' => $this->faker->optional()->dateTime, // 削除日時をオプショナルで生成
        ];
    }
}
