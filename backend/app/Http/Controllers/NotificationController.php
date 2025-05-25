<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $notifications = $request->user()->notifications()->latest()->get();

        $notifications->transform(function ($notification) {
            if (is_string($notification->data)) {
                $notification->data = json_decode($notification->data);
            }
            return $notification;
        });

        return response()->json($notifications);
    }


    public function markAsRead(Request $request, $id)
    {
        $notification = $request->user()->notifications()->findOrFail($id);
        $notification->markAsRead();

        return response()->json(['message' => 'Notificación marcada como leída']);
    }
}
