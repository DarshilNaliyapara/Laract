import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import { router } from "@inertiajs/react";
import InputError from '@/components/input-error';

interface Comment {
    id: number;
    user_id: number;
    comment: string;
    created_at: string;
    user: {
        id: number;
        name: string;
    };
}

interface CommentsProps {
    postId: number;
    comments: Comment[];
    authUserId?: number;
}

export default function Comments({ postId, comments, authUserId }: CommentsProps) {
    const [commentText, setCommentText] = useState("");
    const [errors, setErrors] = useState<{ comment?: string }>({});

    const submitComment = () => {
        if (commentText.trim() === "") {
            setErrors({ comment: "Comment cannot be empty." });

            return;
        }
        router.post(route('comments.store'), {
            comment: commentText,
            blog_id: postId,
        }, {
            preserveScroll: true,
            onError: (err) => {
                setErrors(err);
            },
            onSuccess: () => {
                setCommentText("");
                setErrors({}); // Clear errors on success
            }
        });


    };

    const deleteComment = (id: number) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                try {
                    router.post(route('comments.destroy', id), {
                        _method: 'delete'
                    }, {
                        preserveScroll: true
                    });
                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: "Comment Deleted Successfully!",
                        showConfirmButton: false,
                        timer: 1800,

                    });
                } catch (error) {
                    Swal.fire({
                        title: "Error",
                        text: (error as any).response?.data?.message || "Something went wrong!",
                        icon: "error",
                    });
                }
            }
        })
    };

    return (
        <div className="ml-5 mt-4 p-4 border rounded-lg dark:bg-black bg-white shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Comments</h3>

            <div className="max-h-61 overflow-y-auto space-y-3 pr-2">
                {comments.length > 0 ? (
                    comments.map((comment) => (
                        <div key={comment.id} className="flex gap-3 items-start p-3 border rounded-md dark:bg-background bg-gray-100 shadow-sm">
                            <div className="w-10 h-10 flex-shrink-0 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center text-sm font-bold text-gray-800 dark:text-gray-200">
                                {comment.user.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold text-gray-900 dark:text-gray-100">{comment.user.name}</p>
                                <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                                    {new Date(comment.created_at).toLocaleString('en-US', {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric',
                                        hour: 'numeric',
                                        minute: 'numeric',
                                        hour12: true,
                                    })}
                                </p>
                                <p className="text-sm text-gray-800 dark:text-gray-300 mt-2 leading-relaxed">
                                    {comment.comment}
                                </p>
                            </div>
                            {authUserId ? (
                                <>
                                    {(authUserId === comment.user_id  || route().current('blogs.adminshow')) && (
                                        <Button variant="destructive" size="sm" className="flex items-center gap-2 cursor-pointer" onClick={() => deleteComment(comment.id)}>
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    )}
                                </>
                            ) : (<></>)}

                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 dark:text-gray-400">No comments yet.</p>
                )}
            </div>
            <InputError message={errors.comment} className="mt-2" />

            {/* Comment Input */}
            <div className="mt-4 flex items-center gap-3">
                <input
                    id="comment"
                    type="text"
                    required
                    autoFocus
                    placeholder="Write a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            submitComment();
                        }
                    }
                }
                    className="w-full h-10 px-3 bg-background text-sm border-2 rounded-md shadow-sm focus:ring focus:ring-gray-300 dark:focus:ring-gray-600"
                />
                <Button size="sm"  onClick={submitComment} className="px-4 py-2">
                    Comment
                </Button>
            </div>
        </div>
    );
}
