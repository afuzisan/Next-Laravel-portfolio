<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;


class Kernel extends ConsoleKernel
{
    /**
     * アプリケーションのArtisanコマンドの登録
     */
    protected $commands = [
        // カスタムコマンドの登録
    ];

    /**
     * アプリケーションのスケジュールタスクの定義
     */
    protected function schedule(Schedule $schedule)
    {
        // スケジュールタスクの定義
        $schedule->command('inspire')->hourly();
    }

    /**
     * コンソールカーネルのブートストラップ
     */
    protected function commands()
    {
        $this->load(__DIR__ . '/Commands');

        require base_path('routes/console.php');
    }

    /**
     * アプリケーションのミドルウェア
     */
    protected $middleware = [
        // 既存のミドルウェア
        \App\Http\Middleware\Normalize::class,
    ];

    /**
     * アプリケーションのミドルウェアグループ
     */
    protected $middlewareGroups = [
        'web' => [
            // 'web'グループのミドルウェア
        ],

        'api' => [
            \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
            'throttle:api',
            \Illuminate\Routing\Middleware\SubstituteBindings::class,
            \Illuminate\Session\Middleware\StartSession::class,
            \Illuminate\Auth\Middleware\EnsureEmailIsVerified::class,
        ],
    ];
}
