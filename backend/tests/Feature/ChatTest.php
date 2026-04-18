<?php

namespace Tests\Feature;

use App\Models\Chat;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Tests\TestCase;

class ChatTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Event::fake();
    }

    public function test_private_chat_is_created_between_two_users(): void
    {
        $alice = User::factory()->create();
        $bob   = User::factory()->create();

        $response = $this->actingAs($alice)->postJson('/api/chats/private', [
            'other_user_id' => $bob->id,
        ]);

        $response->assertOk()->assertJsonPath('success', true);
        $this->assertDatabaseCount('chats', 1);
    }

    public function test_private_chat_is_reused_when_already_exists(): void
    {
        $alice = User::factory()->create();
        $bob   = User::factory()->create();

        $this->actingAs($alice)->postJson('/api/chats/private', ['other_user_id' => $bob->id])->assertOk();
        $this->actingAs($bob)->postJson('/api/chats/private', ['other_user_id' => $alice->id])->assertOk();

        $this->assertDatabaseCount('chats', 1);
    }

    public function test_cannot_open_private_chat_with_yourself(): void
    {
        $alice = User::factory()->create();

        $this->actingAs($alice)
            ->postJson('/api/chats/private', ['other_user_id' => $alice->id])
            ->assertStatus(422)
            ->assertJsonValidationErrors('other_user_id');
    }

    public function test_participant_can_post_message_to_chat(): void
    {
        $alice = User::factory()->create();
        $bob   = User::factory()->create();

        $chat = Chat::factory()->create([
            'participants' => [$alice->id, $bob->id],
            'created_by'   => $alice->id,
        ]);

        $response = $this->actingAs($alice)->postJson("/api/chats/{$chat->id}/messages", [
            'content' => 'hola bob',
        ]);

        $response->assertCreated();
        $this->assertDatabaseHas('messages', [
            'chat_id' => $chat->id,
            'user_id' => $alice->id,
            'content' => 'hola bob',
        ]);
    }

    public function test_non_participant_cannot_post_message(): void
    {
        $alice    = User::factory()->create();
        $bob      = User::factory()->create();
        $outsider = User::factory()->create();

        $chat = Chat::factory()->create([
            'participants' => [$alice->id, $bob->id],
            'created_by'   => $alice->id,
        ]);

        $this->actingAs($outsider)
            ->postJson("/api/chats/{$chat->id}/messages", ['content' => 'colándome'])
            ->assertStatus(403);

        $this->assertDatabaseMissing('messages', ['chat_id' => $chat->id]);
    }

    public function test_non_participant_cannot_list_messages(): void
    {
        $alice    = User::factory()->create();
        $bob      = User::factory()->create();
        $outsider = User::factory()->create();

        $chat = Chat::factory()->create([
            'participants' => [$alice->id, $bob->id],
            'created_by'   => $alice->id,
        ]);

        $this->actingAs($outsider)
            ->getJson("/api/chats/{$chat->id}/messages")
            ->assertStatus(403);
    }

    public function test_message_validation_rejects_empty_content(): void
    {
        $alice = User::factory()->create();
        $bob   = User::factory()->create();

        $chat = Chat::factory()->create([
            'participants' => [$alice->id, $bob->id],
            'created_by'   => $alice->id,
        ]);

        $this->actingAs($alice)
            ->postJson("/api/chats/{$chat->id}/messages", ['content' => ''])
            ->assertStatus(422)
            ->assertJsonValidationErrors('content');
    }
}
