<?php

namespace App\Providers;

use App\Models\Blog;
use App\Models\User;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Gate::define('update-post', function (User $user, Blog $blog) {
            return $user->id === $blog->user_id;
        });
        Gate::define('isadmin', function ($user) {
            return $user->hasRole('super_admin') ? true : null;
        });
    }
}
