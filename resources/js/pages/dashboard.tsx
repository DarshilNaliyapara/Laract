import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useEffect, useRef } from "react";



const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex flex-col gap-4 rounded-xl p-4">

                <div className="border-sidebar-border/70 dark:border-sidebar-border relative overflow-hidden rounded-xl border p-4">
                    <h1 className="text-center text-xl">Users and Permission</h1>
                    <h1 className="text-center text-xl text-green-700">Create Roles</h1>
                </div>

                <div className="border-sidebar-border/70 dark:border-sidebar-border relative overflow-hidden rounded-xl border p-4">
                    
                </div>

            </div>
        </AppLayout>
    );
}
