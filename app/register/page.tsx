
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
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
            aria-disabled={pending}
        >
            {pending ? 'Creating account...' : 'Create account'}
        </button>
    );
}

export default function RegisterPage() {
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    async function handleSubmit(formData: FormData) {
        const result = await register(formData);
        if (result?.error) {
            setError(result.error);
        } else {
            router.push('/'); // Redirect to home on success
        }
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-24">
            <div className="w-full max-w-md space-y-8 glass-panel p-8 border border-white/10 rounded-xl">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-white">
                        Create your account
                    </h2>
                    <p className="mt-2 text-center text-sm text-slate-400">
                        Already have an account?{' '}
                        <Link href="/login" className="font-medium text-emerald-400 hover:text-emerald-300">
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
                                className="relative block w-full rounded-t-md border-0 bg-white/5 py-1.5 text-white ring-1 ring-inset ring-white/10 placeholder:text-slate-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-emerald-500 sm:text-sm sm:leading-6 px-3"
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
                                className="relative block w-full rounded-b-md border-0 bg-white/5 py-1.5 text-white ring-1 ring-inset ring-white/10 placeholder:text-slate-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-emerald-500 sm:text-sm sm:leading-6 px-3"
                                placeholder="Password (min 6 chars)"
                            />
                        </div>
                    </div>

                    <div>
                        <RegisterButton />
                    </div>
                </form>
            </div>
        </div>
    );
}
