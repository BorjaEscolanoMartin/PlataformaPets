<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Host;
use App\Models\ServicePrice;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Facades\Log;

class HostController extends Controller
{
    public function index()
    {
        return Host::where('user_id', Auth::id())->get();
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'description' => 'nullable|string',
                'type' => 'required|in:particular,empresa',
                'location' => 'nullable|string|max:255',
                'latitude' => 'nullable|numeric',
                'longitude' => 'nullable|numeric',

                // Campos comunes
                'title' => 'nullable|string|max:255',
                'phone' => 'nullable|string|max:20',
                'experience_years' => 'nullable|integer|min:0',
                'experience_details' => 'nullable|string',
                'has_own_pets' => 'nullable|boolean',
                'own_pets_description' => 'nullable|string',
                'profile_photo' => 'nullable|image|max:2048',

                // Campos específicos de empresas
                'cif' => 'nullable|string|max:20',
                'fiscal_address' => 'nullable|string|max:500',
                'licenses' => 'nullable|string',
                'team_info' => 'nullable|string',
            ]);

            $validated['user_id'] = Auth::id();

            // Foto de perfil
            if ($request->hasFile('profile_photo') && $request->file('profile_photo')->isValid()) {
                $validated['profile_photo'] = $request->file('profile_photo')->store('hosts/profile_photos', 'public');
            }

            $host = Host::create($validated);

            // Cambio de rol si corresponde
            $user = User::find(Auth::id());
            if ($user && $user->role === 'cliente') {
                if ($validated['type'] === 'particular') {
                    $user->role = 'cuidador';
                } elseif ($validated['type'] === 'empresa') {
                    $user->role = 'empresa';
                }
                $user->save();
            }

            return response()->json($host, 201);

        } catch (\Throwable $e) {
            Log::error('Error al crear host: ' . $e->getMessage(), [
                'exception' => $e,
                'user_id' => Auth::id(),
                'request_data' => $request->all(),
            ]);

            return response()->json([
                'error' => 'Error interno',
                'message' => $e->getMessage()
            ], 500);
        }
    }


    public function show($id)
    {
        $host = Host::findOrFail($id);

        if ($host->user_id !== Auth::id()) {
            return response()->json(['error' => 'No autorizado'], 403);
        }

        return $host;
    }

    public function update(Request $request, $id)
    {
        $host = Host::findOrFail($id);

        if ($host->user_id !== Auth::id()) {
            return response()->json(['error' => 'No autorizado'], 403);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'type' => 'sometimes|in:particular,empresa',
            'location' => 'nullable|string|max:255',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',

            // Campos comunes
            'title' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:20',
            'experience_years' => 'nullable|integer|min:0',
            'experience_details' => 'nullable|string',
            'has_own_pets' => 'nullable|boolean',
            'own_pets_description' => 'nullable|string',
            'profile_photo' => 'sometimes|nullable|image|max:2048',

            // Campos específicos de empresas
            'cif' => 'nullable|string|max:20',
            'fiscal_address' => 'nullable|string|max:500',
            'licenses' => 'nullable|string',
            'team_info' => 'nullable|string',
        ]);

        // Foto de perfil
        if ($request->hasFile('profile_photo')) {
            $validated['profile_photo'] = $request->file('profile_photo')->store('hosts/profile_photos', 'public');
        }

        $host->update($validated);

        return response()->json($host);
    }

    public function destroy($id)
    {
        $host = Host::findOrFail($id);

        if ($host->user_id !== Auth::id()) {
            return response()->json(['error' => 'No autorizado'], 403);
        }

        $host->delete();

        return response()->json(['message' => 'Host eliminado']);
    }

    /**
     * Obtener precios de servicios de un host
     */
    public function getServicePrices($hostId)
    {
        $host = Host::findOrFail($hostId);
        
        if ($host->user_id !== Auth::id()) {
            return response()->json(['error' => 'No autorizado'], 403);
        }

        return response()->json($host->servicePrices);
    }

    /**
     * Actualizar precios de servicios
     */
    public function updateServicePrices(Request $request, $hostId)
    {
        $host = Host::findOrFail($hostId);
        
        if ($host->user_id !== Auth::id()) {
            return response()->json(['error' => 'No autorizado'], 403);
        }

        $validated = $request->validate([
            'prices' => 'required|array',
            'prices.*.service_type' => 'required|in:paseo,alojamiento,guarderia,cuidado_a_domicilio,visitas_a_domicilio,veterinario,adiestrador,emergencias,cirugia,vacunacion,adiestramiento_basico,adiestramiento_avanzado,modificacion_conducta',
            'prices.*.price' => 'required|numeric|min:0',
            'prices.*.price_unit' => 'required|in:por_noche,por_dia,por_hora,por_visita,por_consulta,por_sesion,por_intervencion,por_vacuna',
            'prices.*.description' => 'nullable|string|max:500',
        ]);

        // Eliminar precios existentes para estos servicios
        $serviceTypes = collect($validated['prices'])->pluck('service_type');
        ServicePrice::where('host_id', $host->id)
            ->whereIn('service_type', $serviceTypes)
            ->delete();

        // Crear nuevos precios
        foreach ($validated['prices'] as $priceData) {
            ServicePrice::create([
                'host_id' => $host->id,
                'service_type' => $priceData['service_type'],
                'price' => $priceData['price'],
                'price_unit' => $priceData['price_unit'],
                'description' => $priceData['description'] ?? null,
            ]);
        }

        return response()->json([
            'message' => 'Precios actualizados correctamente',
            'prices' => $host->fresh()->servicePrices
        ]);
    }
}
