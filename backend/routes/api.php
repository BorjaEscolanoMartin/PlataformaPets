<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

use App\Models\User;
use App\Http\Controllers\PetController;
use App\Http\Controllers\HostController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\CuidadoresController;

use App\Services\GeolocationService;

/*
|--------------------------------------------------------------------------
| Rutas Públicas
|--------------------------------------------------------------------------
*/

// Login
Route::post('/login', function (Request $request) {
    $request->validate([
        'email' => 'required|email',
        'password' => 'required',
    ]);

    $user = User::where('email', $request->email)->first();

    if (! $user || ! Hash::check($request->password, $user->password)) {
        throw ValidationException::withMessages([
            'email' => ['Credenciales incorrectas.'],
        ]);
    }

    Auth::login($user);
    $request->session()->regenerate();

    return response()->json($user);
});

// Registro
Route::post('/register', function (Request $request) {
    $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|email|unique:users',
        'password' => 'required|string|min:6',
        'role' => 'required|in:cliente,cuidador,empresa',
        'postal_code' => 'required|string|max:10',
    ]);

    $coords = GeolocationService::fromPostalCode($request->postal_code);

    $user = User::create([
        'name' => $request->name,
        'email' => $request->email,
        'password' => bcrypt($request->password),
        'role' => $request->role,
        'postal_code' => $request->postal_code,
        'latitude' => $coords['lat'] ?? null,
        'longitude' => $coords['lon'] ?? null,
    ]);

    if ($coords) {
        $user->latitude = $coords['lat'];
        $user->longitude = $coords['lon'];
        $user->save();

        logger(['lat' => $coords['lat'], 'lng' => $coords['lon']]);
    }

    Auth::login($user);

    return response()->json($user);
});

// Logout
Route::post('/logout', function (Request $request) {
    Auth::logout();
    $request->session()->invalidate();
    $request->session()->regenerateToken();

    return response()->json(['message' => 'Sesión cerrada']);
});

/*
|--------------------------------------------------------------------------
| Rutas Protegidas con Sanctum
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {
    // Usuario autenticado
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::put('/user', [UserController::class, 'update']);

    // Mascotas
    Route::get('/pets', [PetController::class, 'index']);
    Route::post('/pets', [PetController::class, 'store']);
    Route::put('/pets/{id}', [PetController::class, 'update']);
    Route::delete('/pets/{id}', [PetController::class, 'destroy']);
    Route::get('/pets/{id}', [PetController::class, 'show']);

    // Hosts
    Route::apiResource('hosts', HostController::class)->only(['index', 'store', 'show', 'update', 'destroy']);

    // Cuidadores y empresas (usuarios por rol)
    Route::get('/users', function (Request $request) {
        $role = $request->query('role');
        return $role ? User::where('role', $role)->get() : User::all();
    });

    Route::get('/users/{id}', [UserController::class, 'show']);

    // Empresas específicas con controlador
    Route::get('/empresas', [UserController::class, 'indexEmpresas']);

    Route::middleware('auth:sanctum')->group(function () {
    Route::get('/reservations', [ReservationController::class, 'index']);
    Route::get('/reservations/host', [ReservationController::class, 'forHost']);
    Route::post('/reservations', [ReservationController::class, 'store']);
    Route::put('/reservations/{id}', [ReservationController::class, 'update']);
});

});

/*
|--------------------------------------------------------------------------
| Ruta de depuración (opcional, eliminar en producción)
|--------------------------------------------------------------------------
*/

Route::get('/check', function (Request $request) {
    return response()->json([
        'cookies' => $_COOKIE,
        'session' => session()->all(),
        'user' => $request->user(),
    ]);
});

Route::get('/cuidadores', [CuidadoresController::class, 'index']);
