<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UserUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'tamanos_aceptados'     => ['nullable', 'array'],
            'tamanos_aceptados.*'   => ['string', 'max:50'],
            'especie_preferida'     => ['nullable', 'array'],
            'especie_preferida.*'   => ['string', 'max:50'],
            'servicios_ofrecidos'   => ['nullable', 'array'],
            'servicios_ofrecidos.*' => ['string', 'max:100'],
        ];
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('servicios_ofrecidos') && is_array($this->input('servicios_ofrecidos'))) {
            $this->merge([
                'servicios_ofrecidos' => collect($this->input('servicios_ofrecidos'))
                    ->map(fn ($s) => strtolower(str_replace(' ', '_', trim((string) $s))))
                    ->values()
                    ->all(),
            ]);
        }
    }
}
