<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MessageResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'         => $this->id,
            'chat_id'    => $this->chat_id,
            'user_id'    => $this->user_id,
            'content'    => $this->content,
            'type'       => $this->type,
            'metadata'   => $this->metadata,
            'read_at'    => $this->read_at,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'user'       => UserResource::make($this->whenLoaded('user')),
        ];
    }
}
