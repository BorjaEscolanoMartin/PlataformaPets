<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Chat>
 */
class ChatFactory extends Factory
{
    public function definition(): array
    {
        return [
            'type'          => 'private',
            'participants'  => [],
            'created_by'    => User::factory(),
            'last_activity' => now(),
        ];
    }
}
