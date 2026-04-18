<?php

namespace App\Services;

use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;

class GeolocationService
{
    public static function fromPostalCode(string $postalCode): ?array
    {
        $response = Http::withHeaders([
            'User-Agent' => 'pet-hosting-platform/1.0 (contacto@ejemplo.com)',
        ])->get('https://nominatim.openstreetmap.org/search', [
            'q'            => $postalCode,
            'format'       => 'json',
            'limit'        => 1,
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

    /**
     * Returns hosts within $radiusKm of ($lat, $lon), keyed by user_id.
     * Each entry is an stdClass with ->user_id and ->distance (km).
     */
    public static function findNearbyHostsByUser(float $lat, float $lon, float $radiusKm): Collection
    {
        return DB::table('hosts')
            ->whereNotNull('latitude')
            ->whereNotNull('longitude')
            ->select('user_id', DB::raw("
                6371 * acos(
                    least(1, greatest(-1,
                        cos(radians({$lat})) * cos(radians(latitude)) *
                        cos(radians(longitude) - radians({$lon})) +
                        sin(radians({$lat})) * sin(radians(latitude))
                    ))
                ) AS distance
            "))
            ->get()
            ->filter(fn ($h) => $h->distance <= $radiusKm)
            ->keyBy('user_id');
    }
}
