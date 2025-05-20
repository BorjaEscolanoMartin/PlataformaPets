<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class CuidadoresController extends Controller
{
    public function index(Request $request)
    {
        $query = User::where('role', 'cuidador')->with('hosts');

        // Filtro por servicios ofrecidos (array de checkboxes)
        if ($request->has('servicio')) {
            $servicios = (array) $request->input('servicio');

            $query->where(function ($q) use ($servicios) {
                foreach ($servicios as $servicio) {
                    $q->orWhereJsonContains('servicios_ofrecidos', strtolower(trim($servicio)));
                }
            });
        }

        // Filtro por especie
        if ($request->filled('especie')) {
            $query->where('especie_preferida', 'like', '%' . $request->especie . '%');
        }

        // Filtro por tamaño
        if ($request->filled('tamaño')) {
            $query->where('tamanos_aceptados', 'like', '%' . $request->tamaño . '%');
        }

        return $query->get();
    }
}



