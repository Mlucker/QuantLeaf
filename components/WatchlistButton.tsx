'use client';

import { useWatchlist } from '@/hooks/useWatchlist';
import { Star } from 'lucide-react';

interface WatchlistButtonProps {
    symbol: string;
    className?: string;
}

export default function WatchlistButton({ symbol, className = "" }: WatchlistButtonProps) {
    const { isInWatchlist, addToWatchlist, removeFromWatchlist, isLoaded } = useWatchlist();

    if (!isLoaded) return <div className="w-8 h-8" />; // Placeholder to avoid flicker

    const inList = isInWatchlist(symbol);

    const toggle = () => {
        if (inList) {
            removeFromWatchlist(symbol);
        } else {
            addToWatchlist(symbol);
        }
    };

    return (
        <button
            onClick={toggle}
            className={`p-2 rounded-full transition-all hover:bg-white/10 ${inList ? 'text-yellow-400' : 'text-slate-500 hover:text-yellow-200'} ${className}`}
            title={inList ? "Remove from Watchlist" : "Add to Watchlist"}
        >
            <Star
                size={24}
                fill={inList ? "currentColor" : "none"}
                strokeWidth={inList ? 0 : 2}
            />
        </button>
    );
}
