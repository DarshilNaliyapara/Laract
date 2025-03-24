import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useState } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Pagination from '@/components/paginate';
import { Label } from '@/components/ui/label';
import Swal from "sweetalert2";
import { Link } from '@inertiajs/react';
import Post from '@/components/post';


const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Posts',
    href: '/posts',
  },
];

type PostForm = {
  title: string;
  post: string;
  file: File | null;
  page: number;
};

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

export default function Posts({ posts }: { posts: PostsData }) {
  const { data, setData, post, processing, errors, reset } = useForm<Required<PostForm>>({
    title: '',
    post: '',
    file: null,
    page: posts.current_page
  });

  const [filepreview, setImagepreview] = useState<string | null>(null);
  const formattedPosts = Array.isArray(posts.data) ? posts.data : [];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setData('file', file);
      setImagepreview(URL.createObjectURL(file));
    }
  };

  const submit: FormEventHandler = async (e) => {
    try {
      e.preventDefault();
      await post(route('blogs.store'), {
        onSuccess: () => Swal.fire({
          position: "center",
          icon: "success",
          title: "Post Created Successfully!",
          showConfirmButton: false,
          timer: 1500
        })
      });
    } catch (error) {
      console.log(error)
      Swal.fire({
        title: "Error",
        text: (error as any).response?.data?.message || "Something went wrong!",
        icon: "error",
      });
    }

  };

  const [commentingPost, setCommentingPost] = useState<number | null>(null);

  const toggleComment = (postId: number) => {
    setCommentingPost(commentingPost === postId ? null : postId);
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
                  value={data.title}
                  onChange={(e) => setData('title', e.target.value)}
                  disabled={processing}
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
                  value={data.post}
                  onChange={(e) => setData('post', e.target.value)}
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
                  name="file" accept=".jpg,.png,.jpeg"
                  data-toggle="tooltip" title="Choose Image file Less then 5Mb"
                  className="block file:cursor-pointer file:mr-4 file:rounded-full file:border-0 file:bg-gray-500 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-gray-300 hover:file:bg-gray-700 dark:file:bg-gray-600 dark:file:text-black-900 dark:hover:file:bg-gray-700 ..."
                />
                <InputError message={errors.file} />
              </div>
              {filepreview &&
                <div className="flex flex-wrap gap-4 mt-3">
                  <div className="relative  md:w-1/2 lg:w-1/3 flex items-start">
                    <div className=" flex overflow-hidden rounded-lg">
                      <img
                        src={filepreview}
                        alt="Blog Preview"
                        className="cursor-pointer rounded-lg shadow-lg  max-h-96 object-contain"
                      />
                    </div>
                  </div>
                </div>
              }

              <Button type="submit" className="mt-2 w-20 cursor-pointer" tabIndex={5} disabled={processing}>
                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                Post
              </Button>
            </div>
          </form>
        </div>
        <hr />
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
            currentPage={posts.current_page}
            setCurrentPage={(page) => setData('page', page)} />
        }
      </div>
    </AppLayout>
  );
}
