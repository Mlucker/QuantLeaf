'use client';

import { useWatchlist } from '@/hooks/useWatchlist';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Trash2 } from 'lucide-react';

export default function WatchlistView() {
    const { watchlist, removeFromWatchlist, isLoaded } = useWatchlist();

    if (!isLoaded) return null;

    if (watchlist.length === 0) {
        return (
            <Card className="glass-panel border-white/10 mt-8">
                <CardContent className="py-10 text-center">
                    <p className="text-slate-400 mb-2">Your watchlist is empty.</p>
                    <p className="text-sm text-slate-500">Search for a ticker and click the star icon to save it.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="glass-panel border-white/10 mt-8">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-white text-lg">Your Watchlist</CardTitle>
                {watchlist.length > 1 && (
                    <Link
                        href={`/compare?q=${watchlist.join(',')}`}
                        className="text-xs bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1"
                    >
                        Compare All <ArrowRight size={14} />
                    </Link>
                )}
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {watchlist.map((symbol) => (
                        <div key={symbol} className="group relative flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/5 hover:border-emerald-500/50 transition-all">
                            <Link href={`/?q=${symbol}`} className="flex-1">
                                <span className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                                    {symbol}
                                </span>
                            </Link>

                            <div className="flex items-center gap-2">
                                <Link
                                    href={`/?q=${symbol}`}
                                    className="p-2 rounded-full text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                                    title="Analyze"
                                >
                                    <ArrowRight size={18} />
                                </Link>
                                <button
                                    onClick={() => removeFromWatchlist(symbol)}
                                    className="p-2 rounded-full text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                                    title="Remove"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
