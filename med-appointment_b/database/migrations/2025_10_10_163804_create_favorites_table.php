<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Tạo bảng favorites (danh sách bác sĩ yêu thích)
     */
    public function up(): void
    {
        Schema::create('favorites', function (Blueprint $table) {
            $table->id(); 
            $table->unsignedBigInteger('user_id'); 
            $table->unsignedBigInteger('doctor_id'); 
            $table->timestamps(); 

            // 🔐 Ràng buộc khóa ngoại
            $table->foreign('user_id')
                ->references('id')
                ->on('users')
                ->onDelete('cascade'); 

            $table->foreign('doctor_id')
                ->references('id')
                ->on('doctors')
                ->onDelete('cascade'); 

            
            $table->unique(['user_id', 'doctor_id']);
        });
    }

    
    public function down(): void
    {
        Schema::dropIfExists('favorites');
    }
};