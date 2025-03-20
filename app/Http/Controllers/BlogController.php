<?php
namespace App\Http\Controllers;

use App\Models\Blog;
use App\Models\Like;
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

    public function index(Blog $blog, User $user)
    {

        if (!auth()->check()) {
            return redirect(route('home'));
        }
        $posts = Auth::user()->blog()->with('user')->latest()->paginate(2);
        // $posts = Blog::with('user:id,name')->latest()->paginate(perPage: 3);
        // $comments = Comment::latest()->get();
        $posts->getCollection()->transform(function ($post) {
            $post->likeCount = $post->likes()->count();
            $post->liked = $post->likes()->where('user_id', auth()->id())->exists();
            $post->comments = $post->comments()->with('user:id,name')->get();
            return $post;
        });
        return Inertia::render('posts', [
            'posts' => $posts
        ]);

    }
    public function edit(Blog $blog, User $user)
    {
        if (!auth()->check()) {
            return redirect(route('home'));
        }
        if (!Gate::allows('update-post', $blog)) {
            abort(401);
        }
        return Inertia::render('edit', [

            'blog' => $blog
        ]);


    }

    public function store(Request $request)
    {

        $validated = $request->validate([
            'title' => 'required|min:5|max:30|string',
            'post' => 'required|min:15|max:1000|string|regex:/^[^<>]*$/',
            'file' => 'nullable|mimes:jpeg,jpg,png|max:5000',
        ]);

        $uid = Str::random(3) . rand(10, 99);
        $uuid = $validated['title'] . '-' . $uid;
        $file = $request->file('file');

        $slug = Str::slug($uuid);
        if ($file) {
            $name = $file->getClientOriginalName();
            $path = $request->file('file')->storeAs('files', $name, 'public');
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
            'title' => 'required|min:5|max:30|string',
            'post' => 'required|min:15|max:1000|string|regex:/^[^<>]*$/',
            'file' => 'nullable|mimes:jpeg,jpg,png|max:5000',
        ]);
        $uid = Str::random(3) . rand(10, 99);
        $uuid = $validated['title'] . '-' . $uid;
        $slug = Str::slug($uuid);
        $file = $request->file('file');

        if ($file) {
            if ($blogdelete->photo_name) {
                $path = "{$blogdelete->photo_name}"; // Ensure correct path

                Log::info("Checking path: " . $path);
                Log::info("File exists? => " . (Storage::disk('public')->exists($path) ? 'true' : 'false'));

                if (Storage::disk('public')->exists($path)) {
                    Storage::disk('public')->delete($path); // Delete file
                }
            }
            $name = $file->getClientOriginalName();
            $path = $request->file('file')->storeAs('files', $name, 'public');
            $blog->update(['posts' => json_encode($validated), 'slug' => $slug, 'photo_name' => $path]);
        } else {

            $blog->update(['posts' => json_encode($validated), 'slug' => $slug]);
        }


        return redirect(route('home'));

    }
    public function show(Blog $blog)
    {
        $latest = Blog::where('slug', $blog->slug)
            ->with('user:id,name')
            ->firstOrFail(); // Retrieve a single blog post
        $latest->comments = $latest->comments()->with('user:id,name')->get();
          
        return Inertia::render('show', [

            'blog' => $latest
        ]);

    }
    public function destroy(Blog $blog)
    {


        if ($blog->photo_name) {
            $path = "{$blog->photo_name}"; // Ensure correct path

            Log::info("Checking path: " . $path);
            Log::info("File exists? => " . (Storage::disk('public')->exists($path) ? 'true' : 'false'));

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
        // Log::info("Checking path: " . $blog);
        Like::create([
            'user_id' => Auth::user()->id,
            'blog_id' => $bloglike->id
        ]);
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
    public function adminshow(Blog $blog){
          $latest = Blog::where('slug', $blog->slug)
                ->with('user:id,name')
                ->firstOrFail(); // Retrieve a single blog post
            $latest->likeCount = $latest->likes()->count();
            $latest->liked = $latest->likes()->where('user_id', auth()->id())->exists();
            $latest->commentCount = $latest->comments()->count();
            $latest->comments = $latest->comments()->with('user:id,name')->get();
            return Inertia::render('admin-show', [
    
                'blog' => $latest
            ]);
    
        
    }
}
