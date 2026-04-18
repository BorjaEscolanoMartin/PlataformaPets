<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\RateLimiter;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        RateLimiter::clear('');
        Http::fake([
            'nominatim.openstreetmap.org/*' => Http::response([
                ['lat' => '40.4168', 'lon' => '-3.7038'],
            ]),
        ]);
    }

    public function test_register_creates_user_and_returns_token(): void
    {
        $response = $this->postJson('/api/register', [
            'name'        => 'Ada Lovelace',
            'email'       => 'ada@example.com',
            'password'    => 'SuperPass123',
            'postal_code' => '28001',
        ]);

        $response->assertOk()
            ->assertJsonStructure(['user' => ['id', 'email'], 'token']);

        $this->assertDatabaseHas('users', [
            'email' => 'ada@example.com',
            'role'  => 'cliente',
        ]);
    }

    public function test_register_rejects_weak_password(): void
    {
        $response = $this->postJson('/api/register', [
            'name'        => 'Ada Lovelace',
            'email'       => 'ada@example.com',
            'password'    => 'short',
            'postal_code' => '28001',
        ]);

        $response->assertStatus(422)->assertJsonValidationErrors('password');
    }

    public function test_register_rejects_non_spanish_postal_code(): void
    {
        $response = $this->postJson('/api/register', [
            'name'        => 'Ada Lovelace',
            'email'       => 'ada@example.com',
            'password'    => 'SuperPass123',
            'postal_code' => 'ABCDE',
        ]);

        $response->assertStatus(422)->assertJsonValidationErrors('postal_code');
    }

    public function test_login_returns_token_and_revokes_previous(): void
    {
        $user = User::factory()->create([
            'email'    => 'ada@example.com',
            'password' => Hash::make('SuperPass123'),
        ]);

        $first = $user->createToken('old')->plainTextToken;

        $response = $this->postJson('/api/login', [
            'email'    => 'ada@example.com',
            'password' => 'SuperPass123',
        ]);

        $response->assertOk()->assertJsonStructure(['user', 'token']);

        $this->assertDatabaseCount('personal_access_tokens', 1);
        $this->assertNotEquals($first, $response->json('token'));
    }

    public function test_login_rejects_bad_password(): void
    {
        User::factory()->create([
            'email'    => 'ada@example.com',
            'password' => Hash::make('SuperPass123'),
        ]);

        $this->postJson('/api/login', [
            'email'    => 'ada@example.com',
            'password' => 'wrong',
        ])->assertStatus(422);
    }

    public function test_login_is_rate_limited_to_five_per_minute(): void
    {
        User::factory()->create([
            'email'    => 'ada@example.com',
            'password' => Hash::make('SuperPass123'),
        ]);

        for ($i = 0; $i < 5; $i++) {
            $this->postJson('/api/login', [
                'email'    => 'ada@example.com',
                'password' => 'wrong',
            ]);
        }

        $this->postJson('/api/login', [
            'email'    => 'ada@example.com',
            'password' => 'SuperPass123',
        ])->assertStatus(429);
    }

    public function test_unauthenticated_access_to_protected_endpoint_returns_401(): void
    {
        $this->getJson('/api/user')->assertStatus(401);
    }
}
