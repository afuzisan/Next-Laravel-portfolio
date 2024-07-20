<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Log extends Model
{
    use HasFactory;
    protected $memo;
    protected $id;
    protected $memo_title;
    protected $user_id;
    protected $stock_id;
    protected $memo_at_create;
    protected $memo_at_edit;
    protected $created_at;
    protected $updated_at;
    protected $deleted_at;
}
