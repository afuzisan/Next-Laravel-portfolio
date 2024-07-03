<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Memo extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'memo',
        'memo_title',
        'user_id',
        'stock_id'
    ];

    protected static function booted()
    {
        static::deleting(function ($memo) {
            if ($stock = $memo->stock) {
                $stock->users()->detach(); // stock_userの関連を削除
            }
        });

        static::created(function ($memo) {
            $user = User::find($memo->user_id); // Memoに関連付けられたユーザーを取得
            $stock = Stock::find($memo->stock_id); // Memoに関連付けられたストックを取得

            if ($user && $stock) {
                // ユーザーとストックの関連を設定
                $user->stocks()->syncWithoutDetaching([$stock->id]);
            }
        });
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
