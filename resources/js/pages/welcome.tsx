import AppLogo from '@/components/app-logo';
import { type BreadcrumbItem } from '@/types';
import { type SharedData } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import Pagination from '@/components/paginate';
import { Children, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Pencil, Trash2, MessageCircle } from "lucide-react";
import { Button } from '@/components/ui/button';
import { router } from '@inertiajs/react';
import Comments from '@/components/comment';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Laract', href: '/home' },
];

interface Post {
    id: number;
    user_id: number;
    posts: {
        title: string;
        post: string;
    };
    photo_name: string;
    created_at: string;
    updated_at: string;
    user: {
        name: string;
        id: number;
    };
    slug: string;
    liked: boolean;
    likes_count: number;
    comments: string;
    comments_count: number;

}

interface Link {
    url: string;
    label: string;
    active: boolean;
}

interface PostsData {
    data: Post[];
    links: Link[];
    current_page: number;
}
export default function Laract({ posts }: { posts: PostsData }) {
    const { auth } = usePage<SharedData>().props;
    const [commentingPost, setCommentingPost] = useState<number | null>(null);

    const { data, setData } = useForm({
        page: posts.current_page
    });

    const like = (slug: string) => {
        router.post(route('blogs.like', slug));
    }
    const dislike = (slug: string) => {
        router.post(route('blogs.dislike', slug));
    }
    const formattedPosts = Array.isArray(posts.data) ? posts.data : [];
    const wordLimit = 20;

    const getExcerpt = (text: string, limit: number) => {
        if (!text) return "";
        const words = text.split(" ");
        let truncatedText = words.length > limit
            ? words.slice(0, limit).join(" ") + " <strong>...Read More</strong>"
            : text;

        // Convert URLs into clickable links
        truncatedText = truncatedText
            .replace(/\n/g, "<br>")
            .replace(
                /(https?:\/\/[^\s<]+)/g,
                '<a href="$1" class="text-blue-500 underline" target="_blank" rel="noopener noreferrer">$1</a>'
            );

        return truncatedText;
    };
    const toggleComment = (postId: number) => {
        setCommentingPost(commentingPost === postId ? null : postId);
    };
    return (
        <>
            <Head title="Laract">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex flex-col min-h-screen text-[#1b1b18] ">
                <header className="w-full p-4 bg-white shadow-md dark:bg-black  border-b-2 flex justify-between items-center">
                    <AppLogo />
                    <div>
                        <Link href={route('login')} className="px-4 py-2 text-sm text-[#1b1b18] dark:text-[#EDEDEC] hover:underline">Log in</Link>
                        <Link href={route('register')} className="px-4 py-2 text-sm border rounded dark:border-[#3E3E3A] text-[#1b1b18] dark:text-[#EDEDEC] hover:border-[#1915014a] dark:hover:border-[#62605b]">Register</Link>
                    </div>
                </header>
                <main className="flex-grow flex justify-center items-center p-6">
                    <div className="w-full rounded-lg ">
                        {formattedPosts.length > 0 ? (
                            formattedPosts.map((post) => {
                                return (
                                    <div className="flex flex-col gap-2 p-2">
                                        <Card key={post.id} className="w-full rounded-xl border shadow-lg overflow-hidden">
                                            <CardContent className="p-3">
                                                <div className="flex flex-col">
                                                    <div className="flex justify-between">
                                                        <span className="text-sm text-gray-600 dark:text-gray-400">{post.user.name}</span>
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
                                                                    type='submit'
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
                                                    <small className="ml-2 text-sm text-gray-400 dark:text-gray-500">
                                                        {new Date(post.created_at).toLocaleString('en-US', {
                                                            day: 'numeric',
                                                            month: 'short',
                                                            year: 'numeric',
                                                            hour: 'numeric',
                                                            minute: 'numeric',
                                                            hour12: true,
                                                        })}
                                                    </small>

                                                    {post.created_at !== post.updated_at && (
                                                        <small className="text-sm text-gray-400 dark:text-gray-500"> &middot; edited</small>
                                                    )}

                                                    <div className='ml-5'>
                                                        <a href={route('blogs.show', post.slug)}>
                                                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white underline">
                                                                {post.posts.title}
                                                            </h2>
                                                        </a>

                                                        {/* Post Image */}
                                                        {post.photo_name && (
                                                        <div className="flex flex-wrap gap-4 mt-3">
                                                            <div className="relative  md:w-1/2 lg:w-1/3 flex items-start">
                                                              <div className=" flex overflow-hidden rounded-lg">
                                                                <img
                                                                  src={`/storage/${post.photo_name}`}
                                                                  alt="Blog Preview"
                                                                  className="cursor-pointer rounded-lg shadow-lg  max-h-96 object-contain"
                                                                />
                                                              </div>
                                                            </div>
                                                          </div>
                                                      )}


                                                        <p
                                                            className="postContent text-base text-gray-700 mt-2 dark:text-gray-300"
                                                            dangerouslySetInnerHTML={{
                                                                __html: getExcerpt(post.posts.post, wordLimit),
                                                            }}

                                                        ></p>
                                                        {/* Post Actions */}
                                                        <div className="mt-4 flex gap-3">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="flex items-center gap-2"
                                                                onClick={() => toggleComment(post.id)}
                                                            >
                                                                <MessageCircle className="w-4 h-4" />
                                                                Comment  {post.comments_count ? <>({post.comments_count})</> : <></>}
                                                            </Button>

                                                        </div>
                                                    </div>
                                                    {commentingPost === post.id && (
                                                        <Comments postId={post.id} comments={Array.isArray(post.comments) ? post.comments : []} />
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                );
                            })
                        ) : (
                            <p className="text-center text-gray-500 dark:text-gray-400">No posts available</p>
                        )}

                    </div>
                </main>
                {formattedPosts.length > 0 && (
                    <Pagination
                        links={posts.links}
                        currentPage={posts.current_page}
                        setCurrentPage={(page) => setData('page', page)}

                    />
                )}
            </div>
        </>

    );
}
