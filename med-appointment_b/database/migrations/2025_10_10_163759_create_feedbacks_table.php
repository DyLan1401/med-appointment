<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('feedbacks', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('doctor_id')->nullable();
            $table->unsignedBigInteger('user_id')->nullable();

            $table->unsignedTinyInteger('rating')->default(1)
                ->comment('Giá trị đánh giá từ 1 đến 5');

            $table->text('comment')->nullable();

            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->nullable()->useCurrentOnUpdate();

            $table->foreign('doctor_id')
                ->references('id')
                ->on('doctors')
                ->onDelete('cascade');

            $table->foreign('user_id')
                ->references('id')
                ->on('users')
                ->onDelete('cascade');

        });
    }

    public function down(): void {
        Schema::dropIfExists('feedbacks');
    }
};