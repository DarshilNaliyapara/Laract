<?php

use App\Models\Blog;
use App\Models\User;
use Inertia\Inertia;
use App\Models\Comment;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\CommentController;

Route::get('/', function () {
    $authuser = Auth::user();
    
        $posts = Blog::with('user:id,name')->latest()->paginate(perPage: 3);
        $comments = Comment::latest()->get();
        $posts->getCollection()->transform(function ($post) {
            $post->likeCount = $post->likes()->count();
            $post->liked = $post->likes()->where('user_id', auth()->id())->exists();
            return $post;
        });

        return Inertia::render('welcome', [
            'posts' => $posts  
        ]);
    
})->name('welcome');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/home', function (User $user) {
        $authuser = Auth::user();
        if ($authuser) {
            $posts = Blog::with('user:id,name')->latest()->paginate(perPage: 3);
            $comments = Comment::latest()->get();
            $posts->getCollection()->transform(function ($post) {
                $post->likeCount = $post->likes()->count();
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
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('posts', function () {
        if (!auth()->check()) {
            return redirect(route('dashboard'));
        }
        $posts = Auth::user()->blog()->with('user')->latest()->paginate(2);
        $posts->getCollection()->transform(function ($post) {
            $post->likeCount = $post->likes()->count();
            $post->liked = $post->likes()->where('user_id', auth()->id())->exists();
            return $post;
        });
        return Inertia::render('posts', [
            'posts' => $posts
        ]);
    })->name('posts');
});
Route::post('/blogs/{blog}/dislike', [BlogController::class, 'dislike'])->middleware(['auth', 'verified'])->name('blogs.dislike');
Route::post('/blogs/{blog}/like', [BlogController::class, 'like'])->middleware(['auth', 'verified'])->name('blogs.like');
Route::resource('blogs', BlogController::class)->middleware(['auth', 'verified']);
Route::resource('comments', CommentController::class)->middleware(['auth', 'verified']);

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
