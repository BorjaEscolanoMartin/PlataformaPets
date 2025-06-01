<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Artisan;

class ResetDatabaseCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'db:reset 
                            {--seed : Ejecutar seeders después del reset}
                            {--force : Forzar reset sin confirmación}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Resetear completamente la base de datos (eliminar y recrear todas las tablas)';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('🔄 Comando de reset de base de datos');
        $this->info('===================================');

        if (!$this->option('force')) {
            $this->warn('⚠️  ADVERTENCIA: Esto eliminará TODOS los datos de la base de datos.');
            $this->warn('Esta acción NO se puede deshacer.');
            
            if (!$this->confirm('¿Estás seguro de que deseas continuar?')) {
                $this->info('❌ Operación cancelada.');
                return;
            }
        }

        $this->info('🗑️  Eliminando todas las tablas...');
        
        try {
            // Fresh migrations (elimina y recrea todas las tablas)
            Artisan::call('migrate:fresh');
            $this->info('✅ Migraciones ejecutadas exitosamente.');

            if ($this->option('seed')) {
                $this->info('🌱 Ejecutando seeders...');
                Artisan::call('db:seed');
                $this->info('✅ Seeders ejecutados exitosamente.');
            }

            $this->info("\n🎉 Reset de base de datos completado!");
            
            if ($this->option('seed')) {
                $this->info('La base de datos ha sido reseteda y poblada con datos de prueba.');
            } else {
                $this->info('La base de datos ha sido reseteda y está vacía.');
                $this->info('Usa --seed si deseas poblar con datos de prueba.');
            }

        } catch (\Exception $e) {
            $this->error('❌ Error durante el reset: ' . $e->getMessage());
        }
    }
}
