<?php

namespace App\Http\Controllers;

use App\Models\Host;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class HostController extends Controller
{
    // ✅ FILTRAR CUIDADORES (público)
    public function buscarCuidadores(Request $request)
    {
        $cuidadores = User::where('role', 'cuidador')->with('hosts');

        // Filtros normales
        if ($request->has('especie')) {
            $cuidadores->whereJsonContains('especie_preferida', $request->especie);
        }

        if ($request->has('tamano')) {
            $cuidadores->whereJsonContains('tamanos_aceptados', $request->tamano);
        }

        if ($request->has('servicio')) {
            $serviciosFiltro = (array) $request->input('servicio');
            $cuidadores->where(function ($q) use ($serviciosFiltro) {
                foreach ($serviciosFiltro as $servicio) {
                    $q->orWhereJsonContains('servicios_ofrecidos', $servicio);
                }
            });
        }

        // Filtro por código postal + radio
        if ($request->filled('postal_code')) {
            $coords = $this->getCoordinatesFromAddress($request->postal_code);

            if ($coords) {
                $lat = (float) $coords['lat'];
                $lon = (float) $coords['lng'];
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

                // Asocia la distancia al cuidador
                $distanciasPorId = $hostsCercanos->keyBy('user_id');

                $cuidadores = $cuidadores->get()->map(function ($cuidador) use ($distanciasPorId) {
                    $cuidador->distance = $distanciasPorId[$cuidador->id]->distance ?? null;
                    return $cuidador;
                });

                return response()->json($cuidadores);
            }
        }

        return response()->json($cuidadores->get());
    }

    // ✅ DEVOLVER HOSTS DEL USUARIO AUTENTICADO
    public function index(Request $request)
    {
        return $request->user()->hosts()->get();
    }

    // ✅ CREAR HOST PARA USUARIO AUTENTICADO
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|in:particular,empresa',
            'location' => 'nullable|string',
        ]);

        $coords = $this->getCoordinatesFromAddress($validated['location'] ?? '');

        $host = $request->user()->hosts()->create([
            ...$validated,
            'latitude' => $coords['lat'] ?? null,
            'longitude' => $coords['lng'] ?? null,
        ]);

        return response()->json($host, 201);
    }

    // ✅ ACTUALIZAR UN HOST DEL USUARIO AUTENTICADO
    public function update(Request $request, $id)
    {
        $host = $request->user()->hosts()->findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|in:particular,empresa',
            'location' => 'nullable|string',
        ]);

        $coords = $this->getCoordinatesFromAddress($validated['location'] ?? '');

        logger('ACTUALIZACIÓN DE HOST', [
            'ubicacion' => $validated['location'],
            'coordenadas' => $coords,
        ]);

        $host->update([
            ...$validated,
            'latitude' => $coords['lat'] ?? null,
            'longitude' => $coords['lng'] ?? null,
        ]);

        return response()->json($host);
    }

    // ✅ ELIMINAR HOST DEL USUARIO
    public function destroy(Request $request, $id)
    {
        $host = $request->user()->hosts()->findOrFail($id);
        $host->delete();

        return response()->json(['message' => 'Cuidador eliminado']);
    }

    // 🔍 Obtener coordenadas desde dirección (Google Maps API)
    private function getCoordinatesFromAddress($address)
    {
        if (!$address) return null;

        $apiKey = env('GOOGLE_MAPS_API_KEY');
        $encodedAddress = urlencode($address);
        $url = "https://maps.googleapis.com/maps/api/geocode/json?address={$encodedAddress}&key={$apiKey}&region=es";

        $response = Http::get($url);

        logger('GOOGLE MAPS API RESPONSE', [
            'url' => $url,
            'status' => $response->status(),
            'body' => $response->json(),
        ]);

        if ($response->successful()) {
            $data = $response->json();

            if (!empty($data['results'][0]['geometry']['location'])) {
                return [
                    'lat' => $data['results'][0]['geometry']['location']['lat'],
                    'lng' => $data['results'][0]['geometry']['location']['lng'],
                ];
            }
        }

        return null;
    }
}

