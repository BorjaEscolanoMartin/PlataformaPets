<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserUpdateRequest;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use App\Models\User;

class UserController extends Controller
{
    public function indexEmpresas()
    {
        return UserResource::collection(
            User::where('role', 'empresa')
                ->with(['host.servicePrices'])
                ->get()
        );
    }

    public function update(UserUpdateRequest $request)
    {
        $user = $request->user();
        $user->update($request->validated());

        return response()->json([
            'message' => 'Perfil actualizado correctamente',
            'user'    => UserResource::make($user->fresh()),
        ]);
    }

    public function show($id)
    {
        $user = User::with(['host.reviews.user'])->findOrFail($id);

        return UserResource::make($user);
    }
}
