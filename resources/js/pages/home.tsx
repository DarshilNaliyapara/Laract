import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import Pagination from '@/components/paginate';
import { Link } from '@inertiajs/react';
import Post from '@/components/post';
import { useState } from 'react';


const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Home', href: '/home' },
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
    console.log(posts.links);
    const { data, setData } = useForm({
        page: posts.current_page
    });
    console.log(posts.links);
    const [commentingPost, setCommentingPost] = useState<number | null>(null);

    const toggleComment = (postId: number) => {
        setCommentingPost(commentingPost === postId ? null : postId);

    };

    const formattedPosts = Array.isArray(posts.data) ? posts.data : [];
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Home" />
            <div className="flex flex-col gap-4 p-4">
                {formattedPosts.length > 0 ? (
                    formattedPosts.map((post) => {
                        return (
                            <Post key={post.id} post={post} commentingPost={commentingPost}
                                toggleComment={toggleComment} />
                        );
                    })
                ) : (
                    <p className="text-center text-gray-500 dark:text-gray-400">No posts available</p>
                )}

                {formattedPosts.length > 0 &&
                    <Pagination
                        links={posts.links}
                        setCurrentPage={(page) => setData('page', page)} />
                }
             </div>
        </AppLayout>
    );
    
}
