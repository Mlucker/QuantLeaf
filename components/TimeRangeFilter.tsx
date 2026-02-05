'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export default function TimeRangeFilter() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentRange = searchParams.get('range') || '1y';

    const handleRangeChange = (range: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('range', range);
        router.push(`?${params.toString()}`);
    };

    return (
        <div className="flex bg-slate-900/50 rounded-lg p-1 border border-white/5 space-x-1">
            {['1y', '5y'].map((range) => (
                <button
                    key={range}
                    onClick={() => handleRangeChange(range)}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${currentRange === range
                        ? 'bg-slate-700 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                        }`}
                >
                    {range.toUpperCase()}
                </button>
            ))}
        </div>
    );
}
