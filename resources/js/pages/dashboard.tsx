import { useState, useMemo } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
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
        post:string;
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
    console.log(posts);
    const [selectedPost, setSelectedPost] = useState(null);
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
                // const postData = JSON.parse(params.data.posts); // Parse JSON string into object
                console.log(params.data.id);
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
                                <Trash2  />
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
    const defaultColDef = useMemo<ColDef>(() => {
        return {
            editable: true,
            flex: 1,
            minWidth: 100,
            filter: true,
        };
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
                        key={JSON.stringify(posts)} // Forces a re-render when posts change
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
