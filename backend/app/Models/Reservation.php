<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    protected $fillable = [
        'user_id',
        'pet_id',
        'host_id',
        'service_type',
        'frequency',
        'address',
        'start_date',
        'end_date',
        'size',
        'status',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
    ];


    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function pet()
    {
        return $this->belongsTo(Pet::class);
    }

    public function host()
    {
        return $this->belongsTo(Host::class);
    }
}

