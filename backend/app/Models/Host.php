<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Host extends Model
{
    use HasFactory;

    protected $fillable = [
        'type',
        'location',
        'latitude',
        'longitude',
        'description',
        'title',
        'phone',
        'experience_years',
        'experience_details',
        'has_own_pets',
        'own_pets_description',
        'profile_photo',
        'gallery',
    ];

    protected $casts = [
        'gallery' => 'array', 
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function pets()
    {
        return $this->hasMany(Pet::class);
    }

    public function reservations()
    {
        return $this->hasMany(Reservation::class);
    }

}

