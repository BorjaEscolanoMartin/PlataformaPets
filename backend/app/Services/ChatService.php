<?php

namespace App\Services;

use App\Models\Chat;
use App\Models\User;
use Illuminate\Support\Collection;

class ChatService
{
    public function getOrCreatePrivateChat(User $user, int $otherUserId): Chat
    {
        $chat = $user->getPrivateChatWith($otherUserId);

        return $chat->load(['latestMessage.user', 'creator']);
    }

    public function createChat(User $creator, string $type, ?string $name, array $participantIds): Chat
    {
        $participants = array_values(array_unique(array_merge([$creator->id], $participantIds)));

        return Chat::create([
            'type'          => $type,
            'name'          => $name,
            'participants'  => $participants,
            'created_by'    => $creator->id,
            'last_activity' => now(),
        ])->load(['latestMessage.user', 'creator']);
    }

    public function findExistingPrivateChat(User $user, array $participantIds): ?Chat
    {
        $otherUserId = collect($participantIds)->first(fn ($id) => (int) $id !== $user->id);

        if (!$otherUserId) {
            return null;
        }

        $existing = Chat::where('type', 'private')
            ->whereJsonContains('participants', $user->id)
            ->whereJsonContains('participants', (int) $otherUserId)
            ->first();

        return $existing?->load(['latestMessage.user', 'creator']);
    }

    public function attachOtherParticipant(Chat $chat, int $currentUserId, ?Collection $loadedUsers = null): Chat
    {
        if ($chat->type !== 'private') {
            return $chat;
        }

        $otherUserId = collect($chat->participants)
            ->first(fn ($id) => (int) $id !== $currentUserId);

        if ($otherUserId === null) {
            $chat->other_participant = null;
            return $chat;
        }

        $otherUser = $loadedUsers
            ? $loadedUsers->get($otherUserId)
            : User::find($otherUserId);

        $chat->other_participant = $otherUser ? [
            'id'   => $otherUser->id,
            'name' => $otherUser->name,
        ] : null;

        return $chat;
    }
}
