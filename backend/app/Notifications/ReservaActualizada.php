<?php

namespace App\Notifications;

use App\Models\Reservation;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class ReservaActualizada extends Notification implements ShouldQueue
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
            'tipo' => 'reserva_actualizada',
            'reserva_id' => $this->reserva->id,
            'estado' => $this->reserva->status,
            'cuidador_nombre' => $this->reserva->host->name ?? null,
            'fecha_inicio' => $this->reserva->start_date,
            'fecha_fin' => $this->reserva->end_date,
        ];
    }
}

