<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('posts', function (Blueprint $table) {
            $table->id();

            // Ảnh đại diện của bài viết
            $table->string('image', 255)->nullable();

            // Tiêu đề bài viết
            $table->string('title', 255);



            // Nội dung bài viết
            $table->longText('content')->nullable();

            // Tóm tắt (nếu có)
            $table->text('excerpt')->nullable();

            // Khóa ngoại
            $table->unsignedBigInteger('user_id')->nullable();
            $table->unsignedBigInteger('category_id')->nullable();

            // Thời gian
            $table->timestamps();

            // Khóa ngoại liên kết
            $table->foreign('user_id')
                ->references('id')
                ->on('users')
                ->nullOnDelete();

            $table->foreign('category_id')
                ->references('id')
                ->on('categories_post')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('posts');
    }
};