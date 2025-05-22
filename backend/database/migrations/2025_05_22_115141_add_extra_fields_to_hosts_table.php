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
        Schema::table('hosts', function (Blueprint $table) {
            $table->string('title')->nullable();
            $table->string('phone')->nullable();
            $table->integer('experience_years')->nullable();
            $table->text('experience_details')->nullable();
            $table->boolean('has_own_pets')->default(false);
            $table->text('own_pets_description')->nullable();
            $table->string('profile_photo')->nullable();
            $table->json('gallery')->nullable();
        });
    }

    public function down()
    {
        Schema::table('hosts', function (Blueprint $table) {
            $table->dropColumn([
                'title',
                'phone',
                'experience_years',
                'experience_details',
                'has_own_pets',
                'own_pets_description',
                'profile_photo',
                'gallery',
            ]);
        });
    }
};
