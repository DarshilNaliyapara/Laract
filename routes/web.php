<?php

use App\Models\Blog;
use App\Models\User;
use Inertia\Inertia;
use App\Models\Comment;
use App\Models\Notification;
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
        ->with([
            'user:id,name,avatar',
            'comments' => function ($query) {
                $query->with([
                    'user:id,name,avatar',
                    'replies' => function ($query) {
                        $query->with(['user:id,name,avatar'])->orderBy('created_at', 'desc');
                    }
                ])->withCount('replies')->orderBy('created_at', 'desc'); // Count replies per comment
            }
        ])
        ->withCount(['likes', 'comments'])
        ->orderBy('created_at', 'desc')
        ->paginate(perPage: 5)
        ->through(function ($post) {
            $post->comments_count += $post->comments->sum('replies_count');
            $post->posts = json_decode($post->posts, true);
            $post->liked = $post->likes()->where('user_id', auth()->id())->exists();
            return $post;
        });

    return Inertia::render('guest/welcome', [
        'posts' => $posts
    ]);

})->name('welcome');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('notifications', function () {
        $authuser = Auth::user();
        $notifications = Notification::where('user_id', $authuser->id)->latest()
            ->orderBy('created_at', 'desc')
            ->get();
        return Inertia::render('notifications', [
            'notifications' => $notifications
        ]);

    })->name('notifications');

    Route::post('notifications/{notification}', function (Notification $notification) {
        if ($notification->user_id !== Auth::user()->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }
        $notification->delete();
        return response()->json(['success' => 'Notification deleted']);
    })->name('notifications.destroy');

    Route::get('home', function (User $user, Request $request) {

        $authuser = Auth::user();
        if ($authuser) {
            $val = $request->input('search', '');
            $searchQuery = '%' . $val . '%';
            $posts = Blog::where('posts', 'LIKE', $searchQuery)
                ->with([
                    'user:id,name,avatar',
                    'comments' => function ($query) {
                        $query->with([
                            'user:id,name,avatar',
                            'replies' => function ($query) {
                                $query->with(['user:id,name,avatar'])->orderBy('created_at', 'desc');
                            }
                        ])->withCount('replies')->orderBy('created_at', 'desc'); // Count replies per comment
                    }
                ])
                ->withCount(['likes', 'comments'])
                ->orderBy('created_at', 'desc')
                ->paginate(5)
                ->through(function ($post) {
                    $post->comments_count += $post->comments->sum('replies_count');
                    $post->posts = json_decode($post->posts, true);
                    $post->liked = $post->likes()->where('user_id', auth()->id())->exists();
                    return $post;
                });
            Log::info($posts);
            return Inertia::render('home', [
                'posts' => $posts
            ]);
        } else {
            return redirect(route('login'));
        }
    })->name('home');

    Route::get('likedposts', function (User $user, Request $request) {

        $authuser = Auth::user();
        if ($authuser) {
            $val = $request->input('search', '');
            $searchQuery = '%' . $val . '%';
            $posts = Blog::where('posts', 'LIKE', $searchQuery)
                ->whereHas('likes', function ($query) use ($authuser) {
                    $query->where('user_id', $authuser->id);
                })->with([
                        'user:id,name,avatar',
                        'comments' => function ($query) {
                            $query->with([
                                'user:id,name,avatar',
                                'replies' => function ($query) {
                                    $query->with(['user:id,name,avatar'])->orderBy('created_at', 'desc');
                                }
                            ])->withCount('replies')->orderBy('created_at', 'desc'); // Count replies per comment
                        }
                    ])
                ->withCount(['likes', 'comments'])
                ->orderBy('created_at', 'desc')
                ->paginate(5)
                ->through(function ($post) {
                    $post->comments_count += $post->comments->sum('replies_count');
                    $post->posts = json_decode($post->posts, true);
                    $post->liked = $post->likes()->where('user_id', auth()->id())->exists();
                    return $post;
                });
            return Inertia::render('likedposts', [
                'posts' => $posts
            ]);
        } else {
            return redirect(route('login'));
        }
    })->name('likedposts');

    Route::get('dashboard', function () {

        if (!auth()->check()) {
            return redirect(route('home'));
        }

        $posts = Auth::user()->blog()
            ->with([
                'user:id,name',
                'comments' => function ($query) {
                    $query->with([
                        'user:id,name,avatar',
                        'replies' => function ($query) {
                            $query->with(['user:id,name,avatar'])->orderBy('created_at', 'desc');
                        }
                    ])->orderBy('created_at', 'desc')->withCount('replies');
                }
            ])
            ->withCount(['likes', 'comments'])
            ->orderBy('updated_at', 'desc')
            ->get()
            ->map(function ($post) {
                $post->comments_count += $post->comments->sum('replies_count');
                $post->posts = json_decode($post->posts, true);
                return $post;
            });

        return Inertia::render('admin/dashboard', ['posts' => $posts]);

    })->name('dashboard');

    Route::get('posts', function () {
        if (!auth()->check()) {
            return redirect(route('home'));
        }
        $posts = Auth::user()->blog()
            ->with([
                'user:id,name,avatar',
                'comments' => function ($query) {
                    $query->with([
                        'user:id,name,avatar',
                        'replies' => function ($query) {
                            $query->with(['user:id,name,avatar'])->orderBy('created_at', 'desc');
                        }
                    ])->withCount('replies')->orderBy('created_at', 'desc'); // Count replies per comment
                }
            ])
            ->withCount(['likes', 'comments'])
            ->orderBy('updated_at', 'desc')
            ->paginate(2)
            ->through(function ($post) {
                $post->comments_count += $post->comments->sum('replies_count');
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


Route::post('comments/{comment}/storereply', [CommentController::class, 'storereply'])
    ->name('comments.storereply')
    ->middleware(['auth', 'verified']);

Route::post('comments/destroyreply/{reply}', [CommentController::class, 'destroyreply'])
    ->name('comments.destroyreply')
    ->middleware(['auth', 'verified']);

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
