'use server';

import {
    getTickerData, TickerData,
    getBondData, BondData,
    getIndexData, IndexData,
    getCommodityData, CommodityData
} from '@/services/marketData';
import { calculateGrahamNumber, calculateSimpleDCF, calculateOwnerEarningsYield, calculatePeterLynchValue, calculateDDM } from '@/lib/financial/formulas';
import { fetchUrlData, ScrapedData } from '@/services/urlParser';

export interface AnalysisResult {
    tickerData: TickerData | null;
    bondData?: BondData | null;
    indexData?: IndexData | null;
    commodityData?: CommodityData | null;
    assetType: 'stocks' | 'bonds' | 'indices' | 'commodities';
    scrapedData: ScrapedData | null;
    metrics: {
        grahamNumber: number;
        dcfValue: number;
        dcfDetail?: any;
        ownerEarningsYield: number;
        peterLynchValue: number;
        ddmValue: number;
    };
    error?: string;
}

export async function analyzeTicker(ticker: string, type: string = 'stocks', url?: string): Promise<AnalysisResult> {
    try {
        let tickerData: TickerData | null = null;
        let bondData: BondData | null = null;
        let indexData: IndexData | null = null;
        let commodityData: CommodityData | null = null;
        let scrapedData: ScrapedData | null = null;

        // Fetch Data based on Type
        if (type === 'bonds') {
            [bondData, scrapedData] = await Promise.all([
                getBondData(ticker),
                url ? fetchUrlData(url) : Promise.resolve(null)
            ]);
        } else if (type === 'indices') {
            [indexData, scrapedData] = await Promise.all([
                getIndexData(ticker),
                url ? fetchUrlData(url) : Promise.resolve(null)
            ]);
        } else if (type === 'commodities') {
            [commodityData, scrapedData] = await Promise.all([
                getCommodityData(ticker),
                url ? fetchUrlData(url) : Promise.resolve(null)
            ]);
        } else {
            // Default to Stocks
            [tickerData, scrapedData] = await Promise.all([
                getTickerData(ticker),
                url ? fetchUrlData(url) : Promise.resolve(null)
            ]);
        }

        // Return Early for Non-Stocks
        if (type !== 'stocks' || !tickerData) {
            return {
                assetType: type as any,
                tickerData,
                bondData,
                indexData,
                commodityData,
                scrapedData,
                metrics: { grahamNumber: 0, dcfValue: 0, ownerEarningsYield: 0, peterLynchValue: 0, ddmValue: 0 }
            };
        }

        // --- Stock Valuation Logic ---

        // Calculate Metrics
        const grahamNumber = calculateGrahamNumber(tickerData.eps, tickerData.bookValue);

        // Assumptions for DCF
        // Priority: Earnings Growth -> Revenue Growth -> 5% fallback
        let rawGrowth = tickerData.earningsGrowth || tickerData.revenueGrowth || 0.05;

        // Safety Cap: 15% (0.15)
        if (rawGrowth > 0.15) rawGrowth = 0.15;

        const assumedGrowth = rawGrowth;
        const assumedDiscount = 0.10; // 10% discount rate

        // Market Cap = Price * Shares. Shares = Market Cap / Price.
        const sharesOutstanding = tickerData.marketCap / tickerData.price;
        const fcfPerShare = (tickerData.operatingCashFlow - tickerData.capitalExpenditures) / sharesOutstanding;

        // Recalculate DCF with per-share FCF
        const dcfResult = calculateSimpleDCF(fcfPerShare, assumedGrowth, assumedDiscount);

        const ownerEarningsYield = calculateOwnerEarningsYield(
            tickerData.netIncomeToCommon,
            0,
            tickerData.capitalExpenditures,
            tickerData.marketCap
        );

        // Peter Lynch Value
        const growthForLynch = tickerData.earningsGrowth || assumedGrowth;
        const peterLynchValue = calculatePeterLynchValue(tickerData.eps, growthForLynch, tickerData.dividendYield);

        // DDM
        const ddmValue = calculateDDM(tickerData.dividendRate, 0.03);

        return {
            assetType: 'stocks',
            tickerData,
            scrapedData,
            metrics: {
                grahamNumber,
                dcfValue: dcfResult.value,
                dcfDetail: { ...dcfResult, usedGrowthRate: assumedGrowth },
                ownerEarningsYield,
                peterLynchValue,
                ddmValue
            },
        };
    } catch (error) {
        console.error('Analysis error:', error);
        return {
            assetType: type as any,
            tickerData: null,
            scrapedData: null,
            metrics: { grahamNumber: 0, dcfValue: 0, ownerEarningsYield: 0, peterLynchValue: 0, ddmValue: 0 },
            error: 'Failed to analyze'
        };
    }
}
