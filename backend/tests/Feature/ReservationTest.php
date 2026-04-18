<?php

namespace Tests\Feature;

use App\Models\Host;
use App\Models\Pet;
use App\Models\Reservation;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class ReservationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Notification::fake();
    }

    private function cliente(): User
    {
        return User::factory()->create(['role' => 'cliente']);
    }

    private function hostFor(?User $owner = null): Host
    {
        $owner ??= User::factory()->create(['role' => 'cuidador']);
        return Host::factory()->for($owner)->create();
    }

    public function test_client_can_create_reservation_for_own_pet(): void
    {
        $client = $this->cliente();
        $pet    = Pet::factory()->for($client)->create();
        $host   = $this->hostFor();

        $response = $this->actingAs($client)->postJson('/api/reservations', [
            'pet_id'       => $pet->id,
            'host_id'      => $host->id,
            'service_type' => 'paseo',
            'start_date'   => now()->addDay()->toDateString(),
            'end_date'     => now()->addDays(2)->toDateString(),
        ]);

        $response->assertCreated();

        $this->assertDatabaseHas('reservations', [
            'user_id' => $client->id,
            'pet_id'  => $pet->id,
            'host_id' => $host->id,
        ]);
    }

    public function test_idor_blocked_when_reserving_with_someone_elses_pet(): void
    {
        $attacker    = $this->cliente();
        $victim      = $this->cliente();
        $victimsPet  = Pet::factory()->for($victim)->create();
        $host        = $this->hostFor();

        $response = $this->actingAs($attacker)->postJson('/api/reservations', [
            'pet_id'       => $victimsPet->id,
            'host_id'      => $host->id,
            'service_type' => 'paseo',
            'start_date'   => now()->addDay()->toDateString(),
            'end_date'     => now()->addDays(2)->toDateString(),
        ]);

        $response->assertStatus(422)->assertJsonValidationErrors('pet_id');
        $this->assertDatabaseMissing('reservations', ['pet_id' => $victimsPet->id]);
    }

    public function test_end_date_before_start_date_is_rejected(): void
    {
        $client = $this->cliente();
        $pet    = Pet::factory()->for($client)->create();
        $host   = $this->hostFor();

        $this->actingAs($client)->postJson('/api/reservations', [
            'pet_id'       => $pet->id,
            'host_id'      => $host->id,
            'service_type' => 'paseo',
            'start_date'   => now()->addDays(5)->toDateString(),
            'end_date'     => now()->addDays(2)->toDateString(),
        ])->assertStatus(422)->assertJsonValidationErrors('end_date');
    }

    public function test_past_start_date_is_rejected(): void
    {
        $client = $this->cliente();
        $pet    = Pet::factory()->for($client)->create();
        $host   = $this->hostFor();

        $this->actingAs($client)->postJson('/api/reservations', [
            'pet_id'       => $pet->id,
            'host_id'      => $host->id,
            'service_type' => 'paseo',
            'start_date'   => now()->subDay()->toDateString(),
            'end_date'     => now()->addDays(2)->toDateString(),
        ])->assertStatus(422)->assertJsonValidationErrors('start_date');
    }

    public function test_client_can_cancel_own_reservation(): void
    {
        $client = $this->cliente();
        $pet    = Pet::factory()->for($client)->create();
        $host   = $this->hostFor();

        $reservation = Reservation::factory()->create([
            'user_id' => $client->id,
            'pet_id'  => $pet->id,
            'host_id' => $host->id,
            'status'  => 'pendiente',
        ]);

        $this->actingAs($client)
            ->patchJson("/api/reservations/{$reservation->id}/cancel")
            ->assertOk();

        $this->assertDatabaseHas('reservations', [
            'id'     => $reservation->id,
            'status' => 'cancelada',
        ]);
    }

    public function test_outsider_cannot_cancel_someone_elses_reservation(): void
    {
        $owner    = $this->cliente();
        $outsider = $this->cliente();
        $pet      = Pet::factory()->for($owner)->create();
        $host     = $this->hostFor();

        $reservation = Reservation::factory()->create([
            'user_id' => $owner->id,
            'pet_id'  => $pet->id,
            'host_id' => $host->id,
            'status'  => 'pendiente',
        ]);

        $this->actingAs($outsider)
            ->patchJson("/api/reservations/{$reservation->id}/cancel")
            ->assertStatus(403);
    }

    public function test_host_owner_can_accept_reservation(): void
    {
        $client    = $this->cliente();
        $hostOwner = User::factory()->create(['role' => 'cuidador']);
        $host      = $this->hostFor($hostOwner);
        $pet       = Pet::factory()->for($client)->create();

        $reservation = Reservation::factory()->create([
            'user_id' => $client->id,
            'pet_id'  => $pet->id,
            'host_id' => $host->id,
            'status'  => 'pendiente',
        ]);

        $this->actingAs($hostOwner)
            ->putJson("/api/reservations/{$reservation->id}", ['status' => 'aceptada'])
            ->assertOk();

        $this->assertDatabaseHas('reservations', [
            'id'     => $reservation->id,
            'status' => 'aceptada',
        ]);
    }

    public function test_cannot_reserve_against_empresa_host(): void
    {
        $client  = $this->cliente();
        $pet     = Pet::factory()->for($client)->create();
        $empresa = User::factory()->create(['role' => 'empresa']);
        $host    = Host::factory()->for($empresa)->empresa()->create();

        $this->actingAs($client)->postJson('/api/reservations', [
            'pet_id'       => $pet->id,
            'host_id'      => $host->id,
            'service_type' => 'paseo',
            'start_date'   => now()->addDay()->toDateString(),
            'end_date'     => now()->addDays(2)->toDateString(),
        ])
        ->assertStatus(422)
        ->assertJsonValidationErrors('host_id');

        $this->assertDatabaseMissing('reservations', ['host_id' => $host->id]);
    }

    public function test_non_host_owner_cannot_update_reservation_status(): void
    {
        $client    = $this->cliente();
        $host      = $this->hostFor();
        $pet       = Pet::factory()->for($client)->create();
        $outsider  = $this->cliente();

        $reservation = Reservation::factory()->create([
            'user_id' => $client->id,
            'pet_id'  => $pet->id,
            'host_id' => $host->id,
            'status'  => 'pendiente',
        ]);

        $this->actingAs($outsider)
            ->putJson("/api/reservations/{$reservation->id}", ['status' => 'aceptada'])
            ->assertStatus(403);
    }
}
