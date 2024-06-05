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
        Schema::create('memos', function (Blueprint $table) {
            $table->id('memo_id');
            $table->unsignedBigInteger('stock_id');
            $table->unsignedBigInteger('user_id');
            $table->text('memo');
            $table->timestamp('memo_at_create')->useCurrent();
            $table->timestamp('memo_at_edit')->nullable()->default(null)->useCurrentOnUpdate();
            $table->timestamps();
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
