<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('memos', function (Blueprint $table) {
            $table->integer('order')->nullable()->change(); // 既存のカラムを変更
        });

        // orderカラムの値を更新
        DB::statement('UPDATE memos SET `order` = `id`');

        // トリガーを作成してデフォルト値をインクリメント
        DB::unprepared('
            CREATE TRIGGER set_order_default BEFORE INSERT ON memos
            FOR EACH ROW
            BEGIN
                IF NEW.`order` IS NULL THEN
                    SET NEW.`order` = (SELECT COALESCE(MAX(`order`), 0) + 1 FROM memos);
                END IF;
            END
        ');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // トリガーを削除
        DB::unprepared('DROP TRIGGER IF EXISTS set_order_default');

        Schema::table('memos', function (Blueprint $table) {
            $table->integer('order')->default(null)->change(); // デフォルト値を削除
        });
    }
};