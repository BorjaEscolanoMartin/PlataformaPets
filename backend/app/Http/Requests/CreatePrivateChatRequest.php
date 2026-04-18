<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreatePrivateChatRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'other_user_id' => [
                'required',
                'integer',
                'exists:users,id',
                'not_in:' . $this->user()?->id,
            ],
        ];
    }
}
