import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Card, CardContent } from "@/components/ui/card";
import { Pencil, Trash2, MessageCircle } from "lucide-react";
import { Button } from '@/components/ui/button';
import Pagination from '@/components/paginate';
import { type SharedData } from '@/types';
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { router } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import Comments from '@/components/comment';


const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Home', href: '/home' },
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


export default function Home({ posts }: { posts: PostsData }) {
    console.log(posts);
    const { auth } = usePage<SharedData>().props;
    const [formattedPost, setFormattedPost] = useState("");
    const { data, setData } = useForm({
        page: posts.current_page
    });

    const [commentingPost, setCommentingPost] = useState<number | null>(null);


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
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                try {
                    router.post(route('blogs.destroy', slug), {
                        _method: 'delete'
                    }, {
                        preserveScroll: true
                    });
                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: "Deleted Successfully!",
                        showConfirmButton: false,
                        timer: 1800
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
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Home" />
            <div className="flex flex-col gap-4 p-4">
                {formattedPosts.length > 0 ? (
                    formattedPosts.map((post) => {
                        return (
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
                                            <Link href={route('blogs.show', post.slug)}>
                                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white underline">
                                                    {post.posts.title}
                                                </h2>
                                            </Link>

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

                                            <div className="mt-4 flex gap-3">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="flex items-center gap-2"
                                                    onClick={() => toggleComment(post.id)}
                                                >
                                                    <MessageCircle className="w-4 h-4" />
                                                    Comments {post.comments_count ? <>({post.comments_count})</> : <></>}
                                                </Button>
                                                {auth.user.id === post.user.id && (
                                                    <>
                                                        <Link href={route('blogs.edit', post.slug)}>
                                                            <Button variant="outline" size="sm" className="flex cursor-pointer items-center gap-2 text-blue-600 border-blue-600">
                                                                <Pencil className="w-4 h-4" />
                                                                Edit
                                                            </Button>
                                                        </Link>

                                                        <form id="dlt-form" onSubmit={(e) => {
                                                            e.preventDefault();
                                                            deleteblog(post.slug);
                                                        }}>
                                                            <Button
                                                                variant="destructive"
                                                                size="sm"
                                                                className="flex items-center gap-2 cursor-pointer"
                                                                onClick={() => deleteblog(post.slug)}
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                                Delete
                                                            </Button>
                                                        </form>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        {commentingPost === post.id && (
                                            <Comments postId={post.id} comments={Array.isArray(post.comments) ? post.comments : []} authUserId={auth.user.id} />
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })
                ) : (
                    <p className="text-center text-gray-500 dark:text-gray-400">No posts available</p>
                )}
                {formattedPosts.length > 0 &&
                    <Pagination
                        links={posts.links}
                        currentPage={posts.current_page}
                        setCurrentPage={(page) => setData('page', page)} />
                }
            </div>
        </AppLayout>
    );
}
