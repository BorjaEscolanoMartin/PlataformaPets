<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * D11 — Cuando se haga hard-delete de un usuario o entidad, el histórico que
 * queda asociado (reservas, reseñas, mensajes) debe sobrevivir anonimizado
 * en vez de desaparecer en cascada. Soft deletes (D10) protegen en el camino
 * habitual; estas FKs son el contrato para el borrado físico real.
 */
return new class extends Migration {
    public function up(): void
    {
        Schema::table('reviews', function (Blueprint $table) {
            $table->unsignedBigInteger('user_id')->nullable()->change();
            $table->dropForeign(['user_id']);
            $table->foreign('user_id')->references('id')->on('users')->nullOnDelete();
        });

        Schema::table('reservations', function (Blueprint $table) {
            $table->unsignedBigInteger('user_id')->nullable()->change();
            $table->dropForeign(['user_id']);
            $table->foreign('user_id')->references('id')->on('users')->nullOnDelete();

            $table->unsignedBigInteger('pet_id')->nullable()->change();
            $table->dropForeign(['pet_id']);
            $table->foreign('pet_id')->references('id')->on('pets')->nullOnDelete();

            $table->unsignedBigInteger('host_id')->nullable()->change();
            $table->dropForeign(['host_id']);
            $table->foreign('host_id')->references('id')->on('hosts')->nullOnDelete();
        });

        Schema::table('messages', function (Blueprint $table) {
            $table->unsignedBigInteger('user_id')->nullable()->change();
            $table->dropForeign(['user_id']);
            $table->foreign('user_id')->references('id')->on('users')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('messages', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->unsignedBigInteger('user_id')->nullable(false)->change();
            $table->foreign('user_id')->references('id')->on('users');
        });

        Schema::table('reservations', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropForeign(['pet_id']);
            $table->dropForeign(['host_id']);
            $table->unsignedBigInteger('user_id')->nullable(false)->change();
            $table->unsignedBigInteger('pet_id')->nullable(false)->change();
            $table->unsignedBigInteger('host_id')->nullable(false)->change();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('pet_id')->references('id')->on('pets')->onDelete('cascade');
            $table->foreign('host_id')->references('id')->on('hosts')->onDelete('cascade');
        });

        Schema::table('reviews', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->unsignedBigInteger('user_id')->nullable(false)->change();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }
};
