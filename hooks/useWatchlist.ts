'use client';

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'quantleaf_watchlist';

export function useWatchlist() {
    const [watchlist, setWatchlist] = useState<string[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load from storage on mount
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                setWatchlist(JSON.parse(stored));
            } catch (e) {
                console.error("Failed to parse watchlist", e);
            }
        }
        setIsLoaded(true);
    }, []);

    // Save to storage whenever watchlist changes
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(watchlist));
        }
    }, [watchlist, isLoaded]);

    const addToWatchlist = (symbol: string) => {
        const upper = symbol.toUpperCase();
        if (!watchlist.includes(upper)) {
            setWatchlist(prev => [...prev, upper]);
        }
    };

    const removeFromWatchlist = (symbol: string) => {
        const upper = symbol.toUpperCase();
        setWatchlist(prev => prev.filter(t => t !== upper));
    };

    const isInWatchlist = (symbol: string) => {
        return watchlist.includes(symbol.toUpperCase());
    };

    return {
        watchlist,
        addToWatchlist,
        removeFromWatchlist,
        isInWatchlist,
        isLoaded
    };
}
