<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Models\Host;
use App\Models\Pet;
use App\Models\Reservation;
use App\Models\Review;
use App\Models\Chat;
use App\Models\Message;
use Illuminate\Support\Facades\DB;

class DeleteUsersCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'users:delete 
                            {--role= : Rol específico a eliminar (cliente, cuidador, empresa)}
                            {--all : Eliminar todos los usuarios}
                            {--except-admin : Mantener usuarios administradores si existen}
                            {--dry-run : Mostrar qué se eliminaría sin ejecutar}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Eliminar usuarios del sistema (clientes, cuidadores, empresas)';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('🗑️  Comando de eliminación de usuarios');
        $this->info('=====================================');

        // Mostrar estadísticas actuales
        $this->showCurrentStats();

        // Determinar qué usuarios eliminar
        $usersToDelete = $this->getUsersToDelete();

        if ($usersToDelete->isEmpty()) {
            $this->info('❌ No hay usuarios que coincidan con los criterios especificados.');
            return;
        }

        // Mostrar lo que se va a eliminar
        $this->showDeletionPlan($usersToDelete);

        // Si es dry-run, solo mostrar y salir
        if ($this->option('dry-run')) {
            $this->info('🔍 Modo dry-run: No se eliminó nada.');
            return;
        }

        // Confirmar eliminación
        if (!$this->confirmDeletion($usersToDelete->count())) {
            $this->info('❌ Operación cancelada.');
            return;
        }

        // Ejecutar eliminación
        $this->executeEliminación($usersToDelete);
    }

    private function showCurrentStats()
    {
        $this->info("\n📊 Estadísticas actuales:");
        $this->table(
            ['Tipo', 'Cantidad'],
            [
                ['Clientes', User::where('role', 'cliente')->count()],
                ['Cuidadores', User::where('role', 'cuidador')->count()],
                ['Empresas', User::where('role', 'empresa')->count()],
                ['Hosts', Host::count()],
                ['Mascotas', Pet::count()],
                ['Reservaciones', Reservation::count()],
                ['Reseñas', Review::count()],
                ['Chats', Chat::count()],
                ['Mensajes', Message::count()],
            ]
        );
    }

    private function getUsersToDelete()
    {
        $query = User::query();

        if ($this->option('all')) {
            // Eliminar todos
            if ($this->option('except-admin')) {
                // Si hubiera campo admin, excluirlo aquí
                // $query->where('is_admin', false);
            }
        } elseif ($this->option('role')) {
            $role = $this->option('role');
            if (!in_array($role, ['cliente', 'cuidador', 'empresa'])) {
                $this->error("❌ Rol inválido. Debe ser: cliente, cuidador o empresa");
                return collect();
            }
            $query->where('role', $role);
        } else {
            // Si no se especifica nada, preguntar
            $role = $this->choice(
                '¿Qué tipo de usuarios deseas eliminar?',
                ['cliente', 'cuidador', 'empresa', 'todos'],
                0
            );

            if ($role === 'todos') {
                // No filtrar
            } else {
                $query->where('role', $role);
            }
        }

        return $query->get();
    }

    private function showDeletionPlan($users)
    {
        $this->warn("\n⚠️  Se eliminarán los siguientes usuarios:");
        
        $tableData = [];
        foreach ($users as $user) {
            $tableData[] = [
                $user->id,
                $user->name,
                $user->email,
                $user->role,
                $user->created_at->format('Y-m-d')
            ];
        }

        $this->table(
            ['ID', 'Nombre', 'Email', 'Rol', 'Creado'],
            $tableData
        );

        // Mostrar datos relacionados que se eliminarán
        $this->showRelatedDataToDelete($users);
    }

    private function showRelatedDataToDelete($users)
    {
        $userIds = $users->pluck('id');
        
        $hosts = Host::whereIn('user_id', $userIds)->count();
        $pets = Pet::whereIn('user_id', $userIds)->count();
        $reservations = Reservation::whereIn('user_id', $userIds)->count();
        $reviews = Review::whereIn('user_id', $userIds)->count();
        
        // Chats donde participan estos usuarios
        $chatsCount = 0;
        $messagesCount = 0;
        foreach ($userIds as $userId) {
            $chatsCount += Chat::whereJsonContains('participants', $userId)->count();
            $messagesCount += Message::where('user_id', $userId)->count();
        }

        $this->warn("\n🔗 Datos relacionados que se eliminarán:");
        $this->table(
            ['Tipo de dato', 'Cantidad'],
            [
                ['Perfiles de host', $hosts],
                ['Mascotas', $pets],
                ['Reservaciones', $reservations],
                ['Reseñas', $reviews],
                ['Chats relacionados', $chatsCount],
                ['Mensajes', $messagesCount],
            ]
        );
    }

    private function confirmDeletion($count)
    {
        return $this->confirm(
            "¿Estás seguro de que deseas eliminar {$count} usuario(s) y todos sus datos relacionados? Esta acción NO se puede deshacer."
        );
    }    private function executeEliminación($users)
    {
        $this->info("\n🚀 Iniciando eliminación...");
        
        $deletedCount = 0;
        $errors = [];

        DB::beginTransaction();
        
        try {
            foreach ($users as $user) {
                $this->line("Eliminando usuario: {$user->name} ({$user->email})");
                
                // 1. Eliminar todos los chats donde el usuario es creador
                Chat::where('created_by', $user->id)->delete();
                
                // 2. Eliminar mensajes del usuario
                Message::where('user_id', $user->id)->delete();

                // 3. Actualizar chats donde es participante pero no creador
                $multiChats = Chat::whereJsonContains('participants', $user->id)->get();
                
                foreach ($multiChats as $chat) {
                    $participants = $chat->participants;
                    $participants = array_values(array_filter($participants, function($id) use ($user) {
                        return $id != $user->id;
                    }));
                    
                    if (empty($participants)) {
                        // Si no quedan participantes, eliminar el chat
                        $chat->delete();
                    } else {
                        // Actualizar la lista de participantes
                        $chat->participants = $participants;
                        $chat->save();
                    }
                }

                // 4. Eliminar reseñas del usuario
                Review::where('user_id', $user->id)->delete();

                // 5. Eliminar reservaciones del usuario
                Reservation::where('user_id', $user->id)->delete();

                // 6. Eliminar mascotas del usuario
                Pet::where('user_id', $user->id)->delete();

                // 7. Eliminar perfil de host si existe
                Host::where('user_id', $user->id)->delete();

                // 8. Finalmente eliminar el usuario
                $user->delete();
                $deletedCount++;
            }

            DB::commit();
            
            $this->info("\n✅ Eliminación completada exitosamente!");
            $this->info("🗑️  Usuarios eliminados: {$deletedCount}");
            
            // Mostrar estadísticas finales
            $this->info("\n📊 Estadísticas finales:");
            $this->showCurrentStats();

        } catch (\Exception $e) {
            DB::rollBack();
            $this->error("\n❌ Error durante la eliminación: " . $e->getMessage());
            $this->error("Se revirtieron todos los cambios.");
        }
    }
}
