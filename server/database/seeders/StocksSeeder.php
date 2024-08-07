<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Http\Controllers\MemoController;

class StocksSeeder extends Seeder
{
    public function run()
    {
        $controller = new MemoController();
        $controller->PhantomJS();
    }
}