<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Stock extends Model
{
    use SoftDeletes;
    use HasFactory;

    // ユーザーモデルとのリレーションを追加
    public function users()
    {
        return $this->belongsToMany(User::class, 'stock_user');
    }
}