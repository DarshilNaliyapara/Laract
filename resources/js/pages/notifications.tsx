import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import toast from 'react-hot-toast';


dayjs.extend(relativeTime);

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Notifications', href: '/notifications' },
];

export default function Notifications({ notifications }: { notifications: { id: number; notification: string; created_at: string; user_id: number }[] }) {
    const [notification, setNotification] = useState(notifications);
console.log(notifications);

    const closeNotification = (id: number) => {
        try {
            axios.post(route('notifications.destroy', id)).then(() => {
                setNotification((prevNotifications) =>
                    prevNotifications.filter((notification) => notification.id !== id)
                );
                toast.success('Cleared');
            });

        } catch (error) {
            toast.error('Failed to delete notification.');
        }
    };

    const closeAllNotification = (id: number) => {
        try {
            axios.post(route('Allnotifications.destroy', id)).then(() => {
                setNotification((prevNotifications) =>
                    prevNotifications.filter((notification) => notification.id !== id)
                );
                toast.success('All Notifications Cleared');
            });

        } catch (error) {
            toast.error('Failed to delete notification.');
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Notifications" />
            <div className="flex flex-col gap-4 p-4">
                {notification.map((notification) => (
                    <Button type="submit" className="mt-2 w-20 cursor-pointer justify-end" onClick={() => closeAllNotification(notification.user_id)}>
                        Clear All </Button>
                ))}
                {notification.map((notification) => (
                    <div key={notification.id} className="w-full rounded-xl border-2 shadow-lg overflow-hidden relative">
                        <button
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 cursor-pointer"
                            onClick={() => closeNotification(notification.id)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                        </button>
                        <div className="p-3">
                            <div className="flex flex-col m-1">
                                <span className="text-sm text-gray-400 dark:text-gray-500">

                                    {dayjs(notification.created_at).fromNow()}
                                </span>
                                <div className="flex justify-between">

                                    <span>{notification.notification}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                {notification.length === 0 && <p className="text-center text-gray-500">No notifications</p>}
            </div>
        </AppLayout>
    );
}
