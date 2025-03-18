// Components
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

type OtpVerify = {
    otp: string;
};
export default function VerifyEmail({ status }: { status?: string }) {
    const { data, setData, post, processing, errors, reset } = useForm<Required<OtpVerify>>({
        otp: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('verification.send'));
    };
   
       const submitotp: FormEventHandler = (e) => {
           e.preventDefault();
           post(route('verification.verify.otp'));
       };

    return (
        <AuthLayout title="Verify email" description="Please verify your email address by clicking on the link we just emailed to you.">
            <Head title="Email verification" />

            {status === 'verification-link-sent' && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    A new verification link has been sent to the email address you provided during registration.
                </div>
            )}
           <form className="flex flex-col gap-6 text-center" onSubmit={submitotp}>
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        
                        <Input
                            id="otp"
                            type="text"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="otp"
                            value={data.otp}
                            onChange={(e) => setData('otp', e.target.value)}
                            disabled={processing}
                            placeholder="OTP"
                        />
                        <InputError message={errors.otp} className="mt-2" />
                    </div>

                    <Button type="submit" className="mb-2"  disabled={processing}>
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        Verify Email
                    </Button>
                </div>

            </form>
            <form onSubmit={submit} className="space-y-6 text-center">

                <Button disabled={processing} variant="secondary" className="w-full">
                    {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                    Resend verification email
                </Button>

                <TextLink href={route('logout')} method="post" className="mx-auto block text-sm">
                    Log out
                </TextLink>
            </form>
        </AuthLayout>
    );
}
