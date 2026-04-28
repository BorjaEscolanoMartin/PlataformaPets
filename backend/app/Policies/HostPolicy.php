<?php

namespace App\Policies;

use App\Models\Host;
use App\Models\User;

class HostPolicy
{
    public function view(User $user, Host $host): bool
    {
        return true;
    }

    public function update(User $user, Host $host): bool
    {
        return $host->user_id === $user->id;
    }

    public function delete(User $user, Host $host): bool
    {
        return $host->user_id === $user->id;
    }

    public function manageServicePrices(User $user, Host $host): bool
    {
        return $host->user_id === $user->id;
    }
}
