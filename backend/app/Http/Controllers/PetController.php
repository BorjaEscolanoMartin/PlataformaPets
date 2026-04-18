<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\PetStoreRequest;
use App\Http\Requests\PetUpdateRequest;
use App\Http\Resources\PetResource;
use Illuminate\Http\Request;
use App\Models\Pet;
use Illuminate\Support\Facades\Storage;

class PetController extends Controller
{
    public function index(Request $request)
    {
        return PetResource::collection($request->user()->pets()->get());
    }

    public function store(PetStoreRequest $request)
    {
        $data = $request->safe()->except('photo');

        if ($request->hasFile('photo')) {
            $data['photo'] = $request->file('photo')->store('pets', 'public');
        }

        $pet = $request->user()->pets()->create($data);

        return PetResource::make($pet)
            ->response()
            ->setStatusCode(201);
    }

    public function update(PetUpdateRequest $request, $id)
    {
        $pet = $request->user()->pets()->findOrFail($id);

        $data = $request->safe()->except('photo');

        if ($request->hasFile('photo')) {
            if ($pet->photo && Storage::disk('public')->exists($pet->photo)) {
                Storage::disk('public')->delete($pet->photo);
            }
            $data['photo'] = $request->file('photo')->store('pets', 'public');
        }

        $pet->update($data);

        return PetResource::make($pet);
    }

    public function destroy(Request $request, $id)
    {
        $pet = $request->user()->pets()->findOrFail($id);
        $pet->delete();

        return response()->json(['message' => 'Mascota eliminada']);
    }

    public function show(Request $request, $id)
    {
        $pet = Pet::where('user_id', $request->user()->id)
                ->where('id', $id)
                ->firstOrFail();

        return PetResource::make($pet);
    }
}
