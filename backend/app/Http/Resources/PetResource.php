<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PetResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'          => $this->id,
            'user_id'     => $this->user_id,
            'name'        => $this->name,
            'species'     => $this->species,
            'breed'       => $this->breed,
            'age'         => $this->age,
            'size'        => $this->size,
            'description' => $this->description,
            'photo'       => $this->photo,
            'photo_url'   => $this->photo_url,
            'created_at'  => $this->created_at,
            'updated_at'  => $this->updated_at,
        ];
    }
}
