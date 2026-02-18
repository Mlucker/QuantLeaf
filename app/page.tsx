import { Suspense } from 'react';
import TickerTrace from '@/components/TickerTrace';
import Dashboard from '@/components/Dashboard';
import AssetTabs from '@/components/AssetTabs';
import MarketGrid from '@/components/MarketGrid';
import WatchlistView from '@/components/WatchlistView';
import Header from '@/components/Header';
import { analyzeTicker } from '@/app/actions/getAnalysis';
import { getMarketOverview } from '@/app/actions/getMarketOverview';

export default async function Home({
  searchParams
}: {
  searchParams: Promise<{ ticker?: string, tab?: string, range?: string }>
}) {
  const { ticker, tab = 'stocks', range = '1y' } = await searchParams; // Default to stocks

  // Logic switch based on Tab
  let content = null;

  if (tab === 'stocks' || tab === 'bonds' || tab === 'commodities' || tab === 'indices') {
    if (ticker) {
      const analysisData = await analyzeTicker(ticker, tab, undefined, range as '1y' | '5y');
      content = <Dashboard data={analysisData} />;
    } else {
      // Browse Mode
      let watchlistElement = <WatchlistView />;

      if (tab === 'stocks') {
        const { stocks } = await getMarketOverview('stocks');
        content = (
          <>
            {watchlistElement}
            <MarketGrid items={stocks || []} title="Market Movers (Mag 7)" />
          </>
        );
      } else if (tab === 'bonds') {
        const { bonds } = await getMarketOverview('bonds');
        content = (
          <>
            {watchlistElement}
            <MarketGrid items={bonds || []} title="Government Bonds" />
          </>
        );
      } else if (tab === 'commodities') {
        const { commodities } = await getMarketOverview('commodities');
        content = (
          <>
            {watchlistElement}
            <MarketGrid items={commodities || []} title="Key Commodities" />
          </>
        );
      } else if (tab === 'indices') {
        const { indices } = await getMarketOverview('indices');
        content = (
          <>
            {watchlistElement}
            <MarketGrid items={indices || []} title="Major Indices" />
          </>
        );
      }
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-7xl mx-auto">

        <Header />

        <AssetTabs />

        <TickerTrace />

        <Suspense fallback={<div className="text-center text-slate-500 mt-10">Loading Data...</div>}>
          {content}
        </Suspense>
      </div>
    </main>
  );
}
