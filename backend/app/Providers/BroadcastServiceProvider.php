<?php

namespace App\Providers;

use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Route;

class BroadcastServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        // 🔥 Registramos rutas con middleware explícito
        Route::middleware(['web', 'auth:sanctum'])
            ->prefix('')
            ->group(function () {
                Broadcast::routes();
            });

        require base_path('routes/channels.php');
    }
}
