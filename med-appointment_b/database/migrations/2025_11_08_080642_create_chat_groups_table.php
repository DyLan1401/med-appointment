<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('chat_groups', function (Blueprint $table) {
            $table->id();

            // Tên nhóm chat
            $table->string('name');

            // 🔹 Liên kết tới department (bộ phận / khoa)
            // Thay thế hoàn toàn specialty / specialty_name trước đây
            $table->foreignId('department_id')
                ->nullable()
                ->constrained('departments')
                ->onDelete('set null');

            // 🔸 Nếu bạn muốn tạo nhóm theo chuyên môn chi tiết hơn
            // uncomment nếu cần:
            /*
            $table->foreignId('specialization_id')
                ->nullable()
                ->constrained('departments')
                ->onDelete('set null');
            */

            // Mô tả nhóm chat
            $table->text('description')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('chat_groups');
    }
};