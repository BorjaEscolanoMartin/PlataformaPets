<?php

namespace App\Notifications;

use App\Models\Reservation;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class ReservaCancelada extends Notification implements ShouldQueue
{
    use Queueable;

    public $reserva;

    public function __construct(Reservation $reserva)
    {
        $this->reserva = $reserva;
    }

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toArray($notifiable)
    {
        return [
            'tipo' => 'reserva_cancelada',
            'reserva_id' => $this->reserva->id,
            'cliente_nombre' => $this->reserva->user->name ?? null,
            'mascota_nombre' => $this->reserva->pet->name ?? null,
            'fecha_inicio' => $this->reserva->start_date,
            'fecha_fin' => $this->reserva->end_date,
            'service_type' => $this->reserva->service_type,
        ];
    }
}
