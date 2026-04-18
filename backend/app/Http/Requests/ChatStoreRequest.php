<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ChatStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'type'           => ['required', Rule::in(['private', 'group'])],
            'participants'   => ['required', 'array', 'min:1'],
            'participants.*' => ['integer', 'exists:users,id'],
            'name'           => ['nullable', 'string', 'max:255'],
        ];
    }
}
