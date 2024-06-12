<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class MemoCategory extends Model
{
    use HasFactory;
    use SoftDeletes;

    /**
     * このカテゴリに属するメモを取得するリレーションシップ
     */
    public function memos()
    {
        return $this->hasMany(Memo::class);
    }
}
