<?php

namespace App\Http\Controllers;

use App\Models\Host;
use App\Models\User;
use App\Services\GeolocationService;
use Carbon\Carbon;
use Illuminate\Http\Request;

class CuidadoresController extends Controller
{
    public function index(Request $request)
    {
        $query = User::where('role', 'cuidador')
            ->with([
                'host' => fn ($q) => $q
                    ->withAvg('reviews as average_rating', 'rating')
                    ->withCount('reviews')
                    ->with('servicePrices'),
            ]);

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
            $entrada = $request->filled('fecha_entrada') ? Carbon::parse($request->input('fecha_entrada'))->toDateString() : null;
            $salida  = $request->filled('fecha_salida')  ? Carbon::parse($request->input('fecha_salida'))->toDateString()  : null;

            $hostsOcupados = Host::whereHas('reservations', function ($q) use ($entrada, $salida) {
                $q->where('status', 'aceptada')
                    ->where(function ($inner) use ($entrada, $salida) {
                        if ($entrada && $salida) {
                            $inner->whereDate('start_date', '<=', $salida)
                                ->whereDate('end_date', '>=', $entrada);
                        } elseif ($entrada) {
                            $inner->whereDate('start_date', '<=', $entrada)
                                ->whereDate('end_date', '>=', $entrada);
                        } elseif ($salida) {
                            $inner->whereDate('start_date', '<=', $salida)
                                ->whereDate('end_date', '>=', $salida);
                        }
                    });
            })->pluck('user_id');

            $query->whereNotIn('id', $hostsOcupados);
        }

        $radio = (float) $request->input('distance_km', 25);
        $distanciasPorId = null;

        $coords = $this->resolveSearchCoordinates($request);
        if ($coords) {
            $distanciasPorId = GeolocationService::findNearbyHostsByUser($coords['lat'], $coords['lon'], $radio);
            $query->whereIn('id', $distanciasPorId->keys());
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
        $cuidador = User::with([
            'host' => fn ($q) => $q
                ->withAvg('reviews as average_rating', 'rating')
                ->withCount('reviews')
                ->with(['servicePrices', 'reviews.user']),
        ])->findOrFail($id);

        if (!$cuidador->host) {
            return response()->json([
                'message'  => 'Este usuario no tiene perfil de cuidador aún.',
                'cuidador' => $cuidador,
            ], 200);
        }

        return response()->json($cuidador);
    }

    private function resolveSearchCoordinates(Request $request): ?array
    {
        if ($request->filled('lat') && $request->filled('lon')) {
            return [
                'lat' => (float) $request->input('lat'),
                'lon' => (float) $request->input('lon'),
            ];
        }

        if ($request->filled('postal_code')) {
            return GeolocationService::fromPostalCode($request->input('postal_code'));
        }

        return null;
    }
}
