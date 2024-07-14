<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\User; 
use App\Models\Stock; 

class Memo extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'memo',
        'memo_title',
        'user_id',
        'stock_id',
        'order' 
    ];

    // フラグを追加
    public static $skipCreatedEvent = true;

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
                // ユーザーとストックの関連を追加（重複を避ける）
                if (!$user->stocks()->where('stock_id', $stock->id)->exists()) {
                    $user->stocks()->attach($stock->id, ['created_at' => now(), 'updated_at' => now()]);
                }
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
                    // 新しいストックの関連を追加（重複を避ける）
                    if (!$user->stocks()->where('stock_id', $newStockId)->exists()) {
                        $user->stocks()->attach($newStockId, ['created_at' => now(), 'updated_at' => now()]);
                    }
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