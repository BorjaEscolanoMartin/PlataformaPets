<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        if (DB::getDriverName() === 'pgsql') {
            DB::statement('
                DELETE FROM hosts h1
                USING hosts h2
                WHERE h1.user_id = h2.user_id
                  AND h1.id > h2.id
            ');
        }

        Schema::table('hosts', function (Blueprint $table) {
            $table->unique('user_id');
        });
    }

    public function down(): void
    {
        Schema::table('hosts', function (Blueprint $table) {
            $table->dropUnique(['user_id']);
        });
    }
};
