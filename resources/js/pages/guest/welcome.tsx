import AppLogo from '@/components/app-logo';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import Pagination from '@/components/paginate';
import Post from '@/components/ui/post';
import { Input } from '@/components/ui/input';
import { useState } from "react";
import { router } from '@inertiajs/react';
import { SearchIcon } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Laract', href: '/home' },
];

interface Post {
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
    user: {
        name: string;
        id: number;
        avatar: string;
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
    const [searchText, setSearchText] = useState("");
   
    const searchblog = () => {
        router.get(route('welcome'), {
            search: searchText,
        })
    }
    const { data, setData } = useForm({
        page: posts.current_page
    });
    const [commentingPost, setCommentingPost] = useState<number | null>(null);

    const toggleComment = (postId: number) => {
        setCommentingPost(commentingPost === postId ? null : postId);
    };

    const formattedPosts = Array.isArray(posts.data) ? posts.data : [];
    return (
        <>
            <Head title="Laract">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex flex-col min-h-screen">
                <header className="w-full p-4 bg-white shadow-md dark:bg-black  border-b-2 flex justify-between items-center">
                    <AppLogo path={route('welcome')} />

                    <div className='flex items-center space-x-2'>
                        <div className="relative flex items-center">
                            <Input type="text" name="search" id='search' placeholder="Search..." onChange={(e) => setSearchText(e.target.value)} onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    searchblog();
                                }
                            }} className="pl-10 pr-3 py-2 border rounded-md" />
                            <SearchIcon type='button' onClick={searchblog} className="absolute left-3 text-gray-500 cursor-pointer" />
                        </div>
                        <Link href={route('login')} className="px-4 py-2 text-sm text-[#1b1b18] dark:text-[#EDEDEC] hover:underline">Log in</Link>
                        <Link href={route('register')} className="px-4 py-2 text-sm border rounded dark:border-[#3E3E3A] text-[#1b1b18] dark:text-[#EDEDEC] hover:border-[#1915014a] dark:hover:border-[#62605b]">Register</Link>
                    </div>
                </header>
                <main className="flex-grow flex p-6">
                    <div className="w-full rounded-lg ">
                        {formattedPosts.length > 0 ? (
                            formattedPosts.map((post) => {
                                return (
                                    <div key={post.id} className="flex flex-col gap-2 p-2">
                                        <Post key={post.id} post={post} commentingPost={commentingPost}
                                            toggleComment={toggleComment} />
                                    </div>
                                );
                            })
                        ) : (
                            <p className="text-center text-gray-500 dark:text-gray-400">No posts available</p>
                        )}
                        <div className="mt-2">
                            {formattedPosts.length > 0 && (
                                <Pagination
                                    links={posts.links}
                                    currentPage={posts.current_page}
                                    setCurrentPage={(page) => setData('page', page)}
                                />
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
