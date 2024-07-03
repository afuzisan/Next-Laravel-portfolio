<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\DB;

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
            // stock_userテーブルの関連も削除
            // DB::table('stock_user')
            //     ->where('stock_id', $memo->stock_id)
            //     ->where('user_id', $memo->user_id)
            //     ->delete();
        });

        static::created(function ($memo) {
            $user = User::find($memo->user_id); // Memoに関連付けられたユーザーを取得
            $stock = Stock::find($memo->stock_id); // Memoに関連付けられたストックを取得

            if ($user && $stock) {
                // ユーザーとストックの関連を設定
                $user->stocks()->syncWithoutDetaching([$stock->id]);
            }
        });

        static::updated(function ($memo) {
            if ($memo->isDirty('stock_id')) {
                $user = User::find($memo->user_id);
                $oldStockId = $memo->getOriginal('stock_id');
                $newStockId = $memo->stock_id;

                if ($user) {
                    // 古いストックの関連を削除
                    $user->stocks()->detach($oldStockId);
                    // 新しいストックの関連を追加
                    $user->stocks()->syncWithoutDetaching([$newStockId]);
                }
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
