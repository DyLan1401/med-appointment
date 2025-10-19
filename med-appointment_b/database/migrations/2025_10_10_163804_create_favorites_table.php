<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('favorites', function (Blueprint $table) {
            $table->id(); // Tự động tăng, khóa chính
            $table->unsignedBigInteger('patient_id');
            $table->unsignedBigInteger('doctor_id');
            $table->timestamps(); // để lưu thời gian thêm / xóa

            // Ràng buộc khóa ngoại
            $table->foreign('patient_id')
                ->references('id')
                ->on('patients')
                ->onDelete('cascade');

            $table->foreign('doctor_id')
                ->references('id')
                ->on('doctors')
                ->onDelete('cascade');

            // Tránh trùng lặp (một bệnh nhân không thể yêu thích cùng 1 bác sĩ 2 lần)
            $table->unique(['patient_id', 'doctor_id']);
        });
    }

    public function down(): void {
        Schema::dropIfExists('favorites');
    }
};