import AppLogoIcon from './app-logo-icon';
import { Link } from '@inertiajs/react';

interface AppLogoProps {
    path: string;
}

export default function AppLogo({ path }: AppLogoProps) {
    return (
        <>
            <Link href={path} prefetch>
                <div className='flex items-center'>
                    <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-md">
                        <AppLogoIcon className="size-5 fill-current text-white dark:text-black" />
                    </div>
                    <div className="ml-2 grid flex-1 text-left text-sm">
                        <span className="mb-0.5 truncate leading-none dark:text-white test-black font-semibold">Laract</span>
                    </div>
                </div>

            </Link>
        </>
    );
}
