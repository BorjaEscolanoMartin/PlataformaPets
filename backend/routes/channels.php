<?php

use Illuminate\Support\Facades\Broadcast;
use App\Models\Chat;

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Here you may register all of the event broadcasting channels that your
| application supports. The given channel authorization callbacks are
| used to check if an authenticated user can listen to the channel.
|
*/

// Canal privado para chats individuales
Broadcast::channel('chat.{chatId}', function ($user, $chatId) {
    $chat = Chat::find($chatId);
    
    if (!$chat) {
        return false;
    }
    
    // Verificar que el usuario sea participante del chat
    return $chat->hasParticipant($user->id);
});

// Canal de presencia para mostrar usuarios online en un chat
Broadcast::channel('chat.{chatId}.presence', function ($user, $chatId) {
    $chat = Chat::find($chatId);
    
    if (!$chat || !$chat->hasParticipant($user->id)) {
        return false;
    }
    
    return [
        'id' => $user->id,
        'name' => $user->name,
    ];
});

// Canal privado para notificaciones de usuario
Broadcast::channel('user.{userId}', function ($user, $userId) {
    return (int) $user->id === (int) $userId;
});
