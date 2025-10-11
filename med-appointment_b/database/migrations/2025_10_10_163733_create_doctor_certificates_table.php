<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('doctor_certificates', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('doctor_id')->nullable();
            $table->string('certificate_name', 255)->nullable();
            $table->string('certificate_type', 100)->nullable();
            $table->string('image', 255)->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->foreign('doctor_id')->references('id')->on('doctors')->onDelete('cascade');
        });
    }

    public function down(): void {
        Schema::dropIfExists('doctor_certificates');
    }
};
