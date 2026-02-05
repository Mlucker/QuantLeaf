import YahooFinance from 'yahoo-finance2';

const yahooFinance = new YahooFinance();

// Legacy Interface for Analysis
export interface TickerData {
    symbol: string;
    price: number;
    eps: number;
    bookValue: number;
    marketCap: number;
    netIncomeToCommon: number;
    totalCash: number;
    totalDebt: number;
    operatingCashFlow: number;
    capitalExpenditures: number;
    depreciation: number; // Depreciation & Amortization
    dividendRate: number;
    dividendYield: number; // percentage
    earningsGrowth: number; // percentage
    revenueGrowth: number; // percentage
    freeCashflow: number;
    beta: number;
    sector: string;
    financialsHistory: {
        date: string;
        eps: number;
        bookValue: number;
    }[];
}

export interface BondData {
    symbol: string;
    name: string;
    price: number;
    yield: number;
    change: number;
}

export interface IndexData {
    symbol: string;
    name: string;
    price: number;
    yield: number; // Not always applicable, but for interface consistency
    // Actually Index doesn't usually have yield in basic quote.
    change: number;
}

import { unstable_cache } from 'next/cache';

const fetchTickerData = async (symbol: string): Promise<TickerData | null> => {
    try {
        const quote: any = await yahooFinance.quoteSummary(symbol, {
            modules: [
                'price',
                'defaultKeyStatistics',
                'financialData',
                'cashflowStatementHistory',
                'summaryDetail',
                'summaryProfile',
                'incomeStatementHistory',
                'balanceSheetHistory'
            ]
        });

        const price = quote.price?.regularMarketPrice || 0;
        const eps = quote.defaultKeyStatistics?.trailingEps || 0;
        const bookValue = quote.defaultKeyStatistics?.bookValue || 0;
        const marketCap = quote.price?.marketCap || 0;

        // Fetch Beta and Sector
        const beta = quote.defaultKeyStatistics?.beta || quote.summaryDetail?.beta || 0;
        const sector = quote.summaryProfile?.sector || 'Unknown';

        const cashflow = quote.cashflowStatementHistory?.cashflowStatements?.[0]; // Most recent year

        // Prefer TTM data from financialData which is more reliable on Vercel/Production
        // Fallback to the most recent annual report from cashflowStatementHistory
        const operatingCashFlow = quote.financialData?.operatingCashflow || cashflow?.totalCashFromOperatingActivities || 0;

        // Capex is not always in financialData, so we stick to the annual report or derived
        const capitalExpenditures = cashflow?.capitalExpenditures || 0;

        // Depreciation & Amortization from cash flow statement
        const depreciation = cashflow?.depreciation || 0;

        const netIncomeToCommon = quote.financialData?.netIncome || cashflow?.netIncome || 0; // Prefer TTM Net Income

        // Debt/Cash
        const totalCash = quote.financialData?.totalCash || 0;
        const totalDebt = quote.financialData?.totalDebt || 0;

        // Growth & Dividends
        const dividendRate = quote.summaryDetail?.dividendRate || 0;
        const dividendYield = (quote.summaryDetail?.dividendYield || 0) * 100; // API usually returns 0.05 for 5%
        const earningsGrowth = (quote.financialData?.earningsGrowth || 0); // Decimal format usually
        const revenueGrowth = (quote.financialData?.revenueGrowth || 0);

        // Historical Financials for Valuation Chart (Last 4 Years)
        const incomeStatements = quote.incomeStatementHistory?.incomeStatementHistory || [];
        const balanceSheets = quote.balanceSheetHistory?.balanceSheetStatements || [];

        // Shares Outstanding is needed to calculate historical per-share metrics. 
        // We use current shares as fallback if historical basicAverageShares is missing.
        const currentShares = quote.defaultKeyStatistics?.sharesOutstanding || 1;

        const financialsHistory = incomeStatements.map((income: any, index: number) => {
            const date = income.endDate ? new Date(income.endDate).toISOString().split('T')[0] : 'Unknown';
            const balanceSheet = balanceSheets[index] || {}; // Assumes aligned arrays (usually true for annual)

            // Historical EPS (Net Income / Shares) - Prefer reported Basic EPS if available
            // Note: simple EPS = netIncome / basicAverageShares
            // If historical shares missing, use current shares (approximation)
            const histShares = income.basicAverageShares || currentShares;
            const histNetIncome = income.netIncome || 0;
            const histEPS = histNetIncome / histShares;

            // Historical Book Value (Equity / Shares)
            const histEquity = balanceSheet.totalStockholderEquity || 0;
            const histBVPS = histEquity / histShares;

            return {
                date,
                eps: histEPS,
                bookValue: histBVPS
            };
        }).reverse(); // Chronological order (Oldest -> Newest)

        const freeCashflow = quote.financialData?.freeCashflow || 0;

        return {
            symbol: symbol.toUpperCase(),
            price,
            eps,
            bookValue,
            marketCap,
            netIncomeToCommon,
            totalCash,
            totalDebt,
            operatingCashFlow,
            capitalExpenditures,
            depreciation,
            dividendRate,
            dividendYield,
            earningsGrowth,
            revenueGrowth,
            freeCashflow,
            beta,
            sector,
            financialsHistory
        };
    } catch (error) {
        console.error(`Error fetching data for ${symbol}:`, error);
        return null;
    }
};

export const getTickerData = unstable_cache(
    async (symbol: string) => fetchTickerData(symbol),
    ['ticker-data'],
    { revalidate: 1800 } // 30 minutes
);

export const getBondData = async (symbol: string): Promise<BondData | null> => {
    try {
        const quote: any = await yahooFinance.quote(symbol);
        return {
            symbol: symbol.toUpperCase(),
            price: quote.regularMarketPrice || 0,
            yield: quote.regularMarketPrice || 0, // Approx for yield tickers
            name: quote.shortName || quote.longName || symbol,
            change: quote.regularMarketChangePercent || 0
        };
    } catch (e) {
        console.error(e);
        return null;
    }
};

export const getIndexData = async (symbol: string): Promise<IndexData | null> => {
    try {
        const quote: any = await yahooFinance.quote(symbol);
        return {
            symbol: symbol.toUpperCase(),
            price: quote.regularMarketPrice || 0,
            change: quote.regularMarketChangePercent || 0,
            name: quote.shortName || quote.longName || symbol,
            yield: 0
        };
    } catch (e) {
        console.error(e);
        return null;
    }
};
export interface StockSummary {
    symbol: string;
    name: string;
    price: number;
    change: number;
}

export const getStockSummary = async (symbol: string): Promise<StockSummary | null> => {
    try {
        const quote: any = await yahooFinance.quote(symbol);
        return {
            symbol: symbol.toUpperCase(),
            price: quote.regularMarketPrice || 0,
            change: quote.regularMarketChangePercent || 0,
            name: quote.shortName || quote.longName || symbol
        };
    } catch (error) {
        console.error(`Error fetching summary for ${symbol}:`, error);
        return null;
    }
};
export interface CommodityData {
    symbol: string;
    name: string;
    price: number;
    change: number;
}

export interface HistoricalDataPoint {
    date: string;
    price: number;
}

export const getHistoricalData = async (symbol: string, range: '1y' | '5y' = '1y'): Promise<HistoricalDataPoint[]> => {
    try {
        const queryOptions = {
            period1: range === '5y' ? '2020-01-01' : '2023-01-01', // Dynamic calculation would be better, but this suffices for now
            interval: range === '5y' ? '1wk' as const : '1d' as const,
        };
        const result = await yahooFinance.chart(symbol, queryOptions);

        if (!result || !result.quotes) return [];

        return result.quotes
            .filter((q: any) => q.close !== null && q.date)
            .map((q: any) => ({
                date: new Date(q.date).toISOString().split('T')[0],
                price: q.close
            }));
    } catch (error) {
        console.error(`Error fetching history for ${symbol}:`, error);
        return [];
    }
};

export const getCommodityData = async (symbol: string): Promise<CommodityData | null> => {
    try {
        const quote: any = await yahooFinance.quote(symbol);
        return {
            symbol,
            price: quote.regularMarketPrice || 0,
            change: quote.regularMarketChangePercent || 0,
            name: quote.shortName || quote.longName || symbol
        };
    } catch (e) {
        console.error(e);
        return null;
    }
};
