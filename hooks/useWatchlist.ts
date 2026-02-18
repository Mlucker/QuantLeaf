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


    // Sync with database when loaded
    useEffect(() => {
        if (isLoaded) {
            import('@/app/actions/watchlist').then(({ syncWatchlist }) => {
                syncWatchlist(watchlist).then(merged => {
                    // Only update if different to avoid loops
                    if (JSON.stringify(merged) !== JSON.stringify(watchlist)) {
                        setWatchlist(merged);
                        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
                    }
                });
            });
        }
    }, [isLoaded]); // Run once when loaded (and user auth state changes implicitly via server action access)

    // We need to wrap db actions to not fail if not logged in
    const addToWatchlist = async (symbol: string) => {
        const upper = symbol.toUpperCase();
        if (!watchlist.includes(upper)) {
            const newList = [...watchlist, upper];
            setWatchlist(newList); // Optimistic update

            // Try to add to DB
            import('@/app/actions/watchlist').then(({ addToWatchlistDB }) => {
                addToWatchlistDB(upper);
            });
        }
    };

    const removeFromWatchlist = async (symbol: string) => {
        const upper = symbol.toUpperCase();
        setWatchlist(prev => prev.filter(t => t !== upper)); // Optimistic update

        // Try to remove from DB
        import('@/app/actions/watchlist').then(({ removeFromWatchlistDB }) => {
            removeFromWatchlistDB(upper);
        });
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
