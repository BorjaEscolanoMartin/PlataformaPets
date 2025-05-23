<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Host extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
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

