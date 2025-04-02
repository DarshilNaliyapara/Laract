<?php
namespace App\Http\Controllers;

use App\Models\Blog;
use App\Models\Comment;
use App\Models\Like;
use App\Models\Notification;
use App\Models\User;
use Inertia\Inertia;
use App\Models\Photo;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Process;
use Illuminate\Support\Facades\Storage;

class BlogController extends Controller
{

    public function index()
    {
        //
    }
    public function edit(Blog $blog, User $user)
    {
        if (!auth()->check()) {
            return redirect(route('home'));
        }
        if (!Gate::allows('update-post', $blog)) {
            abort(401);
            // return redirect(route('home'));
        }
        $blog->posts = json_decode($blog->posts, true);

        return Inertia::render('edit', [

            'blog' => $blog
        ]);
    }

    public function store(Request $request)
    {

        $validated = $request->validate([
            'title' => 'required|min:5|max:80|string',
            'post' => 'required|min:15|max:5000|string|regex:/^[^<>]*$/',
            'file' => 'nullable|mimes:jpeg,jpg,png|max:5000',
        ]);

        $uid = Str::random(3) . rand(10, 99);
        $uuid = $validated['title'] . '-' . $uid;
        $file = $request->file('file');

        $slug = Str::slug($uuid);
        if ($file) {
            $filename = time() . '_' . $file->getClientOriginalName();
            $path = $request->file('file')->storeAs('files', $filename, 'public');
            $blog = $request->user()->blog()->create(['posts' => json_encode($validated), 'slug' => $slug, 'photo_name' => $path]);
        } else {
            $blog = $request->user()->blog()->create(['posts' => json_encode($validated), 'slug' => $slug]);
        }
        return redirect()->route('home')->with('success', 'Blog created successfully.');
    }
    public function update(Request $request, Blog $blog)
    {

        $blogdelete = Blog::where('slug', $blog->slug)->firstOrFail(); // Retrieve a single blog post
        $validated = $request->validate([
            'title' => 'required|min:5|max:80|string',
            'post' => 'required|min:15|max:5000|string|regex:/^[^<>]*$/',
            'file' => 'nullable|mimes:jpeg,jpg,png|max:5000',
        ]);
        $uid = Str::random(3) . rand(10, 99);
        $uuid = $validated['title'] . '-' . $uid;
        $slug = Str::slug($uuid);
        $file = $request->file('file');

        if ($file) {
            if ($blogdelete->photo_name) {
                $path = "{$blogdelete->photo_name}"; // Ensure correct path

                if (Storage::disk('public')->exists($path)) {
                    Storage::disk('public')->delete($path); // Delete file
                }
            }
            $filename = time() . '_' . $file->getClientOriginalName();
            $path = $request->file('file')->storeAs('files', $filename, 'public');
            $blog->update(['posts' => json_encode($validated), 'slug' => $slug, 'photo_name' => $path]);
        } else {

            $blog->update(['posts' => json_encode($validated), 'slug' => $slug]);
        }

        return redirect(route('home'));

    }
    public function show(Blog $blog)
    {
        $latest = Blog::where('slug', $blog->slug)
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
            ->withCount(['comments'])
            ->firstOrFail();
        $latest->comments_count += $latest->comments->sum('replies_count');
        $latest->posts = json_decode($latest->posts, true);
        $latest->comments = $latest->comments()->with('user:id,name')->get();

        return Inertia::render('show', [

            'blog' => $latest
        ]);

    }
    public function guestshow(Blog $blog)
    {
        $latest = Blog::where('slug', $blog->slug)
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
            ->withCount(['comments'])
            ->firstOrFail();
        $latest->comments_count += $latest->comments->sum('replies_count');
        $latest->posts = json_decode($latest->posts, true);
        $latest->comments = $latest->comments()->with('user:id,name')->get();

        return Inertia::render('guest/guest-show', [

            'blog' => $latest
        ]);

    }
    public function destroy(Blog $blog)
    {
        if ($blog->photo_name) {
            $path = "{$blog->photo_name}"; // Ensure correct path

            if (Storage::disk('public')->exists($path)) {
                Storage::disk('public')->delete($path); // Delete file
            }
        }

        $blog->delete();

        return redirect()->back()->with('success', 'Post deleted successfully.');
    }
    public function like(Blog $blog)
    {
        $bloglike = Blog::where('slug', $blog->slug)->firstOrFail();
        Like::create([
            'user_id' => Auth::user()->id,
            'blog_id' => $bloglike->id
        ]);
        $posts = json_decode($blog->posts, true);
     
        if ($blog->user_id !== Auth::user()->id) {
            Notification::create([
                'notification' => Auth::user()->name . ' liked your post about: "' . $posts['title'] . '"',
                'user_id' => $blog->user_id,
            ]);
        }
        return redirect()->back()->with('success', 'Post liked successfully.');
    }
    public function dislike(Blog $blog)
    {
        $blogdislike = Blog::where('slug', $blog->slug)->firstOrFail();
        // Log::info("Checking path: " . $blog);
        Like::where('user_id', Auth::id()) // Auth::id() is a shorthand for Auth::user()->id
            ->where('blog_id', $blogdislike->id)
            ->delete();

        return redirect()->back()->with('success', 'Post liked successfully.');
    }
    public function adminshow(Blog $blog)
    {
        $latest = Blog::where('slug', $blog->slug)
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
            ->firstOrFail();
        $latest->comments_count += $latest->comments->sum('replies_count');
        $latest->replies_count = Comment::whereIn('blog_id', [$latest->id])
            ->withCount('replies')
            ->get()
            ->sum('replies_count');
        $latest->posts = json_decode($latest->posts, true);
        $latest->comments = $latest->comments()->with('user:id,name')->get();
        return Inertia::render('admin/admin-show', [

            'blog' => $latest
        ]);
    }

}
