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
        $cuidadores = User::where('role', 'cuidador')->with('hosts');

        // Filtro por servicios ofrecidos
        if ($request->has('servicio')) {
            $servicios = (array) $request->input('servicio');
            $cuidadores->where(function ($q) use ($servicios) {
                foreach ($servicios as $servicio) {
                    $q->orWhereJsonContains('servicios_ofrecidos', strtolower(trim($servicio)));
                }
            });
        }

        // Filtro por especie
        if ($request->filled('especie')) {
            $cuidadores->where('especie_preferida', 'like', '%' . $request->especie . '%');
        }

        // Filtro por tamaño
        if ($request->filled('tamano')) {
            $cuidadores->where('tamanos_aceptados', 'like', '%' . $request->tamano . '%');
        }

        // Filtro por disponibilidad en fechas
        if ($request->filled('fecha_entrada') && $request->filled('fecha_salida')) {
            $entrada = $request->input('fecha_entrada');
            $salida = $request->input('fecha_salida');

            $cuidadores->whereHas('hosts', function ($hostQuery) use ($entrada, $salida) {
                $hostQuery->whereDoesntHave('reservations', function ($resQuery) use ($entrada, $salida) {
                    $resQuery->where(function ($q) use ($entrada, $salida) {
                        $q->whereBetween('start_date', [$entrada, $salida])
                          ->orWhereBetween('end_date', [$entrada, $salida])
                          ->orWhere(function ($q2) use ($entrada, $salida) {
                              $q2->where('start_date', '<=', $entrada)
                                  ->where('end_date', '>=', $salida);
                          });
                    });
                });
            });
        }

        // Filtro por distancia geográfica usando código postal
        if ($request->filled('postal_code')) {
            $coords = GeolocationService::fromPostalCode($request->postal_code);

            if ($coords) {
                $lat = (float) $coords['lat'];
                $lon = (float) $coords['lon'];
                $radio = (float) $request->input('distance_km', 25);

                // Buscar hosts con coordenadas y calcular distancia
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
                $cuidadores->whereIn('id', $ids);

                // Asocia la distancia al cuidador (después del ->get())
                $distanciasPorId = $hostsCercanos->keyBy('user_id');

                $cuidadores = $cuidadores->get()->map(function ($cuidador) use ($distanciasPorId) {
                    $cuidador->distance = $distanciasPorId[$cuidador->id]->distance ?? null;
                    return $cuidador;
                });

                return response()->json($cuidadores);
            }
        }

        // Si no hay filtro de ubicación, devolvemos cuidadores normales
        return $cuidadores->get();
    }
}
