import AuthLayoutTemplate from '@/layouts/auth/auth-card-layout';
import { Toaster } from 'react-hot-toast';
export default function AuthLayout({ children, title, description, ...props }: { children: React.ReactNode; title: string; description: string }) {
    return (
        <AuthLayoutTemplate title={title} description={description} {...props}>
            <Toaster position="top-center" toastOptions={{
                style: {
                    borderRadius: '10px',
                    background: 'rgba(44, 53, 57, 0.2)',
                    color: '#fff',
                    backdropFilter: 'blur(30px)',
                    border: '1px solid rgba(200, 200, 200, 0.2)',
                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)'
                }
            }} />
            {children}
        </AuthLayoutTemplate>
    );
}
