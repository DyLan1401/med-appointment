<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('doctors', function (Blueprint $table) {
            $table->id();

            // Liên kết đến bảng users
            $table->foreignId('user_id')
                ->constrained('users')
                ->onDelete('cascade');

            // Liên kết đến bảng departments (chuyên khoa)
            $table->foreignId('specialization_id')
                ->nullable()
                ->constrained('departments')
                ->onDelete('set null');

            // Ảnh đại diện
            $table->string('avatar')->nullable();

            // Trạng thái làm việc
            $table->string('status')->default('active');

            // Mô tả / giới thiệu bác sĩ
            $table->text('bio')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('doctors');
    }
};