<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Carbon\Carbon;

class ExternalLink extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = 'external_links';
    protected $fillable = [
        'url',
        'site_name',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($externalLink) {
            $externalLink->created_at = Carbon::now('Asia/Tokyo');
            $externalLink->updated_at = Carbon::now('Asia/Tokyo');
        });

        static::updating(function ($externalLink) {
            $externalLink->updated_at = Carbon::now('Asia/Tokyo');
        });
    }
}