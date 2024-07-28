<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\User;
use App\Models\Stock;
use Illuminate\Support\Facades\Schema; 
use Illuminate\Database\Schema\Blueprint; 
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

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

        static::creating(function ($memo) {
            $now = Carbon::now('Asia/Tokyo');
            $memo->created_at = $now;
            $memo->updated_at = $now;
        });

        static::created(function ($memo) {
            $user = User::find($memo->user_id);
            $stock = Stock::find($memo->stock_id);

            if ($user && $stock) {
                if (!$user->stocks()->where('stock_id', $stock->id)->exists()) {
                    $user->stocks()->attach($stock->id, [
                        'created_at' => $memo->created_at->format('Y-m-d H:i:s'),
                        'updated_at' => $memo->created_at->format('Y-m-d H:i:s')
                    ]);
                }
            }
        });

        static::updating(function ($memo) {
            $now = Carbon::now('Asia/Tokyo');
            $memo->updated_at = $now;
        });

        static::updated(function ($memo) {
            DB::table('memo_logs')->updateOrInsert(
                [
                    'stock_id' => $memo->stock_id,
                    'memo_title' => $memo->memo_title,
                    'user_id' => $memo->user_id,
                    'updated_at' => $memo->updated_at->format('Y-m-d')
                ],
                [
                    'memo' => $memo->memo,
                ]
            );
        });

        static::updated(function ($memo) {
            if ($memo->isDirty('stock_id')) {
                $user = User::find($memo->user_id);
                $oldStockId = $memo->getOriginal('stock_id');
                $newStockId = $memo->stock_id;

                if ($user) {
                    $user->stocks()->detach($oldStockId);
                    if (!$user->stocks()->where('stock_id', $newStockId)->exists()) {
                        $user->stocks()->attach($newStockId, [
                            'created_at' => $memo->updated_at->format('Y-m-d H:i:s'),
                            'updated_at' => $memo->updated_at->format('Y-m-d H:i:s')
                        ]);
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

    public function categories()
    {
        return $this->hasMany(Category::class, 'stock_id', 'stock_id');
    }

    /**
     * モデルのインデックスを定義
     */
    public function buildIndexes()
    {
        Schema::table('memos', function (Blueprint $table) {
            $table->index('memo');
        });
    }
}