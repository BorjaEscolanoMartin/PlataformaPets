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
    }

    /**
     * Tipos de servicios disponibles
     */
    public static function getServiceTypes()
    {
        return [
            'paseo' => 'Paseo',
            'alojamiento' => 'Alojamiento',
            'guarderia' => 'Guardería',
            'cuidado_a_domicilio' => 'Cuidado a domicilio',
            'visitas_a_domicilio' => 'Visitas a domicilio',
        ];
    }

    /**
     * Unidades de precio disponibles
     */
    public static function getPriceUnits()
    {
        return [
            'por_noche' => 'Por noche',
            'por_dia' => 'Por día',
            'por_hora' => 'Por hora',
            'por_visita' => 'Por visita',
        ];
    }
}
