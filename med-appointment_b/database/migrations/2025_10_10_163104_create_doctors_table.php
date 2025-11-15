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

            // Thêm department_id
            $table->foreignId('department_id')
                ->nullable()
                ->constrained('departments')
                ->onDelete('set null');

            // specialization_id cũng trỏ đến departments
            $table->foreignId('specialization_id')
                ->nullable()
                ->constrained('departments')
                ->onDelete('set null');

            // Avatar
            $table->string('avatar')->nullable();

            // Trạng thái của bác sĩ
            $table->string('status')->default('active');

            // Giới thiệu
            $table->text('bio')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('doctors');
    }
};