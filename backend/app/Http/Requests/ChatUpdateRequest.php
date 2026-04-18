<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ChatUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'name'           => ['sometimes', 'string', 'max:255'],
            'participants'   => ['sometimes', 'array'],
            'participants.*' => ['integer', 'exists:users,id'],
        ];
    }
}
