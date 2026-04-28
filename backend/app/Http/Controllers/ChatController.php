<?php

namespace App\Http\Controllers;

use App\Http\Requests\ChatStoreRequest;
use App\Http\Requests\ChatUpdateRequest;
use App\Http\Requests\CreatePrivateChatRequest;
use App\Http\Resources\ChatResource;
use App\Models\Chat;
use App\Services\ChatService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class ChatController extends Controller
{
    public function __construct(private readonly ChatService $chats)
    {
    }

    public function index(): JsonResponse
    {
        $user = Auth::user();

        $chats = Chat::whereJsonContains('participants', $user->id)
            ->with(['latestMessage.user', 'creator'])
            ->orderBy('last_activity', 'desc')
            ->get();

        $otherIds = $chats
            ->where('type', 'private')
            ->flatMap(fn ($chat) => collect($chat->participants)->filter(fn ($id) => (int) $id !== $user->id))
            ->unique()
            ->values();

        $loadedUsers = \App\Models\User::whereIn('id', $otherIds)->get()->keyBy('id');

        $chats = $chats->map(fn ($chat) => $this->chats->attachOtherParticipant($chat, $user->id, $loadedUsers));

        return response()->json([
            'success' => true,
            'data'    => ChatResource::collection($chats),
        ]);
    }

    public function store(ChatStoreRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $user = Auth::user();

        if ($validated['type'] === 'private' && count($validated['participants']) === 1) {
            $existing = $this->chats->findExistingPrivateChat($user, $validated['participants']);

            if ($existing) {
                return response()->json([
                    'success' => true,
                    'data'    => ChatResource::make($this->chats->attachOtherParticipant($existing, $user->id)),
                    'message' => 'Chat existente encontrado',
                ]);
            }
        }

        $chat = $this->chats->createChat(
            $user,
            $validated['type'],
            $validated['name'] ?? null,
            $validated['participants']
        );

        return response()->json([
            'success' => true,
            'data'    => ChatResource::make($this->chats->attachOtherParticipant($chat, $user->id)),
            'message' => 'Chat creado exitosamente',
        ], 201);
    }

    public function show(string $id): JsonResponse
    {
        $chat = Chat::find($id);

        if (!$chat) {
            return response()->json(['success' => false, 'message' => 'Chat no encontrado'], 404);
        }

        $this->authorize('view', $chat);

        $chat->load(['messages.user', 'creator']);
        $this->chats->attachOtherParticipant($chat, Auth::id());

        return response()->json([
            'success' => true,
            'data'    => ChatResource::make($chat),
        ]);
    }

    public function update(ChatUpdateRequest $request, string $id): JsonResponse
    {
        $user = Auth::user();
        $chat = Chat::find($id);

        if (!$chat) {
            return response()->json(['success' => false, 'message' => 'Chat no encontrado'], 404);
        }

        $this->authorize('update', $chat);

        $validated = $request->validated();
        $updateData = [];

        if (array_key_exists('name', $validated)) {
            $updateData['name'] = $validated['name'];
        }

        if (array_key_exists('participants', $validated) && $chat->created_by === $user->id) {
            $updateData['participants'] = array_values(array_unique($validated['participants']));
        }

        if (!empty($updateData)) {
            $chat->update($updateData);
        }

        return response()->json([
            'success' => true,
            'data'    => ChatResource::make($chat->fresh(['latestMessage.user', 'creator'])),
            'message' => 'Chat actualizado exitosamente',
        ]);
    }

    public function destroy(string $id): JsonResponse
    {
        $chat = Chat::find($id);

        if (!$chat) {
            return response()->json(['success' => false, 'message' => 'Chat no encontrado'], 404);
        }

        $this->authorize('delete', $chat);

        $chat->delete();

        return response()->json([
            'success' => true,
            'message' => 'Chat eliminado exitosamente',
        ]);
    }

    public function createPrivateChat(CreatePrivateChatRequest $request): JsonResponse
    {
        $otherUserId = (int) $request->validated()['other_user_id'];
        $user = Auth::user();

        $chat = $this->chats->getOrCreatePrivateChat($user, $otherUserId);
        $this->chats->attachOtherParticipant($chat, $user->id);

        return response()->json([
            'success' => true,
            'data'    => ChatResource::make($chat),
            'message' => 'Chat privado obtenido/creado exitosamente',
        ]);
    }
}
