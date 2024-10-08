<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB; // Added this line

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('memos', function (Blueprint $table) {
            $table->id();
            $table->text('memo')->default(null)->nullable();
            $table->string('memo_title', 255)->default(null)->nullable();
            $table->unsignedBigInteger('user_id');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade')->onUpdate('cascade');
            $table->unsignedBigInteger('stock_id'); 
            $table->foreign('stock_id')->references('id')->on('stocks')->onDelete('cascade')->onUpdate('cascade'); 
            $table->timestamps();
            $table->softDeletes(); 
            $table->timestamp('order')->default(DB::raw('CURRENT_TIMESTAMP')); // Changed this line
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('memos');
    }
};