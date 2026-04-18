<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Pet>
 */
class PetFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id'     => User::factory(),
            'name'        => fake()->firstName(),
            'species'     => fake()->randomElement(['perro', 'gato']),
            'breed'       => fake()->word(),
            'age'         => fake()->numberBetween(1, 15),
            'size'        => fake()->randomElement(['pequeño', 'mediano', 'grande', 'gigante']),
            'description' => fake()->sentence(),
        ];
    }
}
