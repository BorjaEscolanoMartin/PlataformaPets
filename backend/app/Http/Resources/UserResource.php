<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                  => $this->id,
            'name'                => $this->name,
            'email'               => $this->email,
            'role'                => $this->role,
            'postal_code'         => $this->postal_code,
            'latitude'            => $this->latitude,
            'longitude'           => $this->longitude,
            'tamanos_aceptados'   => $this->tamanos_aceptados,
            'especie_preferida'   => $this->especie_preferida,
            'servicios_ofrecidos' => $this->servicios_ofrecidos,
            'email_verified_at'   => $this->email_verified_at,
            'created_at'          => $this->created_at,
            'updated_at'          => $this->updated_at,
            'host'                => HostResource::make($this->whenLoaded('host')),
        ];
    }
}
