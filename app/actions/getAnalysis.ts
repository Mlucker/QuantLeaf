'use server';

import {
    getTickerData, TickerData,
    getBondData, BondData,
    getIndexData, IndexData,
    getCommodityData, CommodityData,
    getHistoricalData
} from '@/services/marketData';
import { calculateGrahamNumber, calculateSimpleDCF, calculateOwnerEarningsYield, calculatePEGValue, calculateDDM, calculateDiscountRate } from '@/lib/financial/formulas';
import { fetchUrlData, ScrapedData } from '@/services/urlParser';

export interface GeneralAnalysis {
    sentiment: 'Bullish' | 'Bearish' | 'Neutral';
    rating: 'Strong' | 'Weak' | 'Stable';
    score: number; // 0-100
    keyPoints: string[];
    customMetric?: { label: string; value: string | number; description: string };
}

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
        pegFairValue: number;
        pegRatio: number;
        ddmValue: number;
    };
    generalAnalysis?: GeneralAnalysis;
    historicalData?: { date: string; price: number }[];
    error?: string;
}

// --- Heuristic Analysis Helpers ---

function analyzeBond(bond: BondData): GeneralAnalysis {
    const inflationRate = 3.0; // Assumed fixed inflation
    const realYield = bond.yield - inflationRate;
    let sentiment: 'Bullish' | 'Bearish' | 'Neutral' = 'Neutral';
    let rating: 'Strong' | 'Weak' | 'Stable' = 'Stable';
    const points: string[] = [];

    // Real Yield Analysis
    if (realYield > 1.5) {
        sentiment = 'Bullish';
        rating = 'Strong';
        points.push('Attractive Real Yield (>1.5%) suggesting good value.');
    } else if (realYield < 0) {
        sentiment = 'Bearish';
        rating = 'Weak';
        points.push('Negative Real Yield - losing purchasing power.');
    } else {
        points.push('Real Yield is positive but low; verify inflation expectations.');
    }

    // Trend Analysis (Change)
    if (bond.change > 1.0) {
        points.push('Strong daily price appreciation (yields falling).');
    } else if (bond.change < -1.0) {
        points.push('Significant sell-off observed (yields rising).');
    }

    return {
        sentiment,
        rating,
        score: Math.min(100, Math.max(0, (realYield + 2) * 20)), // Rough scoring
        keyPoints: points,
        customMetric: {
            label: 'Real Yield (Est.)',
            value: `${realYield.toFixed(2)}%`,
            description: `Nominal yield minus assumed inflation (${inflationRate}%)`
        }
    };
}

function analyzeIndex(index: IndexData): GeneralAnalysis {
    let sentiment: 'Bullish' | 'Bearish' | 'Neutral' = 'Neutral';
    const points: string[] = [];

    // Momentum Check
    if (index.change > 1.0) {
        sentiment = 'Bullish';
        points.push('Strong positive momentum (>1% daily gain).');
    } else if (index.change < -1.0) {
        sentiment = 'Bearish';
        points.push('Significant market pullback (>1% daily loss).');
    } else {
        points.push('Trading within normal daily volatility range.');
    }

    return {
        sentiment,
        rating: sentiment === 'Bullish' ? 'Strong' : (sentiment === 'Bearish' ? 'Weak' : 'Stable'),
        score: 50 + (index.change * 10), // Simple momentum score
        keyPoints: points,
        customMetric: {
            label: 'Market Mood',
            value: sentiment,
            description: 'Short-term sentiment based on price action'
        }
    };
}

function analyzeCommodity(commodity: CommodityData): GeneralAnalysis {
    let sentiment: 'Bullish' | 'Bearish' | 'Neutral' = 'Neutral';
    const points: string[] = [];

    // Volatility Check
    if (Math.abs(commodity.change) > 2.0) {
        points.push('High Volatility Alert: Significant price movement today.');
    }

    if (commodity.change > 0) {
        sentiment = 'Bullish';
        points.push('Positive price trend suggests increasing demand or supply constraints.');
    } else {
        sentiment = 'Bearish';
        points.push('Price weakness indicates potential oversupply or cooling demand.');
    }

    return {
        sentiment,
        rating: 'Stable', // Commodities are cyclical
        score: 50 + (commodity.change * 10),
        keyPoints: points
    };
}

export async function analyzeTicker(ticker: string, type: string = 'stocks', url?: string, range: '1y' | '5y' = '1y'): Promise<AnalysisResult> {
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

        // Fetch Historical Data
        const historicalData = await getHistoricalData(ticker, range);

        // --- Generate Heuristic Analysis for Non-Stocks ---
        let generalAnalysis: GeneralAnalysis | undefined;

        if (bondData) {
            generalAnalysis = analyzeBond(bondData);
        } else if (indexData) {
            generalAnalysis = analyzeIndex(indexData);
        } else if (commodityData) {
            generalAnalysis = analyzeCommodity(commodityData);
        }

        // Return Early for Non-Stocks with Analysis
        if (type !== 'stocks' || !tickerData) {
            return {
                assetType: type as any,
                tickerData,
                bondData,
                indexData,
                commodityData,
                scrapedData,
                generalAnalysis,
                historicalData,
                metrics: { grahamNumber: 0, dcfValue: 0, ownerEarningsYield: 0, pegFairValue: 0, pegRatio: 0, ddmValue: 0 }
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
        // Use dynamic discount rate based on CAPM (default beta = 1.0)
        const assumedDiscount = calculateDiscountRate(1.0); // ~10.5% for market-average risk

        // Market Cap = Price * Shares. Shares = Market Cap / Price.
        const sharesOutstanding = tickerData.marketCap / tickerData.price;

        let fcf = tickerData.freeCashflow;
        // Fallback or fix if FCF is missing
        if (!fcf) {
            // Capex is usually negative. FCF = OCF - |Capex| = OCF + Capex (if negative)
            // We use - Math.abs to be safe regardless of sign convention
            fcf = tickerData.operatingCashFlow - Math.abs(tickerData.capitalExpenditures);
        }

        const fcfPerShare = fcf / sharesOutstanding;

        // Recalculate DCF with per-share FCF
        // We ensure FCF is positive for a simple model, or accept it (DCF will be negative/zero)
        const dcfResult = calculateSimpleDCF(Math.max(0, fcfPerShare), assumedGrowth, assumedDiscount);

        const ownerEarningsYield = calculateOwnerEarningsYield(
            tickerData.netIncomeToCommon,
            tickerData.depreciation,
            tickerData.capitalExpenditures,
            tickerData.marketCap
        );

        // PEG Ratio-Based Fair Value
        const growthForPEG = tickerData.earningsGrowth || assumedGrowth;
        const pegResult = calculatePEGValue(tickerData.eps, growthForPEG, tickerData.price);

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
                pegFairValue: pegResult.fairValue,
                pegRatio: pegResult.pegRatio,
                ddmValue
            },
            historicalData
        };
    } catch (error) {
        console.error('Analysis error:', error);
        return {
            assetType: type as any,
            tickerData: null,
            scrapedData: null,
            metrics: { grahamNumber: 0, dcfValue: 0, ownerEarningsYield: 0, pegFairValue: 0, pegRatio: 0, ddmValue: 0 },
            error: 'Failed to analyze'
        };
    }
}
