<?php

use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Rutas "web" protegidas por los middlewares de sesión. La autenticación de
| la SPA se hace vía Sanctum/API — no duplicar aquí endpoints de /api.
|
*/

Route::get('/', fn () => response()->json(['message' => 'Laravel funcionando']));

// Autorización de canales privados de Laravel Echo
Route::post('/broadcasting/auth', fn (Request $request) => Broadcast::auth($request))
    ->middleware(['web', 'auth:sanctum']);

// Fallback nombrado 'login' requerido por el middleware auth cuando falla
Route::get('/login', fn () => response()->json(['message' => 'No autenticado'], 401))
    ->name('login');

require base_path('routes/channels.php');
