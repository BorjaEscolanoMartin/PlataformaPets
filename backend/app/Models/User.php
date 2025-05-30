<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use App\Models\Host;
use App\Models\Chat;
use App\Models\Message;

/**
 * @method Chat getPrivateChatWith(int $otherUserId)
 * @property int $id
 * @property string $name
 * @property string $email
 */
class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'postal_code',
        'latitude',
        'longitude',
        'especie_preferida',
        'tamanos_aceptados',
        'servicios_ofrecidos',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'tamanos_aceptados' => 'array',
        'especie_preferida' => 'array',
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'servicios_ofrecidos' => 'array',
    ];

    public function pets()
    {
        return $this->hasMany(Pet::class);
    }

    public function host()
    {
        return $this->hasOne(Host::class);
    }

    public function reservations()
    {
        return $this->hasMany(Reservation::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    /**
     * Chats creados por el usuario
     */
    public function createdChats()
    {
        return $this->hasMany(Chat::class, 'created_by');
    }

    /**
     * Mensajes enviados por el usuario
     */
    public function messages()
    {
        return $this->hasMany(Message::class);
    }

    /**
     * Obtener todos los chats en los que participa el usuario
     */
    public function chats()
    {
        return Chat::whereJsonContains('participants', $this->id)
                   ->orderBy('last_activity', 'desc');
    }

    /**
     * Crear o obtener un chat privado con otro usuario
     */
    public function getPrivateChatWith($otherUserId)
    {
        // Buscar chat existente entre estos dos usuarios
        $existingChat = Chat::where('type', 'private')
            ->where(function ($query) use ($otherUserId) {
                $query->whereJsonContains('participants', $this->id)
                      ->whereJsonContains('participants', $otherUserId);
            })
            ->whereJsonLength('participants', 2)
            ->first();

        if ($existingChat) {
            return $existingChat;
        }

        // Crear nuevo chat privado
        return Chat::create([
            'type' => 'private',
            'participants' => [$this->id, $otherUserId],
            'created_by' => $this->id,
            'last_activity' => now()
        ]);
    }

}

