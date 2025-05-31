<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */    public function up(): void
    {
        Schema::create('service_prices', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('host_id');
            $table->string('service_type'); // 'paseo', 'alojamiento', 'guarderia', 'cuidado_a_domicilio', 'visitas_a_domicilio'
            $table->decimal('price', 8, 2); // Precio con 2 decimales
            $table->string('price_unit')->default('por_noche'); // 'por_noche', 'por_dia', 'por_hora', 'por_visita'
            $table->text('description')->nullable(); // Descripción opcional del precio/servicio
            $table->timestamps();
            
            $table->foreign('host_id')->references('id')->on('hosts')->onDelete('cascade');
            $table->unique(['host_id', 'service_type']); // Un cuidador solo puede tener un precio por servicio
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('service_prices');
    }
};
