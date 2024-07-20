<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon; // 追加

class memo_logs extends Model
{
    use HasFactory;

    protected $fillable = [
        'memo', 'memo_at_create', 'memo_at_edit', 'created_at', 'updated_at', 'deleted_at'
    ];

    // 日本時間に変換するアクセサを追加
    public function getCreatedAtAttribute($value)
    {
        return Carbon::parse($value, 'UTC')->setTimezone('Asia/Tokyo');
    }

    public function getUpdatedAtAttribute($value)
    {
        return Carbon::parse($value, 'UTC')->setTimezone('Asia/Tokyo');
    }

    public function getDeletedAtAttribute($value)
    {
        return Carbon::parse($value, 'UTC')->setTimezone('Asia/Tokyo');
    }
}