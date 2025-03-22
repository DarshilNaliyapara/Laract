import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useState } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { router, Link } from '@inertiajs/react';
import { useEffect } from 'react';
import Swal from "sweetalert2";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Post Edit',
        href: '/posts',
    },
];
type PosteditForm = {
    title: string;
    post: string;
    file: File | null;

};


interface Link {
    url: string;
    label: string;
    active: boolean;
}

interface Blog {
    id: number;
    posts: {
        title: string;
        post: string;
    };
    photo_name: string;
    slug: string;
}


export default function PostEdit({ blog }: { blog: Blog }) {
    const [title, setTitle] = useState<string>(blog.posts.title);
    const [post, setPost] = useState<string>(blog.posts.post);
    const [file, setImage] = useState<File | null>(null);
    const [filepreview, setImagepreview] = useState<string | null>(null);
    const [processing, setProcessing] = useState(false);
    const { errors } = usePage().props;

    useEffect(() => {
        if (blog.photo_name) {
            setImagepreview(`/storage/${blog.photo_name}`); // Assuming this is a valid URL
        }
    }, [blog.photo_name]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            setImagepreview(URL.createObjectURL(file));
        }
    };

    const submit: FormEventHandler = async (e) => {
        try {
            e.preventDefault();
            setProcessing(true); // Start processing state

            const formData = new FormData();
            formData.append('_method', 'put'); // Inertia uses _method for PUT requests
            formData.append('title', title);
            formData.append('post', post);

            if (file) {
                formData.append('file', file);
            }
            await router.post(route('blogs.update', blog.slug), formData, {
                onFinish: () => setProcessing(false),
                onSuccess: () => Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Post Updated Successfully!",
                    showConfirmButton: false,
                    timer: 1500
                })
            });

        } catch (error) {
            Swal.fire({
                title: "Error",
                text: (error as any).response?.data?.message || "Something went wrong!",
                icon: "error",
            });
        }

    };


    return (

        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Posts" />

            <div className="flex h-auto flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative overflow-hidden rounded-xl border p-4">
                    <form className="flex flex-col gap-6" onSubmit={submit}>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="post">Title</Label>
                                <Input
                                    id="title"
                                    type="text"
                                    // required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="title"
                                    value={title}
                                    disabled={processing}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Title of your post"
                                />
                                <InputError message={errors.title} className="mt-2" />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="post">Post</Label>
                                <textarea
                                    id="post"
                                    // required
                                    className='border-textarea h-20 file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm'
                                    tabIndex={2}
                                    autoComplete="post"
                                    value={post}
                                    onChange={(e) => setPost(e.target.value)}
                                    disabled={processing}
                                    placeholder="Body"
                                />
                                <InputError message={errors.post} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="file">File</Label>
                                <input
                                    id="file"
                                    type="file"
                                    onChange={handleFileChange}
                                    disabled={processing}
                                    name="file" accept=".jpg,.png,.jpeg"
                                    data-toggle="tooltip" title="Choose Image file Less then 5Mb"
                                    className="block file:cursor-pointer file:mr-4 file:rounded-full file:border-0 file:bg-gray-500 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-gray-300 hover:file:bg-gray-700 dark:file:bg-gray-600 dark:file:text-black-900 dark:hover:file:bg-gray-700  ..."
                                />
                                <InputError message={errors.file} />
                            </div>
                            {filepreview &&
                                <div className="flex flex-wrap gap-4 mt-3">
                                    <div className="relative  md:w-1/2 lg:w-1/3 flex items-start">
                                        <div className="flex overflow-hidden rounded-lg">
                                            <img
                                                src={filepreview}
                                                alt="Blog Preview"
                                                className="cursor-pointer rounded-lg shadow-lg  max-h-96 object-contain"
                                            />
                                        </div>
                                    </div>
                                </div>
                            }
                            <div className="flex items-center gap-4">
                                <Button type="submit" className="mt-2 w-20 cursor-pointer" disabled={processing}>
                                    {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                    Save
                                </Button>

                                <Link href={route('home')} prefetch>
                                    <Button type="button" className="mt-2 w-20 bg-red-700 text-gray-200 cursor-pointer dark:hover:bg-red-800">
                                        Cancel
                                    </Button>
                                </Link>



                            </div>

                        </div>


                    </form>
                </div>


            </div>

        </AppLayout>
    );
}
