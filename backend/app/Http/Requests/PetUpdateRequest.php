<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PetUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'name'        => ['sometimes', 'required', 'string', 'max:255'],
            'species'     => ['sometimes', 'required', 'string', 'max:100'],
            'breed'       => ['nullable', 'string', 'max:100'],
            'age'         => ['nullable', 'integer', 'min:0', 'max:60'],
            'size'        => ['nullable', 'string', 'max:50'],
            'description' => ['nullable', 'string', 'max:2000'],
            'photo'       => [
                'nullable',
                'image',
                'mimes:jpeg,png,jpg,webp',
                'max:5120',
                'dimensions:min_width=100,min_height=100,max_width=4000,max_height=4000',
            ],
        ];
    }
}
