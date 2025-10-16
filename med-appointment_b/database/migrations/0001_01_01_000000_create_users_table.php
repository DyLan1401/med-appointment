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
        Schema::create('users', function (Blueprint $table) {
<<<<<<< HEAD
            $table->bigIncrements('id');
            $table->string('name', 100);
            $table->string('email', 150)->unique();

            // ✅ THÊM DÒNG NÀY — để tránh lỗi Seeder: Unknown column 'email_verified_at'
            $table->timestamp('email_verified_at')->nullable(); 
            // (Giúp Laravel lưu thời điểm email được xác thực, cần thiết cho UserFactory mặc định)

            $table->string('password', 255);
=======
            $table->id();
            $table->string('name', 100);
            $table->string('email', 150)->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
>>>>>>> origin/DangThanhPhong-QuanLyUser
            $table->enum('role', ['user', 'doctor', 'admin'])->default('user');

            // ✅ Thêm cả hai trường avatar và avatar_url để tương thích với Seeder và linh hoạt hơn
            $table->string('avatar')->nullable();
            $table->string('avatar_url')->nullable();

            $table->string('phone', 20)->nullable();
            $table->text('insurance_info')->nullable();
<<<<<<< HEAD

            $table->rememberToken(); // ✅ THÊM DÒNG NÀY — để lưu token “Remember me” (Laravel auth mặc định)
            $table->timestamps(); // thời gian tạo & cập nhật
=======
            $table->rememberToken();
            $table->timestamps();
>>>>>>> origin/DangThanhPhong-QuanLyUser
        });

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sessions');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('users');
    }
};