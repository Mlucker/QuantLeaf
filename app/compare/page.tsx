import { Suspense } from 'react';
import { compareTickers } from '@/app/actions/getComparison';
import ComparisonTable from '@/components/ComparisonTable';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function ComparePage({
    searchParams
}: {
    searchParams: Promise<{ q?: string }>
}) {
    const { q } = await searchParams;
    const tickers = q ? q.split(',').filter(t => t.trim().length > 0) : [];

    const data = await compareTickers(tickers);

    return (
        <main className="min-h-screen bg-slate-950 text-white p-6">
            <div className="max-w-7xl mx-auto">
                <header className="mb-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-300">
                            <ArrowLeft size={20} />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Comparison</h1>
                            <p className="text-slate-400 text-sm">Side-by-side deterministic analysis</p>
                        </div>
                    </div>
                </header>

                <Suspense fallback={<div className="text-slate-400 text-center mt-20">Running parallel analysis...</div>}>
                    {tickers.length < 2 ? (
                        <div className="text-center mt-20">
                            <h2 className="text-xl font-medium text-slate-300 mb-2">Not enough tickers to compare</h2>
                            <p className="text-slate-500">Add at least 2 tickers separated by commas in the URL (e.g., ?q=AAPL,MSFT)</p>
                        </div>
                    ) : (
                        <ComparisonTable data={data} />
                    )}
                </Suspense>
            </div>
        </main>
    );
}
