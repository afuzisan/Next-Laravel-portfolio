<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddTimestampsToStockUser extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('stock_user', function (Blueprint $table) {
            if (!Schema::hasColumn('stock_user', 'created_at') && !Schema::hasColumn('stock_user', 'updated_at')) {
                $table->timestamps(); // 作成日と更新日を追加
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('stock_user', function (Blueprint $table) {
            $table->dropTimestamps(); // 作成日と更新日を削除
        });
    }
}