
'use client';

import { register } from '@/app/actions/auth';
import { useFormStatus } from 'react-dom';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

function RegisterButton() {
    const { pending } = useFormStatus();

    return (
        <button
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 relative z-10"
            aria-disabled={pending}
        >
            {pending ? 'Creating account...' : 'Create account'}
        </button>
    );
}

export default function RegisterPage() {
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    async function handleSubmit(formData: FormData) {
        const result = await register(formData);
        if (result?.error) {
            setError(result.error);
        } else {
            setSuccess(true);
            // Optional: Auto redirect after few seconds
            // setTimeout(() => router.push('/'), 3000); 
        }
    }

    if (success) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center p-6 sm:p-24">
                <div className="w-full max-w-md space-y-8 glass-panel p-8 border border-white/10 rounded-xl text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20">
                        <svg className="h-8 w-8 text-emerald-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="mt-4 text-3xl font-bold tracking-tight text-white">Account Created!</h2>
                        <p className="mt-2 text-sm text-slate-400">
                            Your account has been successfully registered.
                        </p>
                    </div>
                    <div className="mt-6">
                        <Link
                            href="/"
                            className="inline-flex w-full items-center justify-center rounded-lg bg-emerald-500 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-900"
                        >
                            Continue to Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-6 sm:p-24">
            <div className="w-full max-w-md space-y-8 glass-panel p-8 border border-white/10 rounded-xl relative z-0">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-white">
                        Create your account
                    </h2>
                    <p className="mt-2 text-center text-sm text-slate-400">
                        Already have an account?{' '}
                        <Link href="/login" className="font-medium text-emerald-400 hover:text-emerald-300 relative z-10">
                            Sign in
                        </Link>
                    </p>
                </div>
                <form action={handleSubmit} className="mt-8 space-y-6">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2 rounded text-sm text-center">
                            {error}
                        </div>
                    )}
                    <div className="-space-y-px rounded-md shadow-sm">
                        <div>
                            <label htmlFor="email" className="sr-only">
                                Email address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="relative block w-full rounded-t-lg border-0 bg-white/5 py-2 text-white ring-1 ring-inset ring-white/10 placeholder:text-slate-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-emerald-500 sm:text-sm sm:leading-6 px-3"
                                placeholder="Email address"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                required
                                className="relative block w-full rounded-b-lg border-0 bg-white/5 py-2 text-white ring-1 ring-inset ring-white/10 placeholder:text-slate-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-emerald-500 sm:text-sm sm:leading-6 px-3"
                                placeholder="Password (min 6 chars)"
                            />
                        </div>
                    </div>

                    <div className="pt-2">
                        <RegisterButton />
                    </div>
                </form>
            </div>
        </div>
    );
}
