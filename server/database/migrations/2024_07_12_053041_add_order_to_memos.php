<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB; // Added this line to import the DB facade

return new class extends Migration
{

    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('memos', function (Blueprint $table) {
            $table->integer('order')->nullable(); // orderカラムを追加
        });

        // idカラムの値をorderカラムにコピー
        DB::statement('UPDATE memos SET `order` = `id`');

        // orderカラムをNOT NULLに変更
        Schema::table('memos', function (Blueprint $table) {
            $table->integer('order')->nullable(false)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('memos', function (Blueprint $table) {
            $table->dropColumn('order'); // orderカラムを削除
        });
    }
};