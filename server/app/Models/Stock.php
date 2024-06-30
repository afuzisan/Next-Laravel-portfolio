<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

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
}