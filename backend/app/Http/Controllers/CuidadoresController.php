<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use App\Services\GeolocationService;

class CuidadoresController extends Controller
{
    public function index(Request $request)
    {
        $query = User::where('role', 'cuidador')->with('host');

        if ($request->has('servicio')) {
            $servicios = (array) $request->input('servicio');
            $query->where(function ($q) use ($servicios) {
                foreach ($servicios as $servicio) {
                    $q->orWhereJsonContains('servicios_ofrecidos', strtolower(trim($servicio)));
                }
            });
        }

        if ($request->filled('especie')) {
            $query->whereJsonContains('especie_preferida', $request->especie);
        }

        if ($request->filled('tamano')) {
            $query->whereJsonContains('tamanos_aceptados', $request->tamano);
        }

        if ($request->filled('fecha_entrada') || $request->filled('fecha_salida')) {
            $entrada = $request->input('fecha_entrada');
            $salida = $request->input('fecha_salida');

            $query->whereHas('host', function ($hostQuery) use ($entrada, $salida) {
                $hostQuery->whereDoesntHave('reservations', function ($resQuery) use ($entrada, $salida) {
                    $resQuery->where(function ($q) use ($entrada, $salida) {
                        if ($entrada && $salida) {
                            $q->whereBetween('start_date', [$entrada, $salida])
                              ->orWhereBetween('end_date', [$entrada, $salida])
                              ->orWhere(function ($q2) use ($entrada, $salida) {
                                  $q2->where('start_date', '<=', $entrada)
                                     ->where('end_date', '>=', $salida);
                              });
                        } elseif ($entrada) {
                            $q->whereDate('start_date', '<=', $entrada)
                              ->whereDate('end_date', '>=', $entrada);
                        } elseif ($salida) {
                            $q->whereDate('start_date', '<=', $salida)
                              ->whereDate('end_date', '>=', $salida);
                        }
                    });
                });
            });
        }

        $radio = (float) $request->input('distance_km', 25);
        $distanciasPorId = null;

        if ($request->filled('lat') && $request->filled('lon')) {
            $lat = (float) $request->input('lat');
            $lon = (float) $request->input('lon');

            $hostsCercanos = DB::table('hosts')
                ->whereNotNull('latitude')
                ->whereNotNull('longitude')
                ->select(
                    'user_id',
                    DB::raw("6371 * acos(
                        least(1, greatest(-1,
                            cos(radians($lat)) * cos(radians(latitude)) *
                            cos(radians(longitude) - radians($lon)) +
                            sin(radians($lat)) * sin(radians(latitude))
                        ))
                    ) AS distance")
                )
                ->get()
                ->filter(fn($h) => $h->distance <= $radio);

            $ids = $hostsCercanos->pluck('user_id')->unique();
            $query->whereIn('id', $ids);
            $distanciasPorId = $hostsCercanos->keyBy('user_id');
        }

        if ($request->filled('postal_code')) {
            $coords = GeolocationService::fromPostalCode($request->postal_code);

            if ($coords && isset($coords['lat'], $coords['lon'])) {
                $lat = (float) $coords['lat'];
                $lon = (float) $coords['lon'];

                $hostsCercanos = DB::table('hosts')
                    ->whereNotNull('latitude')
                    ->whereNotNull('longitude')
                    ->select(
                        'user_id',
                        DB::raw("6371 * acos(
                            least(1, greatest(-1,
                                cos(radians($lat)) * cos(radians(latitude)) *
                                cos(radians(longitude) - radians($lon)) +
                                sin(radians($lat)) * sin(radians(latitude))
                            ))
                        ) AS distance")
                    )
                    ->get()
                    ->filter(fn($h) => $h->distance <= $radio);

                $ids = $hostsCercanos->pluck('user_id')->unique();
                $query->whereIn('id', $ids);
                $distanciasPorId = $hostsCercanos->keyBy('user_id');
            }
        }

        $cuidadores = $query->get();

        if ($distanciasPorId) {
            $cuidadores = $cuidadores->map(function ($cuidador) use ($distanciasPorId) {
                $cuidador->distance = $distanciasPorId[$cuidador->id]->distance ?? null;
                return $cuidador;
            });
        }

        return response()->json($cuidadores);
    }

    public function show($id)
    {
        $cuidador = User::with('host')->findOrFail($id);

        if (!$cuidador->host) {
            return response()->json([
                'message' => 'Este usuario no tiene perfil de cuidador aún.',
                'cuidador' => $cuidador,
            ], 200);
        }

        return response()->json($cuidador);
    }
}

