<?php

namespace App\Notifications;

use App\Models\Reservation;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\BroadcastMessage;

class ReservaSolicitada extends Notification implements ShouldQueue
{
    use Queueable;

    public $reserva;

    public function __construct(Reservation $reserva)
    {
        $this->reserva = $reserva;
    }

    public function via($notifiable)
    {
        return ['database']; // Luego agregaremos 'broadcast' aquí también si quieres tiempo real
    }

    public function toArray($notifiable)
    {
        return [
            'tipo' => 'reserva_solicitada',
            'reserva_id' => $this->reserva->id,
            'usuario_nombre' => $this->reserva->user->name,
            'mascota_nombre' => $this->reserva->pet->name ?? null,
            'fecha_inicio' => $this->reserva->start_date,
            'fecha_fin' => $this->reserva->end_date,
        ];
    }
}

