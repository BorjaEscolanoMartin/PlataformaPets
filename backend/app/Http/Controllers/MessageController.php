<?php

namespace App\Http\Controllers;

use App\Http\Requests\MessageStoreRequest;
use App\Http\Requests\MessageUpdateRequest;
use App\Http\Resources\MessageResource;
use App\Models\Chat;
use App\Models\Message;
use App\Events\MessageSent;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class MessageController extends Controller
{
    public function index(Request $request, string $chatId): JsonResponse
    {
        $chat = Chat::find($chatId);

        if (!$chat) {
            return response()->json([
                'success' => false,
                'message' => 'Chat no encontrado',
            ], 404);
        }

        $this->authorize('view', $chat);

        $perPage = $request->get('per_page', 50);
        $messages = $chat->messages()
            ->with('user')
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        return response()->json([
            'success' => true,
            'data'    => $messages,
        ]);
    }

    public function store(MessageStoreRequest $request, string $chatId): JsonResponse
    {
        $chat = Chat::find($chatId);

        if (!$chat) {
            return response()->json([
                'success' => false,
                'message' => 'Chat no encontrado',
            ], 404);
        }

        $this->authorize('view', $chat);

        $validated = $request->validated();

        $message = Message::create([
            'chat_id'  => $chat->id,
            'user_id'  => Auth::id(),
            'content'  => $validated['content'],
            'type'     => $validated['type'] ?? 'text',
            'metadata' => $validated['metadata'] ?? [],
        ]);

        $chat->updateLastActivity();

        $message->load('user');

        broadcast(new MessageSent($message))->toOthers();

        return response()->json([
            'success' => true,
            'data'    => MessageResource::make($message),
            'message' => 'Mensaje enviado exitosamente',
        ], 201);
    }

    public function show(string $chatId, string $messageId): JsonResponse
    {
        $chat = Chat::find($chatId);

        if (!$chat) {
            return response()->json([
                'success' => false,
                'message' => 'Chat no encontrado',
            ], 404);
        }

        $this->authorize('view', $chat);

        $message = $chat->messages()->with('user')->find($messageId);

        if (!$message) {
            return response()->json([
                'success' => false,
                'message' => 'Mensaje no encontrado',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data'    => MessageResource::make($message),
        ]);
    }

    public function update(MessageUpdateRequest $request, string $chatId, string $messageId): JsonResponse
    {
        $chat = Chat::find($chatId);

        if (!$chat) {
            return response()->json([
                'success' => false,
                'message' => 'Chat no encontrado',
            ], 404);
        }

        $this->authorize('view', $chat);

        $message = $chat->messages()->find($messageId);

        if (!$message) {
            return response()->json([
                'success' => false,
                'message' => 'Mensaje no encontrado',
            ], 404);
        }

        $this->authorize('update', $message);

        $validated = $request->validated();

        $updateData = [];
        if (array_key_exists('content', $validated)) {
            $updateData['content'] = $validated['content'];
        }
        if (array_key_exists('metadata', $validated)) {
            $updateData['metadata'] = $validated['metadata'];
        }

        if (!empty($updateData)) {
            $message->update($updateData);
        }

        return response()->json([
            'success' => true,
            'data'    => MessageResource::make($message->fresh('user')),
            'message' => 'Mensaje actualizado exitosamente',
        ]);
    }

    public function destroy(string $chatId, string $messageId): JsonResponse
    {
        $chat = Chat::find($chatId);

        if (!$chat) {
            return response()->json([
                'success' => false,
                'message' => 'Chat no encontrado',
            ], 404);
        }

        $this->authorize('view', $chat);

        $message = $chat->messages()->find($messageId);

        if (!$message) {
            return response()->json([
                'success' => false,
                'message' => 'Mensaje no encontrado',
            ], 404);
        }

        $this->authorize('delete', $message);

        $message->delete();

        return response()->json([
            'success' => true,
            'message' => 'Mensaje eliminado exitosamente',
        ]);
    }

    public function markAsRead(string $chatId, string $messageId): JsonResponse
    {
        $chat = Chat::find($chatId);

        if (!$chat) {
            return response()->json([
                'success' => false,
                'message' => 'Chat no encontrado',
            ], 404);
        }

        $message = $chat->messages()->find($messageId);

        if (!$message) {
            return response()->json([
                'success' => false,
                'message' => 'Mensaje no encontrado',
            ], 404);
        }

        $this->authorize('markAsRead', $message);

        $message->markAsRead();

        return response()->json([
            'success' => true,
            'message' => 'Mensaje marcado como leído',
        ]);
    }

    public function markAllAsRead(string $chatId): JsonResponse
    {
        $user = Auth::user();

        $chat = Chat::find($chatId);

        if (!$chat) {
            return response()->json([
                'success' => false,
                'message' => 'Chat no encontrado',
            ], 404);
        }

        $this->authorize('view', $chat);

        $chat->messages()
            ->where('user_id', '!=', $user->id)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return response()->json([
            'success' => true,
            'message' => 'Todos los mensajes marcados como leídos',
        ]);
    }

    public function getUnreadCount(): JsonResponse
    {
        $user = Auth::user();

        $userChats = Chat::whereJsonContains('participants', $user->id)->pluck('id');

        $unreadCount = Message::whereIn('chat_id', $userChats)
            ->where('user_id', '!=', $user->id)
            ->whereNull('read_at')
            ->count();

        return response()->json([
            'success' => true,
            'count'   => $unreadCount,
        ]);
    }
}
