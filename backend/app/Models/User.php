<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use App\Models\Host;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
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

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
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


    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */

    public function pets()
    {
        return $this->hasMany(Pet::class);
    }

    public function host()
    {
        return $this->hasOne(Host::class);
    }

    public function hosts()
    {
        return $this->hasMany(Host::class);
    }

    public function reservations()
    {
        return $this->hasMany(Reservation::class);
    }
}
