import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import {Input} from '@/components/ui/input'
import { useState } from "react";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Posts',
        href: '/dashboard',
    },
];



export default function BlogPostForm({ initialValues = {} }) {
  const [formData, setFormData] = useState({
    title: initialValues || "",
    post: initialValues || "",
    file: null,
  });
  const [errors, setErrors] = useState({});

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleFileChange = (e) => {
//     setFormData((prev) => ({ ...prev, file: e.target.files[0] }));
//   };

  const validate = () => {
    let tempErrors = {};
    // if (!formData.title.trim()) tempErrors.title = "Title is required.";
    // if (!formData.post.trim()) tempErrors.post = "Post content is required.";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!validate()) return;
    
//   };

    return (
          <AppLayout breadcrumbs={breadcrumbs}>
                    <Head title="Home" />
        <form className="space-y-4">
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              name="title"
            //   value={formData.title}
            //   onChange={handleChange}
              className="w-full dark:bg-gray-900 dark:text-gray-200 border border-gray-700 rounded-lg p-2"
            />
            {/* {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>} */}
          </div>
    
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-1">Post</label>
            <textarea
              name="post"
              
            //   onChange={handleChange}
              className="w-full h-32 border border-gray-700 bg-gray-800 text-gray-200 rounded-lg p-3"
            ></textarea>
            {errors && <p className="text-red-500 text-sm mt-1"></p>}
          </div>
    
          { (
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-1">Image</label>
              <input
                type="file"
                accept=".jpg,.png,.jpeg"
                // onChange={handleFileChange}
                className="block file:mr-4 file:rounded-full file:border-0 file:bg-violet-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-violet-700 hover:file:bg-violet-100"
              />
            </div>
          )}
    
          <button
            type="submit"
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500"
          >
            
          </button>
    
          {  (
            <a
              href="/blogs"
              className="ml-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-500"
            >
              Cancel
            </a>
          )}
        </form>
        </AppLayout>
      );
}
