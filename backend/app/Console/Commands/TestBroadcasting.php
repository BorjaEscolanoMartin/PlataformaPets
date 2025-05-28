<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Events\MessageSent;
use App\Models\Message;
use App\Models\User;

class TestBroadcasting extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'chat:test-broadcasting';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test the broadcasting system for chat messages';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('🚀 Testing Broadcasting System...');

        try {
            // Obtener usuarios de prueba
            $users = User::take(2)->get();
            
            if ($users->count() < 2) {
                $this->error('❌ Need at least 2 users in database');
                return 1;
            }
            
            $sender = $users->first();
            $receiver = $users->last();
            
            $this->info("👤 Sender: {$sender->name} (ID: {$sender->id})");
            $this->info("👤 Receiver: {$receiver->name} (ID: {$receiver->id})");
            
            // Crear mensaje de prueba
            $message = new Message([
                'sender_id' => $sender->id,
                'receiver_id' => $receiver->id,
                'content' => 'Test message: ' . now()->format('H:i:s')
            ]);
            
            $message->save();
            $this->info("💬 Message created with ID: {$message->id}");
            
            // Cargar relaciones
            $message->load(['sender', 'receiver']);
            
            // Disparar evento
            $this->info('📡 Broadcasting MessageSent event...');
            event(new MessageSent($message));
            
            $this->info('✅ Event dispatched successfully!');
            $this->info('🔍 Check Echo Server logs and frontend console for events');
            
            return 0;
            
        } catch (\Exception $e) {
            $this->error("❌ Error: " . $e->getMessage());
            $this->error("Stack trace: " . $e->getTraceAsString());
            return 1;
        }
    }
}
