<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ReservationStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'pet_id' => [
                'required',
                'integer',
                Rule::exists('pets', 'id')->where('user_id', $this->user()->id),
            ],
            'host_id' => [
                'required',
                'integer',
                Rule::exists('hosts', 'id')->where('type', 'particular'),
            ],
            'service_type' => ['required', Rule::in(['alojamiento', 'domicilio', 'visitas', 'guarderia', 'paseo'])],
            'address'      => ['nullable', 'string', 'max:255'],
            'start_date'   => ['required', 'date', 'after_or_equal:today'],
            'end_date'     => ['required', 'date', 'after_or_equal:start_date'],
            'size'         => ['nullable', Rule::in(['pequeño', 'mediano', 'grande', 'gigante'])],
        ];
    }

    public function messages(): array
    {
        return [
            'pet_id.exists'         => 'La mascota seleccionada no existe o no te pertenece.',
            'host_id.exists'        => 'El cuidador seleccionado no existe o no acepta reservas (las empresas solo se contactan por chat).',
            'start_date.after_or_equal' => 'La fecha de inicio debe ser hoy o posterior.',
            'end_date.after_or_equal'   => 'La fecha de fin debe ser igual o posterior a la de inicio.',
        ];
    }
}
