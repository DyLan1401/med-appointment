<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('patients', function (Blueprint $table) {
            $table->unsignedBigInteger('id')->primary();
            $table->date('date_of_birth')->nullable();
            $table->enum('gender', ['male', 'female', 'other'])->nullable();
            $table->string('address', 255)->nullable();
            $table->string('health_insurance', 255)->nullable();
            $table->string('google_id', 255)->nullable();
            $table->string('facebook_id', 255)->nullable();

            $table->foreign('id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    public function down(): void {
        Schema::dropIfExists('patients');
    }
};

