<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
       Schema::create('doctors', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
    $table->foreignId('specialization_id')
          ->nullable()
          ->constrained('departments')
          ->onDelete('set null');
    $table->string('status')->default('active');
    $table->text('bio')->nullable();
    $table->timestamps();
});
    }

    public function down(): void {
        Schema::dropIfExists('doctors');
    }
};
