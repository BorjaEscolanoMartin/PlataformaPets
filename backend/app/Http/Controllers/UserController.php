<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Log;

class UserController extends Controller
{    public function indexEmpresas()
    {
        return User::where('role', 'empresa')
                   ->with(['host.servicePrices'])
                   ->get();
    }

    public function update(Request $request)
    {
        Log::debug('🟡 Datos recibidos en PUT /user', $request->all());

        $user = $request->user();

        $validated = $request->validate([
            'tamanos_aceptados' => 'nullable|array',
            'especie_preferida' => 'nullable|array',
            'servicios_ofrecidos' => 'nullable|array',
        ]);

        // ✅ Normalizar servicios ofrecidos si vienen en la petición
        if (isset($validated['servicios_ofrecidos'])) {
            $validated['servicios_ofrecidos'] = collect($validated['servicios_ofrecidos'])->map(function ($s) {
                return strtolower(str_replace(' ', '_', trim($s)));
            })->toArray();
        }

        $user->update($validated);

        return response()->json([
            'message' => 'Perfil actualizado correctamente',
            'user' => $user,
        ]);
    }

    public function show($id)
    {
        $user = User::with(['host.reviews.user'])->findOrFail($id);

        if ($user->host) {
            // Calculamos manualmente la media y la inyectamos
            $user->host->average_rating = round($user->host->reviews->avg('rating'), 1);
        }

        return response()->json($user);
    }

}

