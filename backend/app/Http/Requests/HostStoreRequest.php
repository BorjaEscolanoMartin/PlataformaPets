<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class HostStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'name'        => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'type'        => ['required', Rule::in(['particular', 'empresa'])],
            'location'    => ['nullable', 'string', 'max:255'],
            'latitude'    => ['nullable', 'numeric', 'between:-90,90'],
            'longitude'   => ['nullable', 'numeric', 'between:-180,180'],

            'title'               => ['nullable', 'string', 'max:255'],
            'phone'               => ['nullable', 'string', 'max:20'],
            'experience_years'    => ['nullable', 'integer', 'min:0', 'max:100'],
            'experience_details'  => ['nullable', 'string'],
            'has_own_pets'        => ['nullable', 'boolean'],
            'own_pets_description'=> ['nullable', 'string'],
            'profile_photo'       => [
                'nullable',
                'image',
                'mimes:jpeg,png,jpg,webp',
                'max:5120',
                'dimensions:min_width=100,min_height=100,max_width=4000,max_height=4000',
            ],

            'cif'            => ['nullable', 'string', 'max:20'],
            'fiscal_address' => ['nullable', 'string', 'max:500'],
            'licenses'       => ['nullable', 'string'],
            'team_info'      => ['nullable', 'string'],
        ];
    }
}
