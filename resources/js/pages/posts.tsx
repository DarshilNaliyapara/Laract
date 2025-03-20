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
import { Card, CardContent } from "@/components/ui/card";
import { Pencil, Trash2, MessageCircle } from "lucide-react";
import { router } from '@inertiajs/react';
import Swal from "sweetalert2";
import { Link } from '@inertiajs/react';
import { type SharedData } from '@/types';
import Comments from '@/components/comment';

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
  title: string;
  posts: string;
  photo_name: string;
  created_at: string;
  updated_at: string;
  user: {
    name: string;
    id: number;
  };
  slug: string;
  liked: boolean;
  likeCount: number;
  comments: string;
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
  const { auth } = usePage<SharedData>().props;
  const [commentingPost, setCommentingPost] = useState<number | null>(null);

  const formattedPosts = Array.isArray(posts.data) ? posts.data : [];

  // const formattedPosts = Array.isArray(posts.data) ? posts.data : [];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setData('file', file);
    }
  };
  const like = (slug: string) => {
    router.post(route('blogs.like', slug));
  }
  const dislike = (slug: string) => {
    router.post(route('blogs.dislike', slug));
  }
  const wordLimit = 20;

  const getExcerpt = (text: string) => {
    if (!text) return "";
    const words = text.split(" ");
    let truncatedText = text;

    // Convert URLs into clickable links
    truncatedText = truncatedText
      .replace(/\n/g, "<br>")
      .replace(
        /(https?:\/\/[^\s<]+)/g,
        '<a href="$1" class="text-blue-500 underline" target="_blank" rel="noopener noreferrer">$1</a>'
      );

    return truncatedText;
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

            _method: 'delete',

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
            const postContent = JSON.parse(post.posts);
            const formattedComments = Array.isArray(post.comments) ? post.comments : [];

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
                        <span className="text-gray-600 dark:text-gray-400">{post.likeCount}</span>
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
                          {postContent.title}
                        </h2>
                      </Link>
                      {/* Post Image */}
                      {post.photo_name && (
                        <div className="flex flex-wrap gap-4 mt-3">
                          <div className="relative w-full md:w-1/2 lg:w-1/3">

                            <img
                              src={`/storage/${post.photo_name}`}
                              alt="Blog Preview"
                              className="cursor-pointer rounded-lg shadow-lg object-cover w-full h-full"
                            />
                          </div>
                        </div>
                      )}

                      <p
                        className="postContent text-base text-gray-700 mt-2 dark:text-gray-300"
                        dangerouslySetInnerHTML={{
                          __html: getExcerpt(postContent.post),
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
                          Comments
                        </Button>
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
