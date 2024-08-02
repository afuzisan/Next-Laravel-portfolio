<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Http\Controllers\MemoController;

class UpdateStockData extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'stock:update';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = '株式データ更新';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $controller = new MemoController();
        $controller->PhantomJS(new \Illuminate\Http\Request());
        $this->info('完了');
    }
}