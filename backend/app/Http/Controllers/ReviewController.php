<?php

namespace App\Http\Controllers;

use App\Http\Requests\ReviewStoreRequest;
use App\Http\Resources\ReviewResource;
use App\Models\Review;
use Illuminate\Support\Facades\Auth;

class ReviewController extends Controller
{
    public function index($hostId)
    {
        $reviews = Review::with('user')
            ->where('host_id', $hostId)
            ->latest()
            ->get();

        return ReviewResource::collection($reviews);
    }

    public function store(ReviewStoreRequest $request, $hostId)
    {
        $review = Review::updateOrCreate(
            [
                'user_id' => Auth::id(),
                'host_id' => $hostId,
            ],
            $request->validated()
        );

        return ReviewResource::make($review->load('user'));
    }

    public function destroy($id)
    {
        $review = Review::findOrFail($id);
        $this->authorize('delete', $review);

        $review->delete();

        return response()->json(['message' => 'Reseña eliminada correctamente']);
    }
}
