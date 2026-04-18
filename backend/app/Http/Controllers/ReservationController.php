<?php

namespace App\Http\Controllers;

use App\Http\Requests\ReservationStoreRequest;
use App\Http\Requests\ReservationUpdateRequest;
use App\Http\Resources\ReservationResource;
use App\Models\Reservation;
use App\Notifications\ReservaActualizada;
use App\Notifications\ReservaCancelada;
use App\Notifications\ReservaSolicitada;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ReservationController extends Controller
{
    public function store(ReservationStoreRequest $request)
    {
        $reservation = $request->user()->reservations()->create($request->validated());

        Log::info('reservation.created', [
            'reservation_id' => $reservation->id,
            'user_id'        => $request->user()->id,
        ]);

        $host = $reservation->host;
        if (!$host) {
            Log::warning('reservation.no_host', ['reservation_id' => $reservation->id]);
            return response()->json(['error' => 'Reserva creada pero sin host'], 500);
        }

        $cuidador = $host->user;
        if (!$cuidador) {
            Log::warning('reservation.host_without_user', [
                'reservation_id' => $reservation->id,
                'host_id'        => $host->id,
            ]);
            return response()->json(['error' => 'Reserva creada pero host sin user'], 500);
        }

        $cuidador->notify(new ReservaSolicitada($reservation));

        return ReservationResource::make($reservation->load('pet', 'host'))
            ->response()
            ->setStatusCode(201);
    }

    public function index(Request $request)
    {
        return ReservationResource::collection(
            $request->user()->reservations()->with('pet', 'host.user', 'host.servicePrices')->get()
        );
    }

    public function forHost(Request $request)
    {
        $host = $request->user()->host;

        if (!$host) {
            return response()->json(['error' => 'Este usuario no tiene perfil de cuidador'], 404);
        }

        return ReservationResource::collection(
            Reservation::where('host_id', $host->id)
                ->with('pet', 'user', 'host.servicePrices')
                ->get()
        );
    }

    public function update(ReservationUpdateRequest $request, $id)
    {
        $reservation = Reservation::findOrFail($id);
        $this->authorize('update', $reservation);

        $reservation->update($request->validated());
        $reservation->load('host', 'user', 'pet');

        $reservation->user->notify(new ReservaActualizada($reservation));

        return ReservationResource::make($reservation);
    }

    public function cancel(Request $request, $id)
    {
        $reservation = Reservation::findOrFail($id);
        $this->authorize('cancel', $reservation);

        if (!in_array($reservation->status, ['pendiente', 'aceptada'])) {
            return response()->json(['error' => 'No se puede cancelar esta reserva'], 400);
        }

        $reservation->update(['status' => 'cancelada']);
        $reservation->load('host.user', 'user', 'pet');

        if ($reservation->host && $reservation->host->user) {
            $reservation->host->user->notify(new ReservaCancelada($reservation));
        }

        return response()->json([
            'message'     => 'Reserva cancelada exitosamente',
            'reservation' => ReservationResource::make($reservation),
        ]);
    }
}
