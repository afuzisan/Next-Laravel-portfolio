<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Memo extends Model
{
    use HasFactory;
    use SoftDeletes;

    /**
     * このメモが属するカテゴリーを取得するリレーションシップ
     */
    public function memoCategory()
    {
        return $this->belongsTo(MemoCategory::class, 'category_id');
    }

    /**
     * このメモを作成したユーザーを取得するリレーションシップ
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * このメモが属するストックを取得するリレーションシップ
     */
    public function stock()
    {
        return $this->belongsTo(Stock::class, 'stock_id');
    }
}