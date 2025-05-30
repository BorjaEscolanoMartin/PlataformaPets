<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Chat;
use App\Models\Message;
use App\Events\MessageSent;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class MessageController extends Controller
{
    /**
     * Display messages for a specific chat.
     */
    public function index(Request $request, string $chatId): JsonResponse
    {
        $user = Auth::user();
        
        $chat = Chat::find($chatId);
        
        if (!$chat) {
            return response()->json([
                'success' => false,
                'message' => 'Chat no encontrado'
            ], 404);
        }

        if (!$chat->hasParticipant($user->id)) {
            return response()->json([
                'success' => false,
                'message' => 'No tienes acceso a este chat'
            ], 403);
        }

        $query = $chat->messages()->with('user');

        // Paginación
        $perPage = $request->get('per_page', 50);
        $messages = $query->orderBy('created_at', 'desc')
                          ->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $messages
        ]);
    }

    /**
     * Store a new message.
     */
    public function store(Request $request, string $chatId): JsonResponse
    {
        $user = Auth::user();
        
        $chat = Chat::find($chatId);
        
        if (!$chat) {
            return response()->json([
                'success' => false,
                'message' => 'Chat no encontrado'
            ], 404);
        }

        if (!$chat->hasParticipant($user->id)) {
            return response()->json([
                'success' => false,
                'message' => 'No tienes acceso a este chat'
            ], 403);
        }

        $request->validate([
            'content' => 'required|string|max:5000',
            'type' => ['sometimes', Rule::in(['text', 'image', 'file'])],
            'metadata' => 'sometimes|array'
        ]);

        $message = Message::create([
            'chat_id' => $chat->id,
            'user_id' => $user->id,
            'content' => $request->content,
            'type' => $request->get('type', 'text'),
            'metadata' => $request->get('metadata', [])
        ]);

        // Actualizar la última actividad del chat
        $chat->updateLastActivity();

        // Cargar relaciones para el evento
        $message->load('user');

        // Disparar evento de broadcasting
        broadcast(new MessageSent($message))->toOthers();

        return response()->json([
            'success' => true,
            'data' => $message,
            'message' => 'Mensaje enviado exitosamente'
        ], 201);
    }

    /**
     * Display the specified message.
     */
    public function show(string $chatId, string $messageId): JsonResponse
    {
        $user = Auth::user();
        
        $chat = Chat::find($chatId);
        
        if (!$chat) {
            return response()->json([
                'success' => false,
                'message' => 'Chat no encontrado'
            ], 404);
        }

        if (!$chat->hasParticipant($user->id)) {
            return response()->json([
                'success' => false,
                'message' => 'No tienes acceso a este chat'
            ], 403);
        }

        $message = $chat->messages()->with('user')->find($messageId);

        if (!$message) {
            return response()->json([
                'success' => false,
                'message' => 'Mensaje no encontrado'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $message
        ]);
    }

    /**
     * Update the specified message.
     */
    public function update(Request $request, string $chatId, string $messageId): JsonResponse
    {
        $user = Auth::user();
        
        $chat = Chat::find($chatId);
        
        if (!$chat) {
            return response()->json([
                'success' => false,
                'message' => 'Chat no encontrado'
            ], 404);
        }

        if (!$chat->hasParticipant($user->id)) {
            return response()->json([
                'success' => false,
                'message' => 'No tienes acceso a este chat'
            ], 403);
        }

        $message = $chat->messages()->find($messageId);

        if (!$message) {
            return response()->json([
                'success' => false,
                'message' => 'Mensaje no encontrado'
            ], 404);
        }

        // Solo el autor puede editar el mensaje
        if ($message->user_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'No tienes permisos para editar este mensaje'
            ], 403);
        }

        $request->validate([
            'content' => 'sometimes|string|max:5000',
            'metadata' => 'sometimes|array'
        ]);

        $updateData = [];
        if ($request->has('content')) {
            $updateData['content'] = $request->content;
        }
        if ($request->has('metadata')) {
            $updateData['metadata'] = $request->metadata;
        }

        if (!empty($updateData)) {
            $message->update($updateData);
        }

        return response()->json([
            'success' => true,
            'data' => $message->fresh('user'),
            'message' => 'Mensaje actualizado exitosamente'
        ]);
    }

    /**
     * Remove the specified message.
     */
    public function destroy(string $chatId, string $messageId): JsonResponse
    {
        $user = Auth::user();
        
        $chat = Chat::find($chatId);
        
        if (!$chat) {
            return response()->json([
                'success' => false,
                'message' => 'Chat no encontrado'
            ], 404);
        }

        if (!$chat->hasParticipant($user->id)) {
            return response()->json([
                'success' => false,
                'message' => 'No tienes acceso a este chat'
            ], 403);
        }

        $message = $chat->messages()->find($messageId);

        if (!$message) {
            return response()->json([
                'success' => false,
                'message' => 'Mensaje no encontrado'
            ], 404);
        }

        // Solo el autor puede eliminar el mensaje
        if ($message->user_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'No tienes permisos para eliminar este mensaje'
            ], 403);
        }

        $message->delete();

        return response()->json([
            'success' => true,
            'message' => 'Mensaje eliminado exitosamente'
        ]);
    }

    /**
     * Mark message as read
     */
    public function markAsRead(string $chatId, string $messageId): JsonResponse
    {
        $user = Auth::user();
        
        $chat = Chat::find($chatId);
        
        if (!$chat || !$chat->hasParticipant($user->id)) {
            return response()->json([
                'success' => false,
                'message' => 'Chat no encontrado o sin acceso'
            ], 404);
        }

        $message = $chat->messages()->find($messageId);

        if (!$message) {
            return response()->json([
                'success' => false,
                'message' => 'Mensaje no encontrado'
            ], 404);
        }

        // No marcar como leído si es el propio mensaje
        if ($message->user_id === $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'No puedes marcar tu propio mensaje como leído'
            ], 400);
        }

        $message->markAsRead();

        return response()->json([
            'success' => true,
            'message' => 'Mensaje marcado como leído'
        ]);
    }

    /**
     * Mark all messages in chat as read
     */
    public function markAllAsRead(string $chatId): JsonResponse
    {
        $user = Auth::user();
        
        $chat = Chat::find($chatId);
        
        if (!$chat || !$chat->hasParticipant($user->id)) {
            return response()->json([
                'success' => false,
                'message' => 'Chat no encontrado o sin acceso'
            ], 404);
        }

        // Marcar como leídos todos los mensajes que no son del usuario actual
        $chat->messages()
             ->where('user_id', '!=', $user->id)
             ->whereNull('read_at')
             ->update(['read_at' => now()]);        return response()->json([
            'success' => true,
            'message' => 'Todos los mensajes marcados como leídos'
        ]);
    }
}
