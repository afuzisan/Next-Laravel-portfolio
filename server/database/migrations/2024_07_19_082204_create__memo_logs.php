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
        Schema::create('memo_logs', function (Blueprint $table) {
            $table->id();
            $table->text('memo')->nullable();
            $table->string('memo_title', 255)->nullable();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('stock_id');
            $table->timestamp('memo_at_create')->useCurrent();
            $table->timestamp('memo_at_edit')->nullable()->useCurrentOnUpdate();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('memo_logs');
    }
};