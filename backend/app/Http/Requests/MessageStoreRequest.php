<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class MessageStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'content'  => ['required', 'string', 'max:5000'],
            'type'     => ['sometimes', Rule::in(['text', 'image', 'file'])],
            'metadata' => ['sometimes', 'array'],
        ];
    }
}
