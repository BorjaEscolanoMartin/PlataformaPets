<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class HostResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                   => $this->id,
            'user_id'              => $this->user_id,
            'name'                 => $this->name,
            'type'                 => $this->type,
            'title'                => $this->title,
            'description'          => $this->description,
            'location'             => $this->location,
            'latitude'             => $this->latitude,
            'longitude'            => $this->longitude,
            'phone'                => $this->phone,
            'experience_years'     => $this->experience_years,
            'experience_details'   => $this->experience_details,
            'has_own_pets'         => $this->has_own_pets,
            'own_pets_description' => $this->own_pets_description,
            'profile_photo'        => $this->profile_photo,
            'profile_photo_url'    => $this->profile_photo_url,
            'cif'                  => $this->cif,
            'fiscal_address'       => $this->fiscal_address,
            'licenses'             => $this->licenses,
            'team_info'            => $this->team_info,
            'average_rating'       => $this->average_rating,
            'created_at'           => $this->created_at,
            'updated_at'           => $this->updated_at,
            'reviews'              => ReviewResource::collection($this->whenLoaded('reviews')),
            'service_prices'       => ServicePriceResource::collection($this->whenLoaded('servicePrices')),
        ];
    }
}
