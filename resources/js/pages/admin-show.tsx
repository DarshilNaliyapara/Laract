import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Card, CardContent } from "@/components/ui/card";
import { Pencil, Trash2, MessageCircle } from "lucide-react";
import { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { type SharedData } from '@/types';
import Comments from '@/components/comment';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Post Show',
        href: '/posts',
    },
];

interface Blog {
    id: number;
    posts: {
        title: string;
        post: string;
    };
    photo_name: string;
    slug: string;
    created_at: number;
    updated_at: number;
    user: {
        id: number;
        name: string;
    }
    liked: boolean;
    likes_count: number;
    comments_count: number;
    comments: string;
}

export default function PostShow({ blog }: { blog: Blog }) {
    const [commentingPost, setCommentingPost] = useState<number | null>(null);

    const { auth } = usePage<SharedData>().props;
    const [formattedPost, setFormattedPost] = useState("");
    const imgSrc = `/storage/${blog.photo_name}`;

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
            <Head title="Posts" />

            <div className="flex h-auto flex-1 flex-col gap-4 rounded-xl p-4">

                <Card key={blog.id} className="w-full rounded-xl border shadow-lg overflow-hidden">
                    <CardContent className="p-3">
                        <div className="flex flex-col">
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600 dark:text-gray-400">{blog.user.name}</span>
                            </div>
                            <small className="ml-2 text-sm text-gray-400 dark:text-gray-500">
                                {new Date(blog.created_at).toLocaleString('en-US', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                    hour: 'numeric',
                                    minute: 'numeric',
                                    hour12: true,
                                })}
                            </small>

                            {blog.created_at !== blog.updated_at && (
                                <small className="text-sm text-gray-400 dark:text-gray-500"> &middot; edited</small>
                            )}

                            <div className="ml-5">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {blog.posts.title}
                                </h2>

                                {/* Image with Zoom */}
                                {blog.photo_name && (
                                    <div className="flex flex-wrap gap-4 mt-3">
                                        <div className="relative  md:w-1/2 lg:w-1/3 flex items-start">
                                            <div className="flex overflow-hidden rounded-lg">
                                                <Zoom >
                                                    <img
                                                        className="cursor-pointer rounded-lg shadow-lg max-h-96 object-contain"
                                                        src={imgSrc}
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
                                        Comments  {blog.comments_count ? <>({blog.comments_count})</> : <></>}
                                    </Button>
                                </div>
                            </div>
                            {commentingPost && (
                                <Comments postId={blog.id} comments={Array.isArray(blog.comments) ? blog.comments : []} authUserId={auth.user.id} />
                            )}
                        </div>
                    </CardContent>
                </Card>
                <div className="mt-6">

                    <div className="p-4">
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={[
                                { name: 'Likes', value: blog.likes_count },
                                { name: 'Comments', value: blog.comments_count }
                            ]}>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="value" fill="#8884d8" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
