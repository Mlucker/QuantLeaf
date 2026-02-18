'use server';

import { auth } from '@/auth';
import { db } from '@/lib/db';
import { watchlists } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function getWatchlist() {
    const session = await auth();
    if (!session?.user?.id) return [];

    const result = await db
        .select({ symbol: watchlists.symbol })
        .from(watchlists)
        .where(eq(watchlists.userId, session.user.id));

    return result.map(r => r.symbol);
}

export async function syncWatchlist(localSymbols: string[]) {
    const session = await auth();
    if (!session?.user?.id) return [];

    const existingDB = await getWatchlist();
    const newGeneric = localSymbols.filter(s => !existingDB.includes(s));

    if (newGeneric.length > 0) {
        await db.insert(watchlists).values(
            newGeneric.map(symbol => ({
                userId: session.user!.id!,
                symbol
            }))
        );
    }

    // Return the full merged list
    return getWatchlist();
}

export async function addToWatchlistDB(symbol: string) {
    const session = await auth();
    if (!session?.user?.id) return;

    try {
        await db.insert(watchlists).values({
            userId: session.user.id,
            symbol: symbol.toUpperCase()
        });
        revalidatePath('/');
    } catch (error) {
        // Ignore duplicate key errors
        console.error('Failed to add to watchlist', error);
    }
}

export async function removeFromWatchlistDB(symbol: string) {
    const session = await auth();
    if (!session?.user?.id) return;

    await db.delete(watchlists)
        .where(and(
            eq(watchlists.userId, session.user.id),
            eq(watchlists.symbol, symbol.toUpperCase())
        ));
    revalidatePath('/');
}
