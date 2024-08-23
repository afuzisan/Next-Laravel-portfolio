<?php

namespace App\Models;


use Illuminate\Contracts\Auth\MustVerifyEmail as MustVerifyEmailContract;
use Illuminate\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Auth\Notifications\VerifyEmail; 
use Carbon\Carbon;
use App\Models\Category; // Categoryモデルをインポート

class User extends Authenticatable implements MustVerifyEmailContract
{
    use HasFactory, Notifiable, MustVerifyEmail ;
    

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function memos()
    {
        return $this->hasManyThrough(Memo::class, Stock::class);
    }

    public function stocks()
    {
        return $this->belongsToMany(Stock::class, 'stock_user', 'user_id', 'stock_id');
    }

    public function links()
    {
        return $this->hasMany(ExternalLink::class);
    }

    public function categories()
    {
        return $this->hasMany(Category::class, 'user_id');
    }

    public function categoriesLists()
    {
        return $this->hasMany(CategoriesList::class);
    }

    /**
     * Send the email verification notification.
     *
     * @return void
     */
    public function sendEmailVerificationNotification()
    {
        $this->notify(new VerifyEmail); 
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($user) {
            $user->created_at = Carbon::now('Asia/Tokyo');
            $user->updated_at = Carbon::now('Asia/Tokyo');
        });

        static::updating(function ($user) {
            $user->updated_at = Carbon::now('Asia/Tokyo');
        });
    }
}