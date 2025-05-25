<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('host_id')->constrained('hosts')->onDelete('cascade');
            $table->unsignedTinyInteger('rating'); // 1 a 5
            $table->text('comment');
            $table->timestamps();

            $table->unique(['user_id', 'host_id']); // Solo una reseña por usuario por cuidador
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
