<?php

use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\AuthController;
use App\Events\MessageSent;
use Illuminate\Support\Facades\Auth;


/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Estas rutas manejan las solicitudes "web" y están protegidas por
| los middlewares de sesión y autenticación de Sanctum.
|
*/

// Ruta principal básica para verificar que el backend responde
Route::get('/', function () {
    return response()->json(['message' => 'Laravel funcionando']);
});

// Ruta para autorizar canales privados de Laravel Echo
Route::post('/broadcasting/auth', function (Request $request) {
    return Broadcast::auth($request);
})->middleware(['web', 'auth:sanctum']);

// Fallback para login: útil cuando intentas acceder sin estar autenticado
Route::get('/login', function () {
    return response()->json(['message' => 'Login fallback'], 401);
})->name('login');

// Carga el archivo donde defines los canales privados
require base_path('routes/channels.php');

// Rutas de autenticación y usuario
Route::post('/login', [AuthController::class, 'login']);
Route::get('/user', [AuthController::class, 'user'])->middleware(['auth:sanctum']);

// Ruta de prueba para emitir un evento

