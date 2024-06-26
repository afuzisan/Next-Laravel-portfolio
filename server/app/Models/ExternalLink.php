<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

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
}
