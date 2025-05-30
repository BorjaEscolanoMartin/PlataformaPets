<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Chat;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class ChatController extends Controller
{
    /**
     * Display a listing of user's chats.
     */
    public function index(): JsonResponse
    {
        $user = Auth::user();
        
        $chats = Chat::whereJsonContains('participants', $user->id)
                    ->with(['latestMessage.user', 'creator'])
                    ->orderBy('last_activity', 'desc')
                    ->get()
                    ->map(function ($chat) use ($user) {
                        // Para chats privados, obtener info del otro participante
                        if ($chat->type === 'private') {
                            $otherParticipantId = collect($chat->participants)
                                ->first(fn($id) => $id != $user->id);
                            $otherParticipant = User::find($otherParticipantId);
                            
                            $chat->other_participant = $otherParticipant ? [
                                'id' => $otherParticipant->id,
                                'name' => $otherParticipant->name,
                            ] : null;
                        }
                        
                        return $chat;
                    });

        return response()->json([
            'success' => true,
            'data' => $chats
        ]);
    }

    /**
     * Store a newly created chat.
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'type' => ['required', Rule::in(['private', 'group'])],
            'participants' => 'required|array|min:1',
            'participants.*' => 'exists:users,id',
            'name' => 'nullable|string|max:255'
        ]);

        $user = Auth::user();
        $participants = array_unique(array_merge([$user->id], $request->participants));        // Para chats privados, verificar que no exista uno
        if ($request->type === 'private' && count($participants) === 2) {
            $otherUserId = collect($participants)->first(fn($id) => $id != $user->id);
            /** @var \App\Models\User $user */
            $existingChat = $user->getPrivateChatWith($otherUserId);
            
            if ($existingChat) {
                return response()->json([
                    'success' => true,
                    'data' => $existingChat->load(['latestMessage.user', 'creator']),
                    'message' => 'Chat existente encontrado'
                ]);
            }
        }

        $chat = Chat::create([
            'type' => $request->type,
            'name' => $request->name,
            'participants' => $participants,
            'created_by' => $user->id,
            'last_activity' => now()
        ]);

        return response()->json([
            'success' => true,
            'data' => $chat->load(['latestMessage.user', 'creator']),
            'message' => 'Chat creado exitosamente'
        ], 201);
    }

    /**
     * Display the specified chat.
     */
    public function show(string $id): JsonResponse
    {
        $user = Auth::user();
        
        $chat = Chat::find($id);
        
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

        $chat->load(['messages.user', 'creator']);

        // Para chats privados, agregar info del otro participante
        if ($chat->type === 'private') {
            $otherParticipantId = collect($chat->participants)
                ->first(fn($id) => $id != $user->id);
            $otherParticipant = User::find($otherParticipantId);
            
            $chat->other_participant = $otherParticipant ? [
                'id' => $otherParticipant->id,
                'name' => $otherParticipant->name,
            ] : null;
        }

        return response()->json([
            'success' => true,
            'data' => $chat
        ]);
    }

    /**
     * Update the specified chat.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $user = Auth::user();
        $chat = Chat::find($id);
        
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
            'name' => 'sometimes|string|max:255',
            'participants' => 'sometimes|array',
            'participants.*' => 'exists:users,id'
        ]);

        $updateData = [];
        
        if ($request->has('name')) {
            $updateData['name'] = $request->name;
        }

        if ($request->has('participants') && $chat->created_by === $user->id) {
            $updateData['participants'] = array_unique($request->participants);
        }

        if (!empty($updateData)) {
            $chat->update($updateData);
        }

        return response()->json([
            'success' => true,
            'data' => $chat->fresh(['latestMessage.user', 'creator']),
            'message' => 'Chat actualizado exitosamente'
        ]);
    }

    /**
     * Remove the specified chat.
     */
    public function destroy(string $id): JsonResponse
    {
        $user = Auth::user();
        $chat = Chat::find($id);
        
        if (!$chat) {
            return response()->json([
                'success' => false,
                'message' => 'Chat no encontrado'
            ], 404);
        }

        // Solo el creador puede eliminar el chat
        if ($chat->created_by !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'No tienes permisos para eliminar este chat'
            ], 403);        }

        $chat->delete();
        
        return response()->json([
            'success' => true,
            'message' => 'Chat eliminado exitosamente'
        ]);
    }

    /**
     * Create or get private chat with another user
     */
    public function createPrivateChat(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'other_user_id' => 'required|exists:users,id|different:' . Auth::id()            ]);

            /** @var \App\Models\User $user */
            $user = Auth::user();
            $chat = $user->getPrivateChatWith($request->other_user_id);

            $chat->load(['latestMessage.user', 'creator']);
            
            // Agregar info del otro participante
            $otherParticipant = User::find($request->other_user_id);
            $chat->other_participant = [
                'id' => $otherParticipant->id,
                'name' => $otherParticipant->name,
            ];

            return response()->json([
                'success' => true,
                'data' => $chat,
                'message' => 'Chat privado obtenido/creado exitosamente'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al crear el chat privado',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
