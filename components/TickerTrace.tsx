'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function TickerTrace() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [ticker, setTicker] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!ticker) return;
        setLoading(true);
        const currentTab = searchParams.get('tab') || 'stocks';
        router.push(`/?tab=${currentTab}&ticker=${ticker}`);
        setLoading(false);
    };

    return (
        <div className="w-full max-w-xl mx-auto mb-10">
            <form onSubmit={handleSubmit} className="flex gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                    <Input
                        placeholder="Search Ticker (e.g. AAPL)..."
                        value={ticker}
                        onChange={(e) => setTicker(e.target.value.toUpperCase())}
                        className="pl-10 h-12 bg-slate-900/50 border-slate-700 backdrop-blur text-lg"
                    />
                </div>
                <Button
                    type="submit"
                    disabled={loading}
                    size="lg"
                    className="h-12 px-8 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                >
                    {loading ? 'Analyzing...' : 'Analyze'}
                </Button>
            </form>
        </div>
    );
}
