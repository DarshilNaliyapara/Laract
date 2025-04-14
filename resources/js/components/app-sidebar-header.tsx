import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { Input } from './ui/input';
import { useState } from "react";
import { Link, router } from '@inertiajs/react';
import { SearchIcon } from 'lucide-react';
import { Button } from './ui/button';

export function AppSidebarHeader({ breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItemType[] }) {
    const [searchText, setSearchText] = useState("");

    const searchblog = () => {
        if (route().current('home')) {
            router.get(route('home'), {
                search: searchText,
            })
        } else {
            router.get(route('likedposts'), {
                search: searchText,
            })
        }
    }
    return (
        <header className="border-sidebar-border/50 flex h-16 shrink-0 items-center gap-2 border-b px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4 justify-between">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>

            {(route().current('home') || route().current('likedposts')) &&
                <div className="relative flex items-center">
                    <Input type="text" name="search" id='search' placeholder="Search..." onChange={(e) => setSearchText(e.target.value)} onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            searchblog();
                        }
                    }} className="pl-10 pr-3 py-2 border rounded-md" />
                    <SearchIcon type='button' onClick={searchblog} className="absolute left-3 text-gray-500 cursor-pointer" />
                </div>
            }
            {route().current('posts') &&
               <Link href={route('likedposts')}>
               <Button
                   variant="outline"
                   size="sm"
                   className="group"
               >
                   <svg
                       xmlns="http://www.w3.org/2000/svg"
                       fill="none"
                       viewBox="0 0 24 24"
                       strokeWidth={1.5}
                       stroke="currentColor"
                       className="w-6 h-6 text-gray-600 dark:text-gray-400 cursor-pointer group-hover:fill-gray-400"
                   >
                       <path
                           strokeLinecap="round"
                           strokeLinejoin="round"
                           d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                       />
                   </svg>
                   Liked Posts
               </Button>
           </Link>
           
            }

        </header>
    );

}
