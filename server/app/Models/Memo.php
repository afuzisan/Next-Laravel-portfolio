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
     * すべてのメモとそれに関連するカテゴリーとユーザー情報を取得する
     *
     * @return \Illuminate\Database\Eloquent\Collection|static[]
     */
    public function allGet()
    {
        return self::with(['memoCategory', 'user'])->get();
    }
}
