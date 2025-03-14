<?php
namespace App\Http\Controllers;

use App\Models\Blog;
use App\Models\User;
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
            return redirect(route('dashboard'));
        }
        $posts = Auth::user()->blog()->with('user')->latest()->simplePaginate(2);
      
        return view('blogs', compact('user', 'posts', 'blog'));

    }
    public function edit(Blog $blog, User $user)
    {
        if (!auth()->check()) {
            return redirect(route('dashboard'));
        }
        if (!Gate::allows('update-post', $blog)) {
            abort(401);
        }

        $val = json_decode($blog->posts, true);
        $posts = Auth::user()->blog()->with('user')->latest()->simplePaginate(2);
        return view('blogs', compact('user', 'posts', 'blog', 'val'));


    }

    public function store(Request $request)
    {

        $validated = $request->validate([
            'title' => 'required|min:5|max:30|string',
            'post' => 'required|min:15|max:1000|string|regex:/^[^<>]*$/',
            'file' => 'mimes:jpeg,jpg,png|max:5000',
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



        return redirect()->route('dashboard')->with('success', 'Blog created successfully.');

    }
    public function update(Request $request, Blog $blog)
    {

        $validated = $request->validate([
            'title' => 'required|min:5|max:30|string',
            'post' => 'required|min:15|max:1000|string|regex:/^[^<>]*$/',
        ]);
        $uid = Str::random(3) . rand(10, 99);
        $uuid = $validated['title'] . '-' . $uid;
        $slug = Str::slug($uuid);
        $blog->update(['posts' => json_encode($validated), 'slug' => $slug]);

        return redirect(route('dashboard'));

    }
    public function show(Blog $blog, User $user)
    {
        $latest = $user->blog()->with('user')->latest()->first();

        return view('dashboard', ['blog' => $blog, 'latest' => $latest]);
    }
    public function destroy(Blog $blog)
    {


        $file = Photo::where('blog_id', $blog->id)->first();

        if ($file) {
            $path = $file->photo_name; // Directly use photo_name since it already has "files/"

            Log::info("Checking path: " . $path);
            Log::info("File exists? => " . (Storage::disk('public')->exists($path) ? 'true' : 'false'));

            if (Storage::disk('public')->exists($path)) {
                Storage::disk('public')->delete($path); // Use the correct disk

            }
        }
        $blog->delete();
        return redirect(route('dashboard'));
    }
}
