<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Message;
use Illuminate\Support\Facades\Auth;
use App\Events\MessageSent;
use Illuminate\Support\Facades\Log;

class MessageController extends Controller
{    // Enviar mensaje
    public function store(Request $request)
    {
        $validated = $request->validate([
            'receiver_id' => 'required|exists:users,id',
            'content' => 'required|string',
        ]);

        $message = Message::create([
            'sender_id' => Auth::id(),
            'receiver_id' => $validated['receiver_id'],
            'content' => $validated['content'],
        ]);        // Cargar las relaciones para el response
        $message->load(['sender', 'receiver']);

        Log::info('🧪 Emitiendo evento MessageSent con ID ' . $message->id);
        Log::info('📊 Datos del mensaje: ', [
            'id' => $message->id,
            'sender_id' => $message->sender_id,
            'receiver_id' => $message->receiver_id,
            'content' => $message->content,
            'sender_name' => $message->sender->name ?? 'Unknown',
            'receiver_name' => $message->receiver->name ?? 'Unknown'
        ]);

        broadcast(new MessageSent($message));

        Log::info('✅ Evento emitido MessageSent enviado a cola');

        return response()->json($message, 201);
    }    // Listar mensajes con otro usuario
    public function index($userId)
    {
        $authId = Auth::id();

        $messages = Message::where(function ($query) use ($authId, $userId) {
            $query->where('sender_id', $authId)
                  ->where('receiver_id', $userId);
        })->orWhere(function ($query) use ($authId, $userId) {
            $query->where('sender_id', $userId)
                  ->where('receiver_id', $authId);
        })
        ->with(['sender', 'receiver'])
        ->orderBy('created_at')
        ->get();

        return response()->json($messages);
    }
}