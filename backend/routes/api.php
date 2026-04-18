<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Validation\Rules\Password;

use App\Models\User;
use App\Http\Controllers\PetController;
use App\Http\Controllers\HostController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\CuidadoresController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\ReviewController;

use App\Services\GeolocationService;

/*
|--------------------------------------------------------------------------
| Rutas Públicas con rate limiting
|--------------------------------------------------------------------------
*/

// Login — throttle agresivo para prevenir fuerza bruta (5 intentos/min por IP)
Route::middleware('throttle:5,1')->post('/login', function (Request $request) {
    $request->validate([
        'email'    => 'required|email',
        'password' => 'required',
    ]);

    $user = User::where('email', $request->email)->first();

    if (!$user || !Hash::check($request->password, $user->password)) {
        throw ValidationException::withMessages([
            'email' => ['Credenciales incorrectas.'],
        ]);
    }

    $user->tokens()->delete();
    $token = $user->createToken('auth-token')->plainTextToken;

    return response()->json([
        'user'    => $user,
        'token'   => $token,
        'message' => 'Inicio de sesión exitoso',
    ]);
});

// Registro — throttle más estricto (3 intentos/min por IP) + password robusta
Route::middleware('throttle:3,1')->post('/register', function (Request $request) {
    $validated = $request->validate([
        'name'        => 'required|string|max:255',
        'email'       => 'required|email|unique:users',
        'password'    => ['required', 'string', Password::min(10)->letters()->numbers()],
        'postal_code' => ['required', 'string', 'regex:/^\d{5}$/'],
    ], [
        'postal_code.regex' => 'El código postal debe tener 5 dígitos.',
    ]);

    $coords = GeolocationService::fromPostalCode($validated['postal_code']);

    $user = User::create([
        'name'        => $validated['name'],
        'email'       => $validated['email'],
        'password'    => bcrypt($validated['password']),
        'role'        => 'cliente',
        'postal_code' => $validated['postal_code'],
        'latitude'    => $coords['lat'] ?? null,
        'longitude'   => $coords['lon'] ?? null,
    ]);

    $token = $user->createToken('auth-token')->plainTextToken;

    return response()->json([
        'user'    => $user,
        'token'   => $token,
        'message' => 'Registro exitoso',
    ]);
});

// Búsqueda pública de cuidadores/empresas con throttle para evitar scraping
Route::middleware('throttle:30,1')->group(function () {
    Route::get('/empresas',           [UserController::class, 'indexEmpresas']);
    Route::get('/cuidadores',         [CuidadoresController::class, 'index']);
    Route::get('/cuidadores/{id}',    [CuidadoresController::class, 'show']);
});

/*
|--------------------------------------------------------------------------
| Rutas Protegidas con Sanctum
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {
    // Logout
    Route::post('/logout', function (Request $request) {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Sesión cerrada exitosamente']);
    });

    Route::post('/logout-all', function (Request $request) {
        $request->user()->tokens()->delete();
        return response()->json(['message' => 'Sesión cerrada en todos los dispositivos']);
    });

    // Usuario autenticado
    Route::get('/user', fn (Request $request) => $request->user());
    Route::put('/user', [UserController::class, 'update']);

    // Mascotas
    Route::get('/pets',          [PetController::class, 'index']);
    Route::post('/pets',         [PetController::class, 'store']);
    Route::get('/pets/{id}',     [PetController::class, 'show']);
    Route::put('/pets/{id}',     [PetController::class, 'update']);
    Route::delete('/pets/{id}',  [PetController::class, 'destroy']);

    // Hosts
    Route::apiResource('hosts', HostController::class)->only(['index', 'store', 'show', 'update', 'destroy']);
    Route::get('/hosts/{host}/service-prices',  [HostController::class, 'getServicePrices']);
    Route::post('/hosts/{host}/service-prices', [HostController::class, 'updateServicePrices']);

    // Usuarios
    Route::get('/users', function (Request $request) {
        $role = $request->query('role');
        return $role ? User::where('role', $role)->get() : User::all();
    });
    Route::get('/users/{id}', [UserController::class, 'show']);

    // Reservas
    Route::get('/reservations',                  [ReservationController::class, 'index']);
    Route::get('/reservations/host',             [ReservationController::class, 'forHost']);
    Route::post('/reservations',                 [ReservationController::class, 'store']);
    Route::put('/reservations/{id}',             [ReservationController::class, 'update']);
    Route::patch('/reservations/{id}/cancel',    [ReservationController::class, 'cancel']);

    // Notificaciones
    Route::get('/notifications',                 [NotificationController::class, 'index']);
    Route::get('/notifications/unread-count',    [NotificationController::class, 'getUnreadCount']);
    Route::post('/notifications/{id}/read',      [NotificationController::class, 'markAsRead']);
    Route::delete('/notifications/{id}',         [NotificationController::class, 'destroy']);

    // Reseñas
    Route::get('/cuidadores/{hostId}/reviews',   [ReviewController::class, 'index']);
    Route::post('/cuidadores/{hostId}/reviews',  [ReviewController::class, 'store']);
    Route::delete('/reviews/{id}',               [ReviewController::class, 'destroy']);

    // Chat
    Route::apiResource('chats', ChatController::class);
    Route::post('/chats/private', [ChatController::class, 'createPrivateChat']);

    // Mensajes
    Route::get('/messages/unread-count',                         [MessageController::class, 'getUnreadCount']);
    Route::get('/chats/{chat}/messages',                         [MessageController::class, 'index']);
    Route::post('/chats/{chat}/messages',                        [MessageController::class, 'store']);
    Route::get('/chats/{chat}/messages/{message}',               [MessageController::class, 'show']);
    Route::put('/chats/{chat}/messages/{message}',               [MessageController::class, 'update']);
    Route::delete('/chats/{chat}/messages/{message}',            [MessageController::class, 'destroy']);
    Route::patch('/chats/{chat}/messages/{message}/read',        [MessageController::class, 'markAsRead']);
    Route::patch('/chats/{chat}/messages/read-all',              [MessageController::class, 'markAllAsRead']);
});
