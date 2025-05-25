<?php

namespace App\Events;

use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Queue\SerializesModels;
use App\Models\Message;
use Illuminate\Support\Facades\Log;

class MessageSent implements ShouldBroadcast
{
    use SerializesModels;

    public $message;
    public $sender_id;

    public function __construct(Message $message)
    {
        $this->message = $message;
        $this->sender_id = $message->sender_id;
        Log::info('📢 Constructor MessageSent: mensaje con id ' . $message->id);
    }

    public function broadcastOn()
    {
        Log::info('📢 Evento MessageSent: canal chat.' . $this->message->receiver_id);

        return new PrivateChannel('private-chat.' . $this->message->receiver_id);
    }


    public function broadcastWith()
    {
        return $this->message->toArray();
    }

    public function broadcastAs()
    {
        return 'MessageSent';
    }
}

