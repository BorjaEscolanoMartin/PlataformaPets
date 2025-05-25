<?php

use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\Facades\Log;

Broadcast::channel('private-chat.{userId}', function ($user, $userId) {
    Log::info("Autorizando canal private-chat.{$userId} para usuario {$user->id}");
    return (int) $user->id === (int) $userId;
});
