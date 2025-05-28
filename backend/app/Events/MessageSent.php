<?php

namespace App\Events;

use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Queue\SerializesModels;
use App\Models\Message;
use Illuminate\Support\Facades\Log;

class MessageSent implements ShouldBroadcastNow
{
    use SerializesModels;

    public $message;
    public $sender_id;public function __construct(Message $message)
    {
        // Cargar las relaciones necesarias para el broadcasting
        $this->message = $message->load(['sender', 'receiver']);
        $this->sender_id = $message->sender_id;
        Log::info('📢 Constructor MessageSent: mensaje con id ' . $message->id);
    }public function broadcastOn()
    {
        Log::info('📢 Evento MessageSent: enviando a canales para sender ' . $this->message->sender_id . ' y receiver ' . $this->message->receiver_id);

        // Enviar el mensaje tanto al canal del remitente como del receptor
        return [
            new PrivateChannel('private-chat.' . $this->message->sender_id),
            new PrivateChannel('private-chat.' . $this->message->receiver_id),
        ];
    }
    public function broadcastWith()
    {
        $data = $this->message->toArray();
        Log::info('📤 Broadcasting MessageSent data:', $data);
        return $data;
    }

    public function broadcastAs()
    {
        return 'MessageSent';
    }
}

