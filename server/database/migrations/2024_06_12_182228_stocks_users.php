<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('stock_user', function (Blueprint $table) {
            $table->unsignedBigInteger('stock_id');
            $table->unsignedBigInteger('user_id');
            $table->timestamps(); // 作成日と更新日を追加
            $table->foreign('stock_id')->references('id')->on('stocks')->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade')->onUpdate('cascade');
            $table->primary(['stock_id', 'user_id']); 
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stock_user');
    }
};
