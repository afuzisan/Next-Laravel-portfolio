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
        Schema::create('links', function (Blueprint $table) {
            $table->id('link_url_id');
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('memo_id');
            $table->unsignedBigInteger('stock_id');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('memo_id')->references('memo_id')->on('memos')->onDelete('cascade');
            $table->foreign('stock_id')->references('stock_id')->on('stocks')->onDelete('cascade');
            $table->string('link_url');
            $table->string('link_name');
            $table->text('link_memo')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('links');
    }
};
