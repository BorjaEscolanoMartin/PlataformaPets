<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class MessageUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'content'  => ['sometimes', 'required', 'string', 'max:5000'],
            'metadata' => ['sometimes', 'array'],
        ];
    }
}
