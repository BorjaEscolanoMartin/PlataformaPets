<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class GeolocationService
{
    public static function fromPostalCode(string $postalCode): ?array
    {
        $response = Http::withHeaders([
            'User-Agent' => 'pet-hosting-platform/1.0 (contacto@ejemplo.com)'
        ])->get('https://nominatim.openstreetmap.org/search', [
            'q' => $postalCode,
            'format' => 'json',
            'limit' => 1,
            'countrycodes' => 'es',
        ]);

        if ($response->successful() && isset($response[0])) {
            return [
                'lat' => (float) $response[0]['lat'],
                'lon' => (float) $response[0]['lon'],
            ];
        }

        return null;
    }
}

