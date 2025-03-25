import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageCircle, Pencil, Trash2 } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Link } from "@inertiajs/react";
import Comments from "./comment";
import { type SharedData } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { router } from "@inertiajs/react";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

dayjs.extend(relativeTime);

interface PostProps {
    post: {
        id: number;
        user_id: number;
        posts: {
            title: string;
            post: string;
            avatar: string;
        };
        photo_name: string;
        created_at: string;
        updated_at: string;
        slug: string;
        liked: boolean;
        likes_count: number;
        comments: string;
        comments_count: number;
        user: {
            name: string;
            id: number;
            avatar: string;
        };
    };
    commentingPost: number | null;
    toggleComment: (postId: number) => void;
}

export default function Post({ post, commentingPost, toggleComment }: PostProps) {
    const { auth } = usePage<SharedData>().props;

    const like = (slug: string) => {
        router.post(route('blogs.like', slug), {}, {
            preserveScroll: true
        });
    }
    const dislike = (slug: string) => {
        router.post(route('blogs.dislike', slug), {}, {
            preserveScroll: true
        });
    }

    const deleteblog = (slug: string) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
            background: 'rgba(44, 53, 57, 0.2)',
            willOpen: () => {
                const swalPopup = document.querySelector(".swal2-popup") as HTMLElement;
                if (swalPopup) {
                    Object.assign(swalPopup.style, {
                        borderRadius: "20px",
                        background: "rgba(3, 3, 3, 0.5)",
                        color: "#fff",
                        backdropFilter: "blur(10px)",
                        border: "1px solid rgba(200, 200, 200, 0.2)",
                        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
                        padding: "20px",
                    });
                }
            },

        }).then((result) => {
            if (result.isConfirmed) {
                try {
                    router.post(route('blogs.destroy', slug), {
                        _method: 'delete',

                    }, {
                        onSuccess: () => toast.success('Post Deleted Successfully'),

                        preserveScroll: true
                    });
                } catch (e) {
                    toast.error('Something went Wrong!');
                }
            }
        })
    };

    const getExcerpt = (text: string, limit: number) => {
        if (!text) return "";
        const words = text.split(" ");
        let truncatedText = words.length > limit
            ? words.slice(0, limit).join(" ") + " <strong>...Read More</strong>"
            : text;

        truncatedText = truncatedText
            .replace(/\n/g, "<br>")
            .replace(
                /(https?:\/\/[^\s<]+)/g,
                '<a href="$1" class="text-blue-500 underline" target="_blank" rel="noopener noreferrer">$1</a>'
            );

        return truncatedText;
    };

    return (
        <div key={post.id} className="w-full rounded-xl border shadow-lg overflow-hidden">
            <div className="p-3">
                <div className="flex flex-col m-1">
                    <div className="flex justify-between">
                        <div className="flex items-center space-x-2">
                            <Avatar className="h-8 w-8 overflow-hidden rounded-full">
                                <AvatarImage src={`/storage/${post.user.avatar}`} alt={post.user.name} />
                                <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                                    {post.user.name.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-gray-600 dark:text-gray-400">{post.user.name}</span>
                            <small className="text-sm text-gray-400 dark:text-gray-500">
                                {dayjs(post.created_at).fromNow()}

                                {post.created_at !== post.updated_at && (
                                    <small className="text-sm text-gray-400 ml-2 dark:text-gray-500">- edited</small>
                                )}

                            </small>
                        </div>

                        <div className="text-right flex gap-2 justify-end">
                            {post.liked ? (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="w-6 h-6 text-red-500 cursor-pointer"
                                    onClick={() => dislike(post.slug)}
                                >
                                    <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                                </svg>
                            ) : (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-6 h-6 text-gray-600 dark:text-gray-400 cursor-pointer"
                                    onClick={() => like(post.slug)}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                                    />
                                </svg>
                            )}
                            <span className="text-gray-600 dark:text-gray-400">{post.likes_count}</span>
                        </div>
                    </div>

                    <div className="ml-10">
                        <Link href={route().current('welcome') ? `/guest/${post.slug}` : `/blogs/${post.slug}`}>

                            <h2 className="text-2xl mt-1 font-bold text-gray-900 dark:text-white underline">
                                {post.posts.title}
                            </h2>
                        </Link>

                        {post.photo_name && (
                            <div className="flex flex-wrap gap-4 mt-3">
                                <div className="relative md:w-1/2 lg:w-1/3 flex items-start">
                                    <div className="flex overflow-hidden rounded-lg">
                                        <img
                                            src={`/storage/${post.photo_name}`}
                                            alt="Blog Preview"
                                            className="cursor-pointer rounded-lg shadow-lg max-h-96 object-contain"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        <p
                            className="postContent text-base text-gray-700 mt-2 dark:text-gray-300"
                            dangerouslySetInnerHTML={{
                                __html: getExcerpt(post.posts.post, 20),
                            }}
                        ></p>

                        <div className="mt-4 flex gap-3">
                            <Button
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-2"
                                onClick={() => toggleComment(post.id)}
                            >
                                <MessageCircle className="w-4 h-4" />
                                Comments {post.comments_count ? <>({post.comments_count})</> : null}
                            </Button>

                            {auth.user?.id === post.user.id && (
                                <>
                                    <Link href={`/blogs/${post.slug}/edit`}>
                                        <Button variant="outline" size="sm" className="flex items-center gap-2 text-blue-600 border-blue-600">
                                            <Pencil className="w-4 h-4" />
                                            Edit
                                        </Button>
                                    </Link>

                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        className="flex items-center gap-2"
                                        onClick={() => deleteblog(post.slug)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Delete
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>

                    {commentingPost === post.id && (
                        <Comments postId={post.id} comments={Array.isArray(post.comments) ? post.comments : []} authUserId={auth.user?.id} postuserId={post.user.id} />
                    )}
                </div>
            </div>
        </div>
    );
};
