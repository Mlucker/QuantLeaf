import { AnalysisResult } from '@/app/actions/getAnalysis';
import IntrinsicGauge from './IntrinsicGauge';
import PriceChart from './PriceChart';
import TimeRangeFilter from './TimeRangeFilter';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle } from 'lucide-react';

export default function Dashboard({ data }: { data: AnalysisResult }) {
    if (data.error) {
        return (
            <div className="flex justify-center mt-10">
                <Card className="max-w-md w-full glass-panel border-amber-500/20 bg-amber-500/5">
                    <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                        <div className="w-10 h-10 bg-amber-500/10 rounded-full flex items-center justify-center">
                            <AlertTriangle className="w-5 h-5 text-amber-500" />
                        </div>
                        <div>
                            <CardTitle className="text-white text-lg">Analysis Unavailable</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-slate-400 text-sm">
                            {data.error || 'Unable to retrieve data for this ticker. It might be delisted or the API is temporarily unavailable.'}
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const { tickerData, metrics, scrapedData, assetType, bondData, indexData, commodityData, historicalData } = data;

    // --- NON-STOCK VIEW (Simple Dashboard) ---
    if (assetType !== 'stocks') {
        const item = bondData || indexData || commodityData;

        // If we are in non-stock mode but don't have item data, prompt user or show error
        if (!item) {
            // Fallback if something went wrong
            return <div className="text-center text-slate-500 mt-10">Data not available for this asset.</div>;
        }

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 max-w-4xl mx-auto">
                <Card className="glass-panel ring-0 border-none bg-transparent">
                    <CardHeader>
                        <CardTitle className="text-slate-400 text-sm font-semibold uppercase tracking-wider">Asset Profile</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-white text-4xl font-bold">{item.symbol}</div>
                        <div className="text-emerald-400 text-2xl font-bold mt-2">
                            {'yield' in item ? `${(item as any).yield?.toFixed(2)}%` : `$${item.price.toFixed(2)}`}
                            {'yield' in item && <span className="text-sm text-slate-400 font-normal ml-2">(Yield)</span>}
                        </div>
                        <div className="text-white text-lg mt-1 opacity-80">{item.name}</div>

                        <div className="mt-6 flex items-center space-x-4">
                            <div className={`text-xl font-bold ${item.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                {item.change >= 0 ? '+' : ''}{item.change.toFixed(2)}%
                            </div>
                            <div className="text-slate-500 text-sm">Today's Change</div>
                        </div>

                        {/* Chart for Non-Stocks */}
                        {historicalData && (
                            <div className="mt-8 pt-6 border-t border-white/5">
                                <div className="flex justify-between items-center mb-4">
                                    <div className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Price History</div>
                                    <TimeRangeFilter />
                                </div>
                                <div className="h-[200px] -mx-4">
                                    <PriceChart data={historicalData} color={item.change >= 0 ? "#10b981" : "#ef4444"} />
                                </div>
                            </div>
                        )}
                        {data.generalAnalysis?.customMetric && (
                            <div className="mt-8 border-t border-white/5 pt-4">
                                <div className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-1">{data.generalAnalysis.customMetric.label}</div>
                                <div className={`text-2xl font-bold ${data.generalAnalysis.sentiment === 'Bullish' ? 'text-emerald-400' : (data.generalAnalysis.sentiment === 'Bearish' ? 'text-red-400' : 'text-slate-200')}`}>
                                    {data.generalAnalysis.customMetric.value}
                                </div>
                                <div className="text-slate-500 text-xs mt-1">{data.generalAnalysis.customMetric.description}</div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    {/* Analysis Panel */}
                    {data.generalAnalysis && (
                        <Card className="glass-panel ring-0 border-none bg-transparent">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-slate-400 text-sm font-semibold uppercase tracking-wider">Analysis</CardTitle>
                                <div className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider
                                    ${data.generalAnalysis.sentiment === 'Bullish' ? 'bg-emerald-500/10 text-emerald-400' :
                                        (data.generalAnalysis.sentiment === 'Bearish' ? 'bg-red-500/10 text-red-400' : 'bg-slate-500/10 text-slate-400')}`}>
                                    {data.generalAnalysis.sentiment}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-slate-200 font-medium">Rating</span>
                                            <span className="text-white font-bold">{data.generalAnalysis.rating}</span>
                                        </div>
                                        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full ${data.generalAnalysis.score > 66 ? 'bg-emerald-500' : (data.generalAnalysis.score > 33 ? 'bg-yellow-500' : 'bg-red-500')}`}
                                                style={{ width: `${data.generalAnalysis.score}%` }}
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-white/5">
                                        <div className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-3">Key Takeaways</div>
                                        <ul className="space-y-2">
                                            {data.generalAnalysis.keyPoints.map((point, idx) => (
                                                <li key={idx} className="text-sm text-slate-300 flex items-start">
                                                    <span className="text-emerald-500 mr-2">•</span>
                                                    {point}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {scrapedData && (
                        <Card className="glass-panel ring-0 border-none bg-transparent">
                            <CardHeader>
                                <CardTitle className="text-slate-400 text-sm font-semibold uppercase tracking-wider">Market Context</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-slate-200 text-sm leading-relaxed">
                                    {scrapedData.title}
                                </div>
                                <div className="mt-4 text-xs text-slate-500">
                                    Global market data provided for informational purposes.
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        );

    }

    // --- STOCK VIEW (Full Dashboard) ---
    if (!tickerData) {
        return <div className="text-center text-slate-500 mt-10">Loading Stock Data...</div>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-8">
            {/* Col 1: Ticker Info */}
            <Card className="glass-panel ring-0 border-none bg-transparent">
                <CardHeader>
                    <CardTitle className="text-slate-400 text-sm font-semibold uppercase tracking-wider">Ticker Profile</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-white text-4xl font-bold">{tickerData.symbol}</div>
                    <div className="text-emerald-400 text-2xl font-bold mt-2">${tickerData.price.toFixed(2)}</div>
                    <div className="mt-8 space-y-4">
                        <div className="flex justify-between items-center py-2 border-b border-white/5">
                            <span className="text-slate-400 text-sm">Market Cap</span>
                            <span className="text-white font-mono">${(tickerData.marketCap / 1e9).toFixed(2)}B</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-white/5">
                            <span className="text-slate-400 text-sm">EPS</span>
                            <span className="text-white font-mono">${tickerData.eps.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-white/5">
                            <span className="text-slate-400 text-sm">Book Value</span>
                            <span className="text-white font-mono">${tickerData.bookValue.toFixed(2)}</span>
                        </div>
                    </div>

                    {/* Chart for Stocks */}
                    {historicalData && (
                        <div className="mt-8 pt-6 border-t border-white/5">
                            <div className="flex justify-between items-center mb-4">
                                <div className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Price History</div>
                                <TimeRangeFilter />
                            </div>
                            <div className="h-[150px] -mx-4">
                                <PriceChart data={historicalData} color="#10b981" />
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Col 2: Intrinsic Gauge */}
            <div className="glass-panel rounded-lg p-6 flex flex-col items-center justify-center border border-white/10">
                <IntrinsicGauge
                    currentPrice={tickerData.price}
                    grahamNumber={metrics.grahamNumber}
                    dcfValue={metrics.dcfValue}
                />
            </div>

            {/* Col 3: Owner Earnings / Scraped Data */}
            <Card className="glass-panel ring-0 border-none bg-transparent">
                <CardHeader>
                    <CardTitle className="text-slate-400 text-sm font-semibold uppercase tracking-wider">Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="mt-2">
                        <div className="text-slate-400 text-sm mb-1">Owner Earnings Yield</div>
                        <div className="text-white text-3xl font-bold">{metrics.ownerEarningsYield.toFixed(2)}%</div>
                        <div className="w-full bg-slate-800 h-2 rounded-full mt-4 overflow-hidden">
                            <div
                                className="bg-emerald-500 h-full rounded-full transition-all duration-1000"
                                style={{ width: `${Math.min(metrics.ownerEarningsYield * 5, 100)}%` }} // Arbitrary scale
                            />
                        </div>
                    </div>

                    {scrapedData && (
                        <div className="mt-10 border-t border-white/5 pt-6">
                            <div className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-2">Market Context</div>
                            <div className="text-slate-200 text-sm leading-relaxed" title={scrapedData.title}>
                                {scrapedData.title}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Col 4: Valuation Comparison */}
            <Card className="glass-panel ring-0 border-none bg-transparent">
                <CardHeader>
                    <CardTitle className="text-slate-400 text-sm font-semibold uppercase tracking-wider">Valuation Models</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Graham Number */}
                    <div className="flex justify-between items-center pb-2 border-b border-white/5 last:border-0">
                        <span className="text-slate-400 text-sm">Graham Formula</span>
                        <div className="text-right">
                            <span className="text-white font-mono block">${metrics.grahamNumber.toFixed(2)}</span>
                            <span className={`text-xs ${metrics.grahamNumber > tickerData.price ? 'text-emerald-400' : 'text-red-400'}`}>
                                {metrics.grahamNumber > tickerData.price ? 'Undervalued' : 'Overvalued'}
                            </span>
                        </div>
                    </div>

                    {/* Peter Lynch Value */}
                    <div className="flex justify-between items-center pb-2 border-b border-white/5 last:border-0">
                        <span className="text-slate-400 text-sm">Peter Lynch Value</span>
                        <div className="text-right">
                            <span className="text-white font-mono block">${metrics.peterLynchValue.toFixed(2)}</span>
                            <span className={`text-xs ${metrics.peterLynchValue > tickerData.price ? 'text-emerald-400' : 'text-red-400'}`}>
                                {metrics.peterLynchValue > tickerData.price ? 'Undervalued' : 'Overvalued'}
                            </span>
                        </div>
                    </div>

                    {/* DDM */}
                    <div className="flex justify-between items-center pb-2 border-b border-white/5 last:border-0">
                        <span className="text-slate-400 text-sm">Dividend Model</span>
                        <div className="text-right">
                            <span className="text-white font-mono block">${metrics.ddmValue.toFixed(2)}</span>
                            <span className="text-xs text-slate-500 block">Stable Growth</span>
                        </div>
                    </div>

                    {/* DCF (Primary) */}
                    <div className="flex justify-between items-center pt-2 border-t border-white/10">
                        <span className="text-emerald-400 font-bold text-sm">DCF Value</span>
                        <span className="text-emerald-400 font-mono text-lg font-bold">${metrics.dcfValue.toFixed(2)}</span>
                    </div>
                </CardContent>
            </Card>


            {/* Row 2: Deep Dive Analysis */}
            {
                metrics.dcfDetail && (
                    <Card className="col-span-1 md:col-span-2 xl:col-span-4 glass-panel border-none bg-transparent mt-6">
                        <CardHeader>
                            <CardTitle className="text-slate-400 text-sm font-semibold uppercase tracking-wider">DCF Valuation Model (5-Year Projection)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-slate-400 uppercase bg-white/5">
                                        <tr>
                                            <th className="px-4 py-3 rounded-l-lg">Year</th>
                                            <th className="px-4 py-3">Projected FCF (Per Share)</th>
                                            <th className="px-4 py-3">Discount Factor (10%)</th>
                                            <th className="px-4 py-3 rounded-r-lg">Discounted Value</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-slate-200">
                                        {metrics.dcfDetail.projections.map((proj: any) => (
                                            <tr key={proj.year} className="border-b border-white/5 hover:bg-white/5">
                                                <td className="px-4 py-3 font-medium">Year {proj.year}</td>
                                                <td className="px-4 py-3">${proj.fcf.toFixed(2)}</td>
                                                <td className="px-4 py-3">{(1 / Math.pow(1.10, proj.year)).toFixed(3)}</td>
                                                <td className="px-4 py-3 font-mono text-emerald-400">${proj.discountedValue.toFixed(2)}</td>
                                            </tr>
                                        ))}
                                        <tr className="bg-emerald-500/10 font-semibold border-b border-white/5">
                                            <td className="px-4 py-3" colSpan={3}>Terminal Value (2% growth)</td>
                                            <td className="px-4 py-3 font-mono text-emerald-400">${metrics.dcfDetail.presentTerminalValue.toFixed(2)}</td>
                                        </tr>
                                        <tr className="text-lg font-bold bg-emerald-500/20">
                                            <td className="px-4 py-4" colSpan={3}>Intrinsic Value Per Share</td>
                                            <td className="px-4 py-4 font-mono text-emerald-400">${metrics.dcfDetail.value.toFixed(2)}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="mt-4 text-xs text-slate-500">
                                *Assumes <strong>{(metrics.dcfDetail.usedGrowthRate * 100).toFixed(1)}% annual growth</strong> (capped at 15%), 10% discount rate, and 2% terminal growth.
                            </div>
                        </CardContent>
                    </Card>
                )
            }
        </div >
    );
}
