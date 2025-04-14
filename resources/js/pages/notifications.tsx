import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import toast from 'react-hot-toast';

dayjs.extend(relativeTime);

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Notifications', href: '/notifications' },
];
type Notification = {
    id: number;
    notification: string;
    created_at: string;
    user_id: number;
};

export default function Notifications() {
    const [notification, setNotification] = useState<Notification[]>([]);

    const fetchnotifications = () => {
        try {
            axios.post(route('notifications.api')).then((response) => {
                let data = response.data.notifications;
                console.log(data);
                setNotification(data);
            });

        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    useEffect(() => {
        fetchnotifications();
        const interval = setInterval(() => {
            fetchnotifications();
        }, 25000);
        return () => clearInterval(interval);
    }, []);

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
            axios.post(route('notifications.all', id)).then(() => {
                setNotification([]);
                toast.success('All Notifications Cleared');
            });
        } catch (error) {
            console.log(error);
            toast.error('Failed to delete notification.');
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Notifications" />
            <div className="flex flex-col gap-4 p-4">
                {notification.length > 1 && (
                    <div className="flex justify-end mt-2">
                        <Button
                            type="submit"
                            className="w-20 cursor-pointer"
                            onClick={() => closeAllNotification(notification[0].user_id)}
                        >
                            Clear All
                        </Button>
                    </div>
                )}

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
