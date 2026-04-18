<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReservationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'           => $this->id,
            'user_id'      => $this->user_id,
            'pet_id'       => $this->pet_id,
            'host_id'      => $this->host_id,
            'service_type' => $this->service_type,
            'address'      => $this->address,
            'start_date'   => optional($this->start_date)->toDateString(),
            'end_date'     => optional($this->end_date)->toDateString(),
            'size'         => $this->size,
            'status'       => $this->status,
            'created_at'   => $this->created_at,
            'updated_at'   => $this->updated_at,
            'pet'          => PetResource::make($this->whenLoaded('pet')),
            'host'         => HostResource::make($this->whenLoaded('host')),
            'user'         => UserResource::make($this->whenLoaded('user')),
        ];
    }
}
