<?php

use App\Models\Blog;
use App\Models\User;
use Inertia\Inertia;
use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\CommentController;

Route::get('/', function (Request $request) {
    $authuser = Auth::user();
    if ($authuser) {
        return redirect(route('home'));
    }
    $val = $request->input('search', '');
    $searchQuery = '%' . $val . '%';
    $posts = Blog::where('posts', 'LIKE', $searchQuery)
        ->with(['user:id,name,avatar', 'comments.user:id,name,avatar'])
        ->withCount(['likes', 'comments'])
        ->orderBy('created_at', 'desc')
        ->paginate(perPage: 5)
        ->through(function ($post) {
            $post->posts = json_decode($post->posts, true);
            $post->liked = $post->likes()->where('user_id', auth()->id())->exists();
            return $post;
        });



    return Inertia::render('welcome', [
        'posts' => $posts
    ]);

})->name('welcome');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/home', function (User $user, Request $request) {
        $authuser = Auth::user();
        if ($authuser) {
            $val = $request->input('search', '');
            $searchQuery = '%' . $val . '%';
            $posts = Blog::where('posts', 'LIKE', $searchQuery)
                ->with(['user:id,name,avatar', 'comments.user:id,name,avatar'])
                ->withCount(['likes', 'comments'])
                ->orderBy('created_at', 'desc')
                ->paginate(perPage: 5)
                ->through(function ($post) {
                    $post->posts = json_decode($post->posts, true);
                    $post->liked = $post->likes()->where('user_id', auth()->id())->exists();
                    return $post;
                });

            return Inertia::render('home', [
                'posts' => $posts
            ]);
        } else {
            return redirect(route('login'));
        }
    })->name('home');

    Route::get('dashboard', function () {

        if (!auth()->check()) {
            return redirect(route('home'));
        }
        $posts = Auth::user()->blog()
            ->with(['user:id,name', 'comments.user:id,name,avatar'])
            ->withCount(['likes', 'comments'])
            ->orderBy('updated_at', 'desc')
            ->get()
            ->map(function ($post) {
                $post->posts = json_decode($post->posts, true);
                return $post;
            });


        return Inertia::render('dashboard', ['posts' => $posts]);

    })->name('dashboard');

    Route::get('posts', function () {
        if (!auth()->check()) {
            return redirect(route('home'));
        }
        $posts = Auth::user()->blog()
            ->with(['user:id,name,avatar', 'comments.user:id,name,avatar'])
            ->withCount(['likes', 'comments'])
            ->orderBy('updated_at', 'desc')
            ->paginate(2)
            ->through(function ($post) {
                $post->posts = json_decode($post->posts, true);
                $post->liked = $post->likes()->where('user_id', auth()->id())->exists();
                return $post;
            });

        return Inertia::render('posts', [
            'posts' => $posts
        ]);
    })->name('posts');
});
Route::get('/guest/{blog}', [BlogController::class, 'guestshow'])->name('blogs.guestshow');
Route::get('/blogs/admin/{blog}', [BlogController::class, 'adminshow'])->middleware(['auth', 'verified'])->name('blogs.adminshow');
Route::post('/blogs/{blog}/dislike', [BlogController::class, 'dislike'])->middleware(['auth', 'verified'])->name('blogs.dislike');
Route::post('/blogs/{blog}/like', [BlogController::class, 'like'])->middleware(['auth', 'verified'])->name('blogs.like');
Route::resource('blogs', BlogController::class)->middleware(['auth', 'verified']);
Route::resource('comments', CommentController::class)->middleware(['auth', 'verified']);

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
