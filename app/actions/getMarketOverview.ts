'use server';

import { getBondData, getIndexData, getStockSummary, getCommodityData, BondData, IndexData, StockSummary, CommodityData } from '@/services/marketData';

export interface MarketViewResult {
    bonds?: BondData[];
    indices?: IndexData[];
    stocks?: StockSummary[];
    commodities?: CommodityData[];
}

export async function getMarketOverview(type: 'bonds' | 'indices' | 'stocks' | 'commodities'): Promise<MarketViewResult> {
    if (type === 'bonds') {
        const bonds = await Promise.all([
            getBondData('^TNX'), // US 10Y
            getBondData('^TYX'), // US 30Y
            getBondData('^FVX'), // US 5Y
        ]);
        return { bonds: bonds.filter(b => b !== null) as BondData[] };
    } else if (type === 'stocks') {
        const stocks = await Promise.all([
            getStockSummary('AAPL'),
            getStockSummary('MSFT'),
            getStockSummary('NVDA'),
            getStockSummary('GOOGL'),
            getStockSummary('AMZN'),
            getStockSummary('META'),
            getStockSummary('TSLA'),
        ]);
        return { stocks: stocks.filter(s => s !== null) as StockSummary[] };
    } else if (type === 'commodities') {
        const commodities = await Promise.all([
            getCommodityData('GC=F'), // Gold
            getCommodityData('SI=F'), // Silver
            getCommodityData('CL=F'), // Crude Oil
            getCommodityData('BTC-USD'), // Bitcoin (Digital Commodity)
        ]);
        return { commodities: commodities.filter(c => c !== null) as CommodityData[] };
    } else {
        const indices = await Promise.all([
            getIndexData('^GSPC'), // S&P 500
            getIndexData('^DJI'),  // Dow Jones
            getIndexData('^IXIC'), // Nasdaq
            getIndexData('^RUT'),  // Russell 2000
        ]);
        return { indices: indices.filter(i => i !== null) as IndexData[] };
    }
}
