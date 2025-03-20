<?php

use App\Models\Blog;
use App\Models\User;
use Inertia\Inertia;
use App\Models\Comment;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\CommentController;

Route::get('/', function () {
    $authuser = Auth::user();
    if ($authuser) {
        return redirect(route('home'));
    }
    $posts = Blog::with('user:id,name')->orderBy('created_at', 'desc')
        ->orderBy('updated_at', 'desc')->paginate(perPage: 3);
    $comments = Comment::latest()->get();
    $posts->getCollection()->transform(function ($post) {
        $post->likeCount = $post->likes()->count();
        $post->liked = $post->likes()->where('user_id', auth()->id())->exists();
        $post->comments = $post->comments()->with('user:id,name')->get();
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
            $posts = Blog::with('user:id,name')
                ->orderBy('created_at', 'desc')->paginate(perPage: 5);
            $comments = Comment::latest()->get();
            $posts->getCollection()->transform(function ($post) {
                $post->likeCount = $post->likes()->count();
                $post->liked = $post->likes()->where('user_id', auth()->id())->exists();
                $post->comments = $post->comments()->with('user:id,name')->get();
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
        $posts = Auth::user()->blog()->with('user')
            ->orderBy('updated_at', 'desc')->get();

        $posts = $posts->map(function ($post) {
            $post->likeCount = $post->likes()->count();
            $post->liked = $post->likes()->where('user_id', auth()->id())->exists();
            $post->comments = $post->comments()->count();
            return $post;
        });


        return Inertia::render('dashboard', ['posts' => $posts]);

    })->name('dashboard');

    Route::get('posts', function () {
        if (!auth()->check()) {
            return redirect(route('home'));
        }
        $posts = Auth::user()->blog()->with('user')->orderBy('updated_at', 'desc')->paginate(2);
        $posts->getCollection()->transform(function ($post) {
            $post->likeCount = $post->likes()->count();
            $post->liked = $post->likes()->where('user_id', auth()->id())->exists();
            $post->comments = $post->comments()->with('user:id,name')->get();
            return $post;
        });
        return Inertia::render('posts', [
            'posts' => $posts
        ]);
    })->name('posts');
});
Route::get('/blogs/admin/{blog}', [BlogController::class, 'adminshow'])->middleware(['auth', 'verified'])->name('blogs.adminshow');
Route::post('/blogs/{blog}/dislike', [BlogController::class, 'dislike'])->middleware(['auth', 'verified'])->name('blogs.dislike');
Route::post('/blogs/{blog}/like', [BlogController::class, 'like'])->middleware(['auth', 'verified'])->name('blogs.like');
Route::resource('blogs', BlogController::class)->middleware(['auth', 'verified']);
Route::resource('comments', CommentController::class)->middleware(['auth', 'verified']);

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
