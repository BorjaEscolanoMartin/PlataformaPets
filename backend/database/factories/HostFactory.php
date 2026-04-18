<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Host>
 */
class HostFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id'     => User::factory(),
            'name'        => fake()->name(),
            'type'        => 'particular',
            'location'    => fake()->city(),
            'latitude'    => fake()->latitude(36, 43),
            'longitude'   => fake()->longitude(-9, 3),
            'description' => fake()->sentence(),
            'title'       => fake()->sentence(3),
            'phone'       => fake()->phoneNumber(),
            'experience_years' => fake()->numberBetween(0, 20),
        ];
    }

    public function empresa(): static
    {
        return $this->state(fn () => [
            'type'           => 'empresa',
            'cif'            => 'B' . fake()->numerify('########'),
            'fiscal_address' => fake()->address(),
        ]);
    }
}
