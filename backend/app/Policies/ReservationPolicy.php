<?php

namespace App\Policies;

use App\Models\Reservation;
use App\Models\User;

class ReservationPolicy
{
    /**
     * El cuidador dueño del host puede actualizar el estado de la reserva.
     */
    public function update(User $user, Reservation $reservation): bool
    {
        return $reservation->host?->user_id === $user->id;
    }

    /**
     * Solo el cliente que creó la reserva puede cancelarla.
     */
    public function cancel(User $user, Reservation $reservation): bool
    {
        return $reservation->user_id === $user->id;
    }
}
