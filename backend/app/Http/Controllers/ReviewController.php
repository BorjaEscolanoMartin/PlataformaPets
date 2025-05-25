<?php

namespace App\Http\Controllers;

use App\Models\Review;
use App\Models\Host;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReviewController extends Controller
{
    // Obtener todas las reseñas de un cuidador
    public function index($hostId)
    {
        $reviews = Review::with('user')->where('host_id', $hostId)->latest()->get();
        return response()->json($reviews);
    }

    // Crear o actualizar reseña para un cuidador
    public function store(Request $request, $hostId)
    {
        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'required|string|max:1000',
        ]);

        $review = Review::updateOrCreate(
            [
                'user_id' => Auth::id(),
                'host_id' => $hostId,
            ],
            [
                'rating' => $request->rating,
                'comment' => $request->comment,
            ]
        );

        return response()->json($review->load('user'));
    }

    public function destroy($id)
    {
        $review = Review::findOrFail($id);

        if ($review->user_id !== Auth::id()) {
            return response()->json(['error' => 'No autorizado'], 403);
        }

        $review->delete();

        return response()->json(['message' => 'Reseña eliminada correctamente']);
    }

}
