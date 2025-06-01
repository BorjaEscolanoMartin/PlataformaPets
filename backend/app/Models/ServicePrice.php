<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ServicePrice extends Model
{
    use HasFactory;

    protected $fillable = [
        'host_id',
        'service_type',
        'price',
        'price_unit',
        'description',
    ];

    protected $casts = [
        'price' => 'decimal:2',
    ];

    /**
     * Relación con el Host (cuidador)
     */
    public function host()
    {
        return $this->belongsTo(Host::class);
    }    /**
     * Tipos de servicios disponibles
     */
    public static function getServiceTypes()
    {
        return [
            // Servicios de cuidadores
            'paseo' => 'Paseo',
            'alojamiento' => 'Alojamiento',
            'guarderia' => 'Guardería',
            'cuidado_a_domicilio' => 'Cuidado a domicilio',
            'visitas_a_domicilio' => 'Visitas a domicilio',
            
            // Servicios de empresas
            'veterinario' => 'Servicios veterinarios',
            'adiestrador' => 'Servicios de adiestramiento',
            'emergencias' => 'Atención de emergencias',
            'cirugia' => 'Cirugías',
            'vacunacion' => 'Vacunación',
            'adiestramiento_basico' => 'Adiestramiento básico',
            'adiestramiento_avanzado' => 'Adiestramiento avanzado',
            'modificacion_conducta' => 'Modificación de conducta',
        ];
    }    /**
     * Unidades de precio disponibles
     */
    public static function getPriceUnits()
    {
        return [
            // Unidades para cuidadores
            'por_noche' => 'Por noche',
            'por_dia' => 'Por día',
            'por_hora' => 'Por hora',
            'por_visita' => 'Por visita',
            
            // Unidades para empresas
            'por_consulta' => 'Por consulta',
            'por_sesion' => 'Por sesión',
            'por_intervencion' => 'Por intervención',
            'por_vacuna' => 'Por vacuna',
        ];
    }
}
