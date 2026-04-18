<?php

namespace App\Policies;

use App\Models\Message;
use App\Models\User;

class MessagePolicy
{
    public function update(User $user, Message $message): bool
    {
        return $message->user_id === $user->id;
    }

    public function delete(User $user, Message $message): bool
    {
        return $message->user_id === $user->id;
    }

    /**
     * Marcar como leído: participante del chat pero no autor del mensaje.
     */
    public function markAsRead(User $user, Message $message): bool
    {
        return $message->user_id !== $user->id
            && $message->chat?->hasParticipant($user->id);
    }
}
