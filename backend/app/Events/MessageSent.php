<?php

namespace App\Events;

use App\Models\Message;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class MessageSent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $message;

    /**
     * Create a new event instance.
     */
    public function __construct(Message $message)
    {
        $this->message = $message;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        $channels = [new PrivateChannel('chat.' . $this->message->chat_id)];

        // Emitir también al canal personal de cada destinatario (distinto del emisor)
        // para que los badges de mensajes no leídos se actualicen en tiempo real
        // aunque el destinatario no tenga el chat abierto.
        $participants = $this->message->chat->participants ?? [];
        foreach ($participants as $userId) {
            if ((int) $userId !== (int) $this->message->user_id) {
                $channels[] = new PrivateChannel('user.' . $userId);
            }
        }

        return $channels;
    }

    /**
     * The event's broadcast name.
     */
    public function broadcastAs(): string
    {
        return 'message.sent';
    }

    /**
     * Get the data to broadcast.
     */
    public function broadcastWith(): array
    {
        return [
            'message' => [
                'id' => $this->message->id,
                'chat_id' => $this->message->chat_id,
                'user_id' => $this->message->user_id,
                'content' => $this->message->content,
                'type' => $this->message->type,
                'metadata' => $this->message->metadata,
                'created_at' => $this->message->created_at,
                'user' => [
                    'id' => $this->message->user->id,
                    'name' => $this->message->user->name,
                ]
            ]
        ];
    }
}
