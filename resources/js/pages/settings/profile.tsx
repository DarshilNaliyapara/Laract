import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useState, useEffect } from 'react';

import DeleteUser from '@/components/delete-user';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { router } from '@inertiajs/react';
import SettingsLayout from '@/layouts/settings/layout';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profile settings',
        href: '/settings/profile',
    },
];

interface ProfileForm {
    name: string;
    email: string;
    avatar: File | null;
}

export default function Profile({ mustVerifyEmail, status }: { mustVerifyEmail: boolean; status?: string }) {
    const { auth } = usePage<SharedData>().props;
    const [filepreview, setImagepreview] = useState<string | null>(null);
    const [name, setName] = useState<string>(auth.user.name);
    const [email, setEmail] = useState<string>(auth.user.email);
    const [avatar, setImage] = useState<File | null>(null);
    const [processing, setProcessing] = useState(false);
    const { errors } = usePage().props;
    const [recentlySuccessful, setRecentlySuccessful] = useState(false);

    useEffect(() => {
        if (auth.user.avatar) {
            setImagepreview(`/storage/${auth.user.avatar}`); // Assuming this is a valid URL
        }
    }, [auth.user.avatar]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            setImagepreview(URL.createObjectURL(file));
        }
    };

    const submit: FormEventHandler = async (e) => {
        setProcessing(true);

        const formData = new FormData();
        formData.append('_method', 'patch'); 
        formData.append('name', name);
        formData.append('email', email);

        if (avatar) {
            formData.append('avatar', avatar);
        };
        await router.post(route('profile.update'), formData, {
            onFinish: () => {
                setProcessing(false);
                setRecentlySuccessful(true);
                setTimeout(() => setRecentlySuccessful(false), 3000);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Profile information" description="Update your name and email address" />

                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>

                            <Input
                                id="name"
                                className="mt-1 block w-full"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                autoComplete="name"
                                placeholder="Full name"
                            />

                            <InputError className="mt-2" message={errors.name} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email">Email address</Label>

                            <Input
                                id="email"
                                type="email"
                                className="mt-1 block w-full"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                autoComplete="username"
                                placeholder="Email address"
                            />

                            <InputError className="mt-2" message={errors.email} />
                        </div>

                        {mustVerifyEmail && auth.user.email_verified_at === null && (
                            <div>
                                <p className="text-muted-foreground -mt-4 text-sm">
                                    Your email address is unverified.{' '}
                                    <Link
                                        href={route('verification.send')}
                                        method="post"
                                        as="button"
                                        className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                                    >
                                        Click here to resend the verification email.
                                    </Link>
                                </p>

                                {status === 'verification-link-sent' && (
                                    <div className="mt-2 text-sm font-medium text-green-600">
                                        A new verification link has been sent to your email address.
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="grid gap-2">
                            <Label htmlFor="file">Avatar</Label>
                            <input
                                id="file"
                                type="file"
                                onChange={handleFileChange}
                                name="avatar" accept=".jpg,.png,.jpeg"
                                data-toggle="tooltip" title="Choose Image file Less then 5Mb"
                                className="block file:cursor-pointer file:mr-4 file:rounded-full file:border-0 file:bg-gray-500 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-gray-300 hover:file:bg-gray-700 dark:file:bg-gray-600 dark:file:text-black-900 dark:hover:file:bg-gray-700 ..."
                            />
                            <InputError message={errors.avatar} />
                        </div>
                        {filepreview &&
                            <div className="flex flex-wrap gap-4 mt-3">
                                <div className="relative  md:w-1/2 lg:w-1/3 flex items-start">
                                    <div className=" flex overflow-hidden rounded-lg">
                                        <img
                                            src={filepreview}
                                            alt="Blog Preview"
                                            className="cursor-pointer rounded-lg shadow-lg  max-h-96 object-contain"
                                        />
                                    </div>
                                </div>
                            </div>
                        }
                        <div className="flex items-center gap-4">
                            <Button disabled={processing}>Save</Button>

                            <Transition
                                show={recentlySuccessful}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <p className="text-sm text-neutral-600">Saved</p>
                            </Transition>
                        </div>
                    </form>
                </div>

                <DeleteUser />
            </SettingsLayout>
        </AppLayout>
    );
}
