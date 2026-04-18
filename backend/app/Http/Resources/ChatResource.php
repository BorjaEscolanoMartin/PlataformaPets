<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ChatResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                => $this->id,
            'type'              => $this->type,
            'name'              => $this->name,
            'participants'      => $this->participants,
            'created_by'        => $this->created_by,
            'last_activity'     => $this->last_activity,
            'created_at'        => $this->created_at,
            'updated_at'        => $this->updated_at,
            'creator'           => UserResource::make($this->whenLoaded('creator')),
            'latest_message'    => MessageResource::make($this->whenLoaded('latestMessage')),
            'messages'          => MessageResource::collection($this->whenLoaded('messages')),
            'other_participant' => $this->when(
                isset($this->other_participant),
                fn () => $this->other_participant,
            ),
        ];
    }
}
