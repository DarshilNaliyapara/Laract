<?php
namespace App\Http\Controllers;

use App\Models\Blog;
use App\Models\User;
use App\Models\Reply;
use App\Models\Comment;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\RedirectResponse;

class CommentController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'comment' => 'required|string|max:255',
            'blog_id' => 'required|exists:blogs,id',
        ]);

        $blog = Blog::findOrFail($request->blog_id);

        $blog->comments()->create([
            'blog_id' => $blog->id,
            'user_id' => Auth::id(),
            'comment' => $validated['comment'],
        ]);
        $posts = json_decode($blog->posts, true);
                 
        if ($blog->user_id !== Auth::user()->id) {
            Notification::create([
                'notification' => Auth::user()->name . ' commented: "' . $request->comment . '" on your post about: "' . $posts['title'] . '"',
                'user_id' => $blog->user_id,
            ]);
        }
        return redirect()->back()->with('status', 'Comment added successfully!');
    }
    public function destroy(Comment $comment)
    {
        $comment->delete();
        return redirect()->back();
    }

    public function storereply(Request $request, Comment $comment): RedirectResponse
    {

        $validated = $request->validate([
            'replies' => 'required|string|max:255',
        ]);

        $comment->replies()->create([
            'replies' => $validated['replies'],
            'user_id' => auth()->id(),
            'comment_id' => $comment->id
        ]);
        if ($comment->user_id !== Auth::user()->id) {
            Notification::create([
                'notification' => Auth::user()->name . ' replied: "' . $request->replies . '" on your comment: "' . $comment->comment . '"',    
                'user_id' => $comment->user_id,
            ]);
        }
        return redirect()->back();
    }

    public function destroyreply(Reply $reply): RedirectResponse
    {
        $reply->delete();

        return redirect()->back();
    }
}
