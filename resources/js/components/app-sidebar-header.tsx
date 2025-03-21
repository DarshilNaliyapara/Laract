import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { Input } from './ui/input';
import { useState } from "react";
import { router } from '@inertiajs/react';
import { SearchIcon } from 'lucide-react';

export function AppSidebarHeader({ breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItemType[] }) {
    const [searchText, setSearchText] = useState("");
    console.log(searchText);
    const searchblog = () => {
        router.get(route('home'), {
            search: searchText,
        })
    }
    return (
        <header className="border-sidebar-border/50 flex h-16 shrink-0 items-center gap-2 border-b px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4 justify-between">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>
            {route().current('home') &&
                <div className="relative flex items-center">
                    <Input type="text" name="search" id='search' placeholder="Search..." onChange={(e) => setSearchText(e.target.value)} onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            searchblog();
                        }
                    }} className="pl-10 pr-3 py-2 border rounded-md" />
                    <SearchIcon type='button' onClick={searchblog} className="absolute left-3 text-gray-500 cursor-pointer" />
                </div>
            }

        </header>
    );

}
