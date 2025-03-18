import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Post Show',
        href: '/posts',
    },
];

interface Blog {
    id: number;
    posts: string;
    photo_name: string;
    slug: string;
    created_at: number;
    updated_at: number;
    user: {
        id: number;
        name: string;
    }
    liked: boolean;
    likeCount: number;
}

export default function PostShow({ blog }: { blog: Blog }) {
    const postContent = JSON.parse(blog.posts);
    const [formattedPost, setFormattedPost] = useState("");
    const imgSrc = `/storage/${blog.photo_name}`;

    useEffect(() => {
        const linkedPost = postContent.post
            .replace(/\n/g, "<br>")
            .replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" class="text-blue-500 underline" target="_blank" rel="noopener noreferrer">$1</a>');

        setFormattedPost(linkedPost);
    }, [postContent]);

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
                                    {postContent.title}
                                </h2>

                                {/* Image with Zoom */}
                                {blog.photo_name && (
                                    <div className="flex flex-wrap gap-4 mt-3">
                                        <div className="relative w-full md:w-1/2 lg:w-1/3">
                                            <Zoom >
                                                <img
                                                    className="cursor-pointer rounded-lg shadow object-cover w-full h-full"
                                                    src={imgSrc}
                                                    alt="Blog Image"
                                                    
                                                />
                                            </Zoom>
                                        </div>
                                    </div>
                                )}

                                <p
                                    className="text-gray-700 dark:text-gray-300 mt-2 postContent"
                                    dangerouslySetInnerHTML={{ __html: formattedPost }}
                                ></p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
