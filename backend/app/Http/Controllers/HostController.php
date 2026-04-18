<?php

namespace App\Http\Controllers;

use App\Http\Requests\HostStoreRequest;
use App\Http\Requests\HostUpdateRequest;
use App\Http\Requests\ServicePricesUpdateRequest;
use App\Http\Resources\HostResource;
use App\Http\Resources\ServicePriceResource;
use Illuminate\Http\Request;
use App\Models\Host;
use App\Models\ServicePrice;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Facades\Log;

class HostController extends Controller
{
    public function index()
    {
        return HostResource::collection(
            Host::where('user_id', Auth::id())
                ->withAvg('reviews as average_rating', 'rating')
                ->withCount('reviews')
                ->get()
        );
    }

    public function store(HostStoreRequest $request)
    {
        try {
            $validated = $request->validated();
            $validated['user_id'] = Auth::id();

            if ($request->hasFile('profile_photo') && $request->file('profile_photo')->isValid()) {
                $validated['profile_photo'] = $request->file('profile_photo')->store('hosts/profile_photos', 'public');
            }

            $host = Host::create($validated);

            $user = User::find(Auth::id());
            if ($user && $user->role === 'cliente') {
                if ($validated['type'] === 'particular') {
                    $user->role = 'cuidador';
                } elseif ($validated['type'] === 'empresa') {
                    $user->role = 'empresa';
                }
                $user->save();
            }

            return HostResource::make($host)
                ->response()
                ->setStatusCode(201);
        } catch (\Throwable $e) {
            Log::error('host.store.failed', [
                'exception' => $e->getMessage(),
                'user_id'   => Auth::id(),
            ]);

            return response()->json([
                'error'   => 'Error interno',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function show($id)
    {
        $host = Host::findOrFail($id);
        $this->authorize('view', $host);

        return HostResource::make($host);
    }

    public function update(HostUpdateRequest $request, $id)
    {
        $host = Host::findOrFail($id);
        $this->authorize('update', $host);

        $validated = $request->validated();

        if ($request->hasFile('profile_photo')) {
            $validated['profile_photo'] = $request->file('profile_photo')->store('hosts/profile_photos', 'public');
        }

        $host->update($validated);

        return HostResource::make($host);
    }

    public function destroy($id)
    {
        $host = Host::findOrFail($id);
        $this->authorize('delete', $host);

        $host->delete();

        return response()->json(['message' => 'Host eliminado']);
    }

    public function getServicePrices($hostId)
    {
        $host = Host::findOrFail($hostId);
        $this->authorize('manageServicePrices', $host);

        return ServicePriceResource::collection($host->servicePrices);
    }

    public function updateServicePrices(ServicePricesUpdateRequest $request, $hostId)
    {
        $host = Host::findOrFail($hostId);
        $this->authorize('manageServicePrices', $host);

        $validated = $request->validated();

        $serviceTypes = collect($validated['prices'])->pluck('service_type');
        ServicePrice::where('host_id', $host->id)
            ->whereIn('service_type', $serviceTypes)
            ->delete();

        foreach ($validated['prices'] as $priceData) {
            ServicePrice::create([
                'host_id'      => $host->id,
                'service_type' => $priceData['service_type'],
                'price'        => $priceData['price'],
                'price_unit'   => $priceData['price_unit'],
                'description'  => $priceData['description'] ?? null,
            ]);
        }

        return response()->json([
            'message' => 'Precios actualizados correctamente',
            'prices'  => ServicePriceResource::collection($host->fresh()->servicePrices),
        ]);
    }
}
