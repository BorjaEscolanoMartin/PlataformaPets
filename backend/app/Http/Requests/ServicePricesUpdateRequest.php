<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ServicePricesUpdateRequest extends FormRequest
{
    public const SERVICE_TYPES = [
        'paseo', 'alojamiento', 'guarderia', 'cuidado_a_domicilio', 'visitas_a_domicilio',
        'veterinario', 'adiestrador', 'emergencias', 'cirugia', 'vacunacion',
        'adiestramiento_basico', 'adiestramiento_avanzado', 'modificacion_conducta',
    ];

    public const PRICE_UNITS = [
        'por_noche', 'por_dia', 'por_hora', 'por_visita',
        'por_consulta', 'por_sesion', 'por_intervencion', 'por_vacuna',
    ];

    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'prices'                 => ['required', 'array', 'min:1'],
            'prices.*.service_type'  => ['required', Rule::in(self::SERVICE_TYPES)],
            'prices.*.price'         => ['required', 'numeric', 'min:0', 'max:99999.99'],
            'prices.*.price_unit'    => ['required', Rule::in(self::PRICE_UNITS)],
            'prices.*.description'   => ['nullable', 'string', 'max:500'],
        ];
    }
}
