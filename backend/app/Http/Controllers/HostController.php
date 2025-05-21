<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Host;
use Illuminate\Support\Facades\Auth;

class HostController extends Controller
{
    public function index()
    {
        return Host::where('user_id', Auth::id())->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|in:particular,empresa',
            'location' => 'nullable|string|max:255',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
        ]);

        $validated['user_id'] = Auth::id();

        $host = Host::create($validated);

        return response()->json($host, 201);
    }

    public function show($id)
    {
        $host = Host::findOrFail($id);

        if ($host->user_id !== Auth::id()) {
            return response()->json(['error' => 'No autorizado'], 403);
        }

        return $host;
    }

    public function update(Request $request, $id)
    {
        $host = Host::findOrFail($id);

        if ($host->user_id !== Auth::id()) {
            return response()->json(['error' => 'No autorizado'], 403);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'type' => 'sometimes|in:particular,empresa',
            'location' => 'nullable|string|max:255',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
        ]);

        $host->update($validated);

        return response()->json($host);
    }

    public function destroy($id)
    {
        $host = Host::findOrFail($id);

        if ($host->user_id !== Auth::id()) {
            return response()->json(['error' => 'No autorizado'], 403);
        }

        $host->delete();

        return response()->json(['message' => 'Host eliminado']);
    }
}


