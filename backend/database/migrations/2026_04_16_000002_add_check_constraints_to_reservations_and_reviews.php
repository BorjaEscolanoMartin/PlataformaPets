<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        if (DB::getDriverName() !== 'pgsql') {
            return;
        }

        DB::statement('
            ALTER TABLE reservations
            ADD CONSTRAINT reservations_dates_chk
            CHECK (start_date <= end_date)
        ');

        DB::statement('
            ALTER TABLE reviews
            ADD CONSTRAINT reviews_rating_chk
            CHECK (rating BETWEEN 1 AND 5)
        ');
    }

    public function down(): void
    {
        if (DB::getDriverName() !== 'pgsql') {
            return;
        }

        DB::statement('ALTER TABLE reservations DROP CONSTRAINT IF EXISTS reservations_dates_chk');
        DB::statement('ALTER TABLE reviews DROP CONSTRAINT IF EXISTS reviews_rating_chk');
    }
};
