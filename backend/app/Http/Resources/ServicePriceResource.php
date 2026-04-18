<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ServicePriceResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'           => $this->id,
            'host_id'      => $this->host_id,
            'service_type' => $this->service_type,
            'price'        => $this->price,
            'price_unit'   => $this->price_unit,
            'description'  => $this->description,
            'created_at'   => $this->created_at,
            'updated_at'   => $this->updated_at,
        ];
    }
}
