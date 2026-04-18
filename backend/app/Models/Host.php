<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Host extends Model
{
    use HasFactory, SoftDeletes;

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
        // Campos específicos de empresas
        'cif',
        'fiscal_address',
        'licenses',
        'team_info',
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

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function servicePrices()
    {
        return $this->hasMany(ServicePrice::class);
    }

    protected $appends = ['profile_photo_url'];

    public function getAverageRatingAttribute(): ?float
    {
        if (array_key_exists('average_rating', $this->attributes)) {
            $value = $this->attributes['average_rating'];
            return $value !== null ? round((float) $value, 1) : null;
        }

        $avg = $this->reviews()->avg('rating');
        return $avg !== null ? round((float) $avg, 1) : null;
    }

    public function getProfilePhotoUrlAttribute(): ?string
    {
        return $this->profile_photo
            ? asset('storage/' . $this->profile_photo)
            : null;
    }



}

