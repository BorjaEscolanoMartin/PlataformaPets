<?php

namespace Database\Factories;

use App\Models\Host;
use App\Models\Pet;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Reservation>
 */
class ReservationFactory extends Factory
{
    public function definition(): array
    {
        $start = fake()->dateTimeBetween('+1 days', '+30 days');
        $end   = (clone $start)->modify('+' . fake()->numberBetween(1, 10) . ' days');

        return [
            'user_id'      => User::factory(),
            'pet_id'       => Pet::factory(),
            'host_id'      => Host::factory(),
            'service_type' => fake()->randomElement(['alojamiento', 'domicilio', 'visitas', 'guarderia', 'paseo']),
            'start_date'   => $start->format('Y-m-d'),
            'end_date'     => $end->format('Y-m-d'),
            'size'         => 'mediano',
            'status'       => 'pendiente',
        ];
    }
}
