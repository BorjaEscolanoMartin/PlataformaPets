<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use Illuminate\Http\Request;
use App\Notifications\ReservaSolicitada;
use Illuminate\Support\Facades\Log;
use App\Notifications\ReservaActualizada;

class ReservationController extends Controller
{

public function store(Request $request)
    {        $validated = $request->validate([
            'pet_id' => 'required|exists:pets,id',
            'host_id' => 'required|exists:hosts,id',
            'service_type' => 'required|in:alojamiento,domicilio,visitas,guarderia,paseo',
            'address' => 'nullable|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'size' => 'nullable|in:pequeño,mediano,grande,gigante',
        ]);

        $reservation = $request->user()->reservations()->create($validated);

        Log::info('Reserva creada con ID: ' . $reservation->id);

        $host = $reservation->host;
        if (!$host) {
            Log::warning('Reserva sin host asociado');
            return response()->json(['error' => 'Reserva creada pero sin host'], 500);
        }

        $cuidador = $host->user;
        if (!$cuidador) {
            Log::warning('Host sin user asociado');
            return response()->json(['error' => 'Reserva creada pero host sin user'], 500);
        }

        Log::info('Enviando notificación al cuidador ID: ' . $cuidador->id);
        $cuidador->notifyNow(new ReservaSolicitada($reservation));

        return response()->json($reservation, 201);
    }



    // Cliente: ver sus reservas
    public function index(Request $request)
    {
        return $request->user()->reservations()->with('pet', 'host')->get();
    }

    // Cuidador: ver reservas que recibió
    public function forHost(Request $request)
    {
        $host = $request->user()->host;

        if (!$host) {
            return response()->json(['error' => 'Este usuario no tiene perfil de cuidador'], 404);
        }

        return Reservation::where('host_id', $host->id)
            ->with('pet', 'user')
            ->get();
    }

    // Cuidador: actualizar estado
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|in:pendiente,aceptada,rechazada,cancelada',
        ]);

        $reservation = Reservation::findOrFail($id);

        // Solo permitir que el cuidador correspondiente actualice su reserva
        if ($reservation->host->user_id !== $request->user()->id) {
            return response()->json(['error' => 'No autorizado'], 403);
        }

        $reservation->update($validated);

        // Cargar relaciones para la notificación
        $reservation->load('host', 'user');

        // Notificar al cliente
        $reservation->user->notifyNow(new ReservaActualizada($reservation));

        return response()->json($reservation);
    }
}

