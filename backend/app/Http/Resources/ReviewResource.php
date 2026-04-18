<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReviewResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'         => $this->id,
            'user_id'    => $this->user_id,
            'host_id'    => $this->host_id,
            'rating'     => $this->rating,
            'comment'    => $this->comment,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'user'       => UserResource::make($this->whenLoaded('user')),
        ];
    }
}
