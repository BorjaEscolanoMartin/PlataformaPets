<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Chat extends Model
{
    protected $fillable = [
        'type',
        'name',
        'participants',
        'created_by',
        'last_activity'
    ];

    protected $casts = [
        'participants' => 'array',
        'last_activity' => 'datetime'
    ];

    /**
     * Relación con los mensajes del chat
     */
    public function messages(): HasMany
    {
        return $this->hasMany(Message::class)->orderBy('created_at', 'asc');
    }

    /**
     * Relación con el usuario que creó el chat
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Obtener el último mensaje del chat
     */
    public function latestMessage()
    {
        return $this->hasOne(Message::class)->latestOfMany();
    }

    /**
     * Verificar si un usuario es participante del chat
     */
    public function hasParticipant($userId): bool
    {
        return in_array($userId, $this->participants ?? []);
    }

    /**
     * Agregar un participante al chat
     */
    public function addParticipant($userId): void
    {
        $participants = $this->participants ?? [];
        if (!in_array($userId, $participants)) {
            $participants[] = $userId;
            $this->update(['participants' => $participants]);
        }
    }

    /**
     * Remover un participante del chat
     */
    public function removeParticipant($userId): void
    {
        $participants = $this->participants ?? [];
        $participants = array_filter($participants, fn($id) => $id != $userId);
        $this->update(['participants' => array_values($participants)]);
    }

    /**
     * Actualizar la última actividad del chat
     */
    public function updateLastActivity(): void
    {
        $this->update(['last_activity' => now()]);
    }
}
