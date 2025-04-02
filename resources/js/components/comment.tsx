import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Send, Trash2, X } from "lucide-react";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime';
import { router } from "@inertiajs/react";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import InputError from '@/components/input-error';
import Reply from "./reply";
import toast from "react-hot-toast";

dayjs.extend(relativeTime);

interface Comment {
    id: number;
    user_id: number;
    comment: string;
    created_at: string;
    user: {
        id: number;
        name: string;
        avatar: string;
    };
    replies: {
        id: number;
        user_id: number;
        replies: string;
        created_at: string;
        user: {
            id: number;
            name: string;
            avatar: string;
        };
    }[];
}

interface CommentsProps {
    postId: number;
    comments: Comment[];
    authUserId?: number;
    postuserId: number;
}

export default function Comments({ postId, comments, authUserId, postuserId }: CommentsProps) {

    const [commentText, setCommentText] = useState("");
    const [replyText, setReplyText] = useState("");
    const [errors, setErrors] = useState<{ comment?: string }>({});
    const [replyingTo, setReplyingTo] = useState<Comment | null>(null); // Track reply
    const inputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (replyingTo && inputRef.current) {
            inputRef.current.focus();
        }
    }, [replyingTo]);

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
                setErrors({});
            }
        });
    };

    const deleteComment = (id: number) => {
        try {
            router.post(route('comments.destroy', id), {
                _method: 'delete'
            }, {
                onSuccess: () =>
                    toast.success('Comment Deleted Successfully'),
                preserveScroll: true
            });

        } catch (e) {
            toast.error('Something went Wrong!')
        }
    };

    const submitReply = () => {
        if (!replyingTo) return;
        if (replyText.trim() === "") {
            setErrors({ comment: "Reply cannot be empty." });
            return;
        }

        router.post(route("comments.storereply", replyingTo.id), {
            replies: replyText,
            comment_id: replyingTo.id,
        }, {
            preserveScroll: true,
            onError: (err) => setErrors(err),
            onSuccess: () => {
                setReplyText("");
                setReplyingTo(null);
                setErrors({});
            },
        });
    };

    return (
        <div className="ml-10 mt-4 p-4 border rounded-lg dark:bg-black bg-white shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Comments</h3>
            <div className="max-h-65 overflow-y-auto space-y-3 pr-2">

                {comments.length > 0 ? (
                    comments.map((comment) => (
                        <div key={comment.id} className="flex gap-3 items-start p-3 border rounded-md dark:bg-background bg-gray-100 shadow-sm">

                            <Avatar className="h-8 w-8 overflow-hidden rounded-full">
                                <AvatarImage src={`/storage/${comment.user.avatar}`} alt={comment.user.name} />
                                <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                                    {comment.user.name.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <div className="flex items-center">
                                    <p className="font-semibold text-gray-900 dark:text-gray-100">{comment.user.name}</p>
                                    {postuserId === comment.user.id && <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5 ml-2">
                                        - author
                                    </p>}
                                </div>
                                <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                                    {dayjs(comment.created_at).fromNow()}
                                </p>
                                <p className="text-sm text-gray-800 dark:text-gray-300 mt-2 leading-relaxed">
                                    {comment.comment}
                                </p>
                                <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5 " >
                                    <span className="cursor-pointer" onClick={() => setReplyingTo(comment)}> <strong>Reply</strong></span>
                                </p>
                                {comment.replies && comment.replies.length > 0 && (
                                    <div className="mt-3 space-y-3 border-l-2 border-gray-300 dark:border-gray-700 pl-3">
                                        {comment.replies.map((reply) => (
                                            <Reply key={reply.id} replies={reply} authUserId={authUserId} postuserId={postuserId} />
                                        ))}
                                    </div>
                                )}
                            </div>
                            {authUserId ? (
                                <>
                                    {(authUserId === comment.user_id || route().current('blogs.adminshow')) && (
                                        <Button variant="destructive" size="sm" className="flex items-center gap-2 cursor-pointer" onClick={() => deleteComment(comment.id)}>
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    )}
                                </>
                            ) : (<></>)}

                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 dark:text-gray-400">Be First to Comment.</p>
                )}
            </div>
            {replyingTo && (
                <div className="mt-3 p-2 mr-2 bg-gray-200 dark:bg-background border rounded-md flex items-center justify-between">
                    <p className="text-sm text-gray-800 dark:text-gray-300">
                        Replying to: <span className="font-semibold">{replyingTo.user.name}</span>
                    </p>
                    <X className="w-4 h-4 cursor-pointer text-gray-600" onClick={() => setReplyingTo(null)} />
                </div>
            )}
            <InputError message={errors.comment} className="mt-2" />

            <div className="mt-3 flex items-center gap-2">
                <input
                    id="comment"
                    type="text"
                    required
                    ref={inputRef}
                    autoFocus={!replyingTo}
                    placeholder={replyingTo ? "Write a reply..." : "Write a comment..."}
                    value={replyingTo ? replyText : commentText}
                    onChange={(e) =>
                        replyingTo ? setReplyText(e.target.value) : setCommentText(e.target.value)
                    }
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            replyingTo ? submitReply() : submitComment();
                        }
                    }}
                    className="w-full h-10 px-3 bg-background text-sm border-2 rounded-md shadow-sm focus:ring focus:ring-gray-300 dark:focus:ring-gray-600"
                />
                <Button size="sm" onClick={replyingTo ? submitReply : submitComment} className="mr-2 h-10 w-10">
                    <Send style={{ width: '20px', height: '20px' }} />
                </Button>
            </div>
        </div>
    );
}
