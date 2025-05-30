<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('chats', function (Blueprint $table) {
            $table->id();
            $table->string('type')->default('private'); // private, group
            $table->string('name')->nullable(); // Para chats grupales
            $table->json('participants'); // Array de IDs de usuarios
            $table->foreignId('created_by')->constrained('users');
            $table->timestamp('last_activity')->nullable();
            $table->timestamps();
            
            $table->index(['type', 'last_activity']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('chats');
    }
};
