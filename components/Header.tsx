
import Link from 'next/link';
import { auth, signOut } from '@/auth';

export default async function Header() {
    const session = await auth();

    return (
        <header className="mb-10 relative">
            <div className="absolute right-0 top-0">
                {session?.user ? (
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-slate-400 hidden sm:inline">
                            {session.user?.email}
                        </span>
                        <form
                            action={async () => {
                                'use server';
                                await signOut({ redirectTo: '/' });
                            }}
                        >
                            <button className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors">
                                Sign Out
                            </button>
                        </form>
                    </div>
                ) : (
                    <Link href="/login" className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors">
                        Login
                    </Link>
                )}
            </div>

            <div className="text-center">
                <Link href="/">
                    <h1 className="text-4xl font-bold tracking-tight text-emerald-500 mb-2 hover:opacity-90 transition-opacity">QuantLeaf</h1>
                </Link>
                <p className="text-slate-400">Deterministic Fundamental Analysis</p>
            </div>
        </header>
    );
}
