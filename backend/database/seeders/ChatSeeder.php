<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Chat;
use App\Models\Message;

class ChatSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {        // Obtener o crear usuarios de prueba
        $user1 = User::firstOrCreate(
            ['email' => 'usuario1@example.com'],
            [
                'name' => 'Juan Pérez',
                'password' => bcrypt('password'),
                'role' => 'cliente'
            ]
        );

        $user2 = User::firstOrCreate(
            ['email' => 'usuario2@example.com'],
            [
                'name' => 'María García',
                'password' => bcrypt('password'),
                'role' => 'cliente'
            ]
        );

        $user3 = User::firstOrCreate(
            ['email' => 'cuidador1@example.com'],
            [
                'name' => 'Carlos Rodríguez',
                'password' => bcrypt('password'),
                'role' => 'cuidador'
            ]
        );

        // Crear chat privado entre usuario1 y usuario2
        $privateChat = Chat::create([
            'type' => 'private',
            'participants' => [$user1->id, $user2->id],
            'created_by' => $user1->id,
            'last_activity' => now()
        ]);

        // Crear algunos mensajes para el chat privado
        Message::create([
            'chat_id' => $privateChat->id,
            'user_id' => $user1->id,
            'content' => '¡Hola! ¿Cómo estás?',
            'type' => 'text'
        ]);

        Message::create([
            'chat_id' => $privateChat->id,
            'user_id' => $user2->id,
            'content' => 'Hola Juan, muy bien gracias. ¿Y tú?',
            'type' => 'text'
        ]);

        Message::create([
            'chat_id' => $privateChat->id,
            'user_id' => $user1->id,
            'content' => 'Genial, quería preguntarte sobre el cuidado de mascotas',
            'type' => 'text'
        ]);

        // Crear chat entre usuario1 y cuidador
        $hostChat = Chat::create([
            'type' => 'private',
            'participants' => [$user1->id, $user3->id],
            'created_by' => $user1->id,
            'last_activity' => now()->subHours(2)
        ]);

        Message::create([
            'chat_id' => $hostChat->id,
            'user_id' => $user1->id,
            'content' => 'Hola Carlos, me interesa tu servicio de cuidado',
            'type' => 'text'
        ]);

        Message::create([
            'chat_id' => $hostChat->id,
            'user_id' => $user3->id,
            'content' => 'Hola Juan, perfecto. ¿Qué tipo de mascota tienes?',
            'type' => 'text'
        ]);

        // Actualizar última actividad de los chats
        $privateChat->updateLastActivity();
        $hostChat->update(['last_activity' => now()->subHour()]);

        $this->command->info('Chat seeder completed! Created sample chats and messages.');
    }
}
