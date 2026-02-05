'use server';

import { analyzeTicker, AnalysisResult } from './getAnalysis';

export async function compareTickers(tickers: string[]): Promise<AnalysisResult[]> {
    if (!tickers || tickers.length === 0) return [];

    // Run all analyzes in parallel
    const promises = tickers.map(ticker =>
        analyzeTicker(ticker.trim(), 'stocks')
    );

    const results = await Promise.all(promises);
    return results;
}
