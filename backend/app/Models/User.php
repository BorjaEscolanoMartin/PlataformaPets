<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use App\Models\Host;

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

}

