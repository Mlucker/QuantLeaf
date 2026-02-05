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
    dividendRate: number;
    dividendYield: number; // percentage
    earningsGrowth: number; // percentage
    revenueGrowth: number; // percentage
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

export const getTickerData = async (symbol: string): Promise<TickerData | null> => {
    try {
        const quote: any = await yahooFinance.quoteSummary(symbol, {
            modules: ['price', 'defaultKeyStatistics', 'financialData', 'cashflowStatementHistory', 'summaryDetail']
        });

        const price = quote.price?.regularMarketPrice || 0;
        const eps = quote.defaultKeyStatistics?.trailingEps || 0;
        const bookValue = quote.defaultKeyStatistics?.bookValue || 0;
        const marketCap = quote.price?.marketCap || 0;

        const cashflow = quote.cashflowStatementHistory?.cashflowStatements?.[0]; // Most recent year
        const operatingCashFlow = cashflow?.totalCashFromOperatingActivities || 0;
        const capitalExpenditures = cashflow?.capitalExpenditures || 0;
        const netIncomeToCommon = cashflow?.netIncome || 0;

        // Debt/Cash
        const totalCash = quote.financialData?.totalCash || 0;
        const totalDebt = quote.financialData?.totalDebt || 0;

        // Growth & Dividends
        const dividendRate = quote.summaryDetail?.dividendRate || 0;
        const dividendYield = (quote.summaryDetail?.dividendYield || 0) * 100; // API usually returns 0.05 for 5%
        const earningsGrowth = (quote.financialData?.earningsGrowth || 0); // Decimal format usually
        const revenueGrowth = (quote.financialData?.revenueGrowth || 0);

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
            dividendRate,
            dividendYield,
            earningsGrowth,
            revenueGrowth
        };
    } catch (error) {
        console.error(`Error fetching data for ${symbol}:`, error);
        return null;
    }
};

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
