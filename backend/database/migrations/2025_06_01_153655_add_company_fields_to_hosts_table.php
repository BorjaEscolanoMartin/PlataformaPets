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
        Schema::table('hosts', function (Blueprint $table) {
            // Campos específicos para empresas
            $table->string('cif', 20)->nullable()->after('profile_photo');
            $table->string('fiscal_address', 500)->nullable()->after('cif');
            $table->text('licenses')->nullable()->after('fiscal_address');
            $table->text('team_info')->nullable()->after('licenses');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('hosts', function (Blueprint $table) {
            $table->dropColumn(['cif', 'fiscal_address', 'licenses', 'team_info']);
        });
    }
};
