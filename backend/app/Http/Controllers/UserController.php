<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Log;

class UserController extends Controller
{
    public function indexEmpresas()
    {
        return User::where('role', 'empresa')->get();
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

        $user->update($validated);

        return response()->json([
            'message' => 'Perfil actualizado correctamente',
            'user' => $user,
        ]);
    }

    public function show($id)
    {
        return User::with('hosts')->findOrFail($id);
    }
}
