import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => (
    <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
        <Toaster position="top-right" toastOptions={{
            style: {
                borderRadius: '10px',
                background: 'rgba(44, 53, 57, 0.2)',
                color: '#fff',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(200, 200, 200, 0.2)',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)'
            }
        }} />
        {children}
    </AppLayoutTemplate>
);
