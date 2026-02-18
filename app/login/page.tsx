
'use client';

import { authenticate } from '@/app/actions/auth';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import Link from 'next/link';

function LoginButton() {
    const { pending } = useFormStatus();

    return (
        <button
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 relative z-10"
            aria-disabled={pending}
        >
            {pending ? 'Logging in...' : 'Log in'}
        </button>
    );
}

export default function LoginPage() {
    const [errorMessage, dispatch] = useActionState(authenticate, undefined);

    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-6 sm:p-24">
            <div className="w-full max-w-md space-y-8 glass-panel p-8 border border-white/10 rounded-xl relative z-0">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-white">
                        Sign in to your account
                    </h2>
                    <p className="mt-2 text-center text-sm text-slate-400">
                        Or{' '}
                        <Link href="/register" className="font-medium text-emerald-400 hover:text-emerald-300 relative z-10">
                            create a new account
                        </Link>
                    </p>
                </div>
                <form action={dispatch} className="mt-8 space-y-6">
                    {errorMessage && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2 rounded text-sm text-center">
                            {errorMessage}
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
                                className="relative block w-full rounded-t-md border-0 bg-white/5 py-2 text-white ring-1 ring-inset ring-white/10 placeholder:text-slate-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-emerald-500 sm:text-sm sm:leading-6 px-3"
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
                                autoComplete="current-password"
                                required
                                className="relative block w-full rounded-b-md border-0 bg-white/5 py-2 text-white ring-1 ring-inset ring-white/10 placeholder:text-slate-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-emerald-500 sm:text-sm sm:leading-6 px-3"
                                placeholder="Password"
                            />
                        </div>
                    </div>

                    <div className="pt-2">
                        <LoginButton />
                    </div>
                </form>
            </div>
        </div>
    );
}
