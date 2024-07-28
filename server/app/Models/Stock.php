<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Carbon\Carbon;

class Stock extends Model
{
    use SoftDeletes;
    use HasFactory;

    protected $fillable =[

    ];

    protected $guarded = [
        'stock_code',
        'stock_name'
    ];

    // ユーザーモデルとのリレーションを追加
    public function users()
    {
        return $this->belongsToMany(User::class, 'stock_user');
    }

    // メモモデルとのリレーションを追加
    public function memos()
    {
        return $this->hasMany(Memo::class, 'stock_id');
    }

    public function categories()
    {
        return $this->hasMany(Category::class, 'stock_id');
    }

    // モデルのイベントをフックしてタイムゾーンを設定
    protected static function booted()
    {
        static::creating(function ($stock) {
            $stock->created_at = Carbon::now('Asia/Tokyo');
            $stock->updated_at = Carbon::now('Asia/Tokyo');
        });

        static::updating(function ($stock) {
            $stock->updated_at = Carbon::now('Asia/Tokyo');
        });
    }
}