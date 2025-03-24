import { useState, useMemo } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Trash2, Edit3, EyeIcon } from 'lucide-react';
import { AgGridReact } from 'ag-grid-react';
import {
    AllCommunityModule,
    ColDef,
    ColGroupDef,
    GridOptions,
    ModuleRegistry,
    Theme,
    createGrid,
    themeQuartz,
} from 'ag-grid-community';
import Comments from '@/components/comment';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import { router } from '@inertiajs/react';

ModuleRegistry.registerModules([AllCommunityModule]);

const myTheme = themeQuartz.withParams({
    backgroundColor: "#1f2836",
    browserColorScheme: "dark",
    chromeBackgroundColor: {
        ref: "foregroundColor",
        mix: 0.07,
        onto: "backgroundColor"
    },
    foregroundColor: "#FFF",
    headerFontSize: 14
});

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
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
    comments_count: number;
}


export default function Dashboard({ posts }: { posts: Post[] }) {

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

                router.post(route('blogs.destroy', slug), {
                    _method: 'delete',

                }, {
                    onSuccess: () => toast.success('Post Deleted Successfully', {
                      style: {
                        borderRadius: '10px',
                        background: 'rgba(1, 1, 1, 0.3)', 
                        color: '#fff',
                        backdropFilter: 'blur(30px)', 
                        border: '1px solid rgba(200, 200, 200, 0.2)', 
                        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)' 
                    },
                    }),
                    onError: () => toast.error('Failed to Deleted Post', {
                      style: {
                        borderRadius: '10px',
                        background: 'rgba(1, 1, 1, 0.3)', 
                        color: '#fff',
                        backdropFilter: 'blur(30px)', 
                        border: '1px solid rgba(200, 200, 200, 0.2)', 
                        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)' 
                    },
                    }),
                    preserveScroll: true
                });
            }
        })
    };

    const columnDefs: ColDef[] = [
        { headerName: 'Id', field: 'id', sortable: true, filter: true, flex: 2 },
        { headerName: 'Title', field: 'title', sortable: true, filter: true },
        { headerName: 'Body', field: 'body', sortable: true, filter: true, flex: 4 },
        { headerName: 'Likes', field: 'likes', sortable: true, filter: true, flex: 2 },
        { headerName: 'Comments', field: 'comments', sortable: true, filter: true, flex: 3 },
        {
            headerName: 'Action',
            field: 'action',
            cellRenderer: (params: { data: Post, value: string }) => {

                return (
                    <div className="flex gap-2 mt-2">
                        <Link href={route('blogs.adminshow', params.value)}>
                            <EyeIcon />
                        </Link>
                        <Link href={route('blogs.edit', params.value)}>
                            <Edit3 />
                        </Link>
                        <form id="dlt-form" onSubmit={(e) => {
                            e.preventDefault();
                            deleteblog(params.value);
                        }}>
                            <a
                                type='button'
                                onClick={() => deleteblog(params.value)}
                            >
                                <Trash2 />
                            </a>
                        </form>
                    </div>
                );
            },
            flex: 3
        }
    ];

    const rowData = posts.map((post) => {
        return {
            id: post.id,
            title: post.posts.title,
            body: post.posts.post,
            likes: post.likes_count,
            comments: post.comments_count,
            action: post.slug,
        };
    });

    const theme = useMemo<Theme | "legacy">(() => {
        return myTheme;
    }, []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex flex-col gap-4 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border rounded-xl border p-4">
                    <h1 className="text-center text-xl">Posts and Engagements</h1>
                </div>

                <div className=" border-sidebar-border/70 dark:border-sidebar-border rounded-xl border p-4">
                    <AgGridReact
                        key={JSON.stringify(posts)}
                        rowData={rowData}
                        columnDefs={columnDefs}
                        domLayout="autoHeight"
                        pagination={true}
                        paginationPageSizeSelector={[10, 20, 50, 100]}
                        paginationPageSize={10}
                        theme={theme}
                    />
                </div>

            </div>
        </AppLayout>
    );
}
