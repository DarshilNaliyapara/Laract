import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { type SharedData } from '@/types';
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Pencil, Trash2, MessageCircle } from "lucide-react";
import { Button } from '@/components/ui/button';
import Comments from '@/components/comment';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

dayjs.extend(relativeTime);
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Post Show',
        href: '/blogs',
    },
];

interface Blog {
    id: number;
    posts: {
        title: string;
        post: string;
        avatar: string;
    };
    photo_name: string;
    slug: string;
    created_at: number;
    updated_at: number;
    user: {
        id: number;
        name: string;
        avatar: string;
    }
    liked: boolean;
    likeCount: number;
    comments: string;
    comments_count: number;

}

export default function PostShow({ blog }: { blog: Blog }) {

    const [formattedPost, setFormattedPost] = useState("");
    const imgSrc = `/storage/${blog.photo_name}`;
    const [commentingPost, setCommentingPost] = useState<number | null>(null);

    const { auth } = usePage<SharedData>().props;

    useEffect(() => {
        const linkedPost = blog.posts.post
            .replace(/\n/g, "<br>")
            .replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" class="text-blue-500 underline" target="_blank" rel="noopener noreferrer">$1</a>');

        setFormattedPost(linkedPost);
    }, [blog.posts]);
    
    const toggleComment = (postId: number) => {
        setCommentingPost(commentingPost === postId ? null : postId);
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Post Show" />

            <div className="flex h-auto flex-1 flex-col gap-4 rounded-xl p-4">
                <div key={blog.id} className="w-full rounded-xl border-2 shadow-lg overflow-hidden">
                    <div className="p-4">
                        <div className="flex flex-col">
                            <div className="flex items-center space-x-2">
                                <Avatar className="h-8 w-8 overflow-hidden rounded-full">
                                    <AvatarImage src={`/storage/${blog.user.avatar}`} alt={blog.user.name} />
                                    <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                                        {blog.user.name.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <span className="text-sm text-gray-600 dark:text-gray-400">{blog.user.name}</span>
                                <small className="text-sm text-gray-400 dark:text-gray-500">
                                    {dayjs(blog.created_at).fromNow()}
                                    {blog.created_at !== blog.updated_at && (
                                        <small className="text-sm text-gray-400 ml-2 dark:text-gray-500">- edited</small>
                                    )}
                                </small>
                            </div>

                            <div className="ml-10">
                                <h2 className="text-2xl mt-1 font-bold text-gray-900 dark:text-white">
                                    {blog.posts.title}
                                </h2>

                                {/* Image with Zoom */}
                                {blog.photo_name && (
                                    <div className="flex flex-wrap gap-4 mt-3">
                                        <div className="relative md:w-1/2 lg:w-1/3 flex items-start">
                                            <div className="flex overflow-hidden rounded-lg">
                                                <Zoom>
                                                    <img
                                                        className="cursor-pointer rounded-lg shadow-lg  max-h-96 object-contain"
                                                        src={`/storage/${blog.photo_name}`}
                                                        alt="Blog Image"
                                                    />
                                                </Zoom>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <p
                                    className="text-gray-700 dark:text-gray-300 mt-2 postContent"
                                    dangerouslySetInnerHTML={{ __html: formattedPost }}
                                ></p>
                                <div className="mt-4 flex gap-3">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex items-center gap-2"
                                        onClick={() => toggleComment(blog.id)}
                                    >
                                        <MessageCircle className="w-4 h-4" />
                                        Comments {blog.comments_count ? <>({blog.comments_count})</> : <></>}
                                    </Button>
                                </div>
                            </div>
                            {commentingPost && (
                                <Comments postId={blog.id} comments={Array.isArray(blog.comments) ? blog.comments : []} authUserId={auth.user.id} postuserId={blog.user.id}/>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout >
    );
}
