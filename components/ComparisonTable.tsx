'use client';

import { AnalysisResult } from '@/app/actions/getAnalysis';
import { Card, CardContent } from "@/components/ui/card";
import { Check, X } from 'lucide-react';
import Link from 'next/link';

interface ComparisonTableProps {
    data: AnalysisResult[];
}

export default function ComparisonTable({ data }: ComparisonTableProps) {
    if (!data || data.length === 0) return null;

    // Filter out failed analyzes
    const validData = data.filter(d => d.tickerData !== null);

    if (validData.length === 0) {
        return (
            <div className="text-center text-slate-500 py-10">
                No valid data found for these tickers.
            </div>
        );
    }

    // Helper to find the best value in a row (min or max)
    const getBestIndex = (extractor: (d: AnalysisResult) => number, type: 'min' | 'max') => {
        let bestVal = type === 'min' ? Infinity : -Infinity;
        let bestIdx = -1;

        validData.forEach((d, idx) => {
            const val = extractor(d);
            if (type === 'min') {
                if (val < bestVal && val > 0) { // Assume > 0 for things like PE/PEG
                    bestVal = val;
                    bestIdx = idx;
                }
            } else {
                if (val > bestVal) {
                    bestVal = val;
                    bestIdx = idx;
                }
            }
        });

        return bestIdx;
    };

    const bestPegIdx = getBestIndex(d => d.metrics.pegRatio, 'min');
    const bestDcfIdx = getBestIndex(d => (d.metrics.dcfValue / (d.tickerData!.price)) - 1, 'max'); // Best upside
    const bestGrahamIdx = getBestIndex(d => (d.metrics.grahamNumber / (d.tickerData!.price)) - 1, 'max'); // Best upside
    const bestOwnerEarningsIdx = getBestIndex(d => d.metrics.ownerEarningsYield, 'max');
    const bestGrowthIdx = getBestIndex(d => d.tickerData!.earningsGrowth || d.tickerData!.revenueGrowth, 'max');

    const Cell = ({ children, isBest = false, className = "" }: { children: React.ReactNode, isBest?: boolean, className?: string }) => (
        <td className={`px-6 py-4 whitespace-nowrap text-sm text-slate-300 font-mono ${isBest ? 'bg-emerald-500/10 text-emerald-400 font-bold border-emerald-500/20' : ''} ${className}`}>
            {children}
            {isBest && <Check size={14} className="inline ml-2 text-emerald-500" />}
        </td>
    );

    return (
        <div className="mt-8">
            {/* Desktop Table View */}
            <Card className="glass-panel border-white/10 overflow-hidden hidden md:block">
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-900/50 border-b border-white/10">
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider sticky left-0 bg-slate-950 z-10 w-[200px]">Metric</th>
                                    {validData.map((d) => (
                                        <th key={d.tickerData!.symbol} className="px-6 py-4 text-center">
                                            <Link href={`/?q=${d.tickerData!.symbol}`} className="text-xl font-bold text-white hover:text-emerald-400 transition-colors">
                                                {d.tickerData!.symbol}
                                            </Link>
                                            <div className="text-xs text-emerald-500 mt-1">${d.tickerData!.price.toFixed(2)}</div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {/* Valuation Metrics */}
                                <tr className="bg-slate-900/30">
                                    <td className="px-6 py-4 text-sm font-semibold text-white sticky left-0 bg-slate-900/90">Valuation</td>
                                    <td colSpan={validData.length}></td>
                                </tr>

                                <tr>
                                    <td className="px-6 py-4 text-sm text-slate-400 sticky left-0 bg-slate-950">PEG Ratio</td>
                                    {validData.map((d, i) => (
                                        <Cell key={i} isBest={i === bestPegIdx}>
                                            {d.metrics.pegRatio.toFixed(2)}x
                                        </Cell>
                                    ))}
                                </tr>
                                <tr>
                                    <td className="px-6 py-4 text-sm text-slate-400 sticky left-0 bg-slate-950">Graham Number</td>
                                    {validData.map((d, i) => (
                                        <Cell key={i} isBest={i === bestGrahamIdx}>
                                            ${d.metrics.grahamNumber.toFixed(2)}
                                        </Cell>
                                    ))}
                                </tr>
                                <tr>
                                    <td className="px-6 py-4 text-sm text-slate-400 sticky left-0 bg-slate-950">DCF Value</td>
                                    {validData.map((d, i) => (
                                        <Cell key={i} isBest={i === bestDcfIdx}>
                                            ${d.metrics.dcfValue.toFixed(2)}
                                        </Cell>
                                    ))}
                                </tr>
                                <tr>
                                    <td className="px-6 py-4 text-sm text-slate-400 sticky left-0 bg-slate-950">Owner Earnings Yield</td>
                                    {validData.map((d, i) => (
                                        <Cell key={i} isBest={i === bestOwnerEarningsIdx}>
                                            {(d.metrics.ownerEarningsYield * 100).toFixed(2)}%
                                        </Cell>
                                    ))}
                                </tr>

                                {/* Fundamentals */}
                                <tr className="bg-slate-900/30">
                                    <td className="px-6 py-4 text-sm font-semibold text-white sticky left-0 bg-slate-900/90">Fundamentals</td>
                                    <td colSpan={validData.length}></td>
                                </tr>

                                <tr>
                                    <td className="px-6 py-4 text-sm text-slate-400 sticky left-0 bg-slate-950">Market Cap</td>
                                    {validData.map((d, i) => (
                                        <Cell key={i}>
                                            ${(d.tickerData!.marketCap / 1e9).toFixed(2)}B
                                        </Cell>
                                    ))}
                                </tr>
                                <tr>
                                    <td className="px-6 py-4 text-sm text-slate-400 sticky left-0 bg-slate-950">Beta (Risk)</td>
                                    {validData.map((d, i) => (
                                        <Cell key={i} className={d.tickerData!.beta < 1 ? 'text-emerald-400' : 'text-amber-400'}>
                                            {d.tickerData!.beta?.toFixed(2) || 'N/A'}
                                        </Cell>
                                    ))}
                                </tr>
                                <tr>
                                    <td className="px-6 py-4 text-sm text-slate-400 sticky left-0 bg-slate-950">Revenue Growth</td>
                                    {validData.map((d, i) => (
                                        <Cell key={i} isBest={i === bestGrowthIdx}>
                                            {((d.tickerData!.earningsGrowth || d.tickerData!.revenueGrowth || 0) * 100).toFixed(1)}%
                                        </Cell>
                                    ))}
                                </tr>
                                <tr>
                                    <td className="px-6 py-4 text-sm text-slate-400 sticky left-0 bg-slate-950">Sector</td>
                                    {validData.map((d, i) => (
                                        <td key={i} className="px-6 py-4 text-xs text-slate-400 uppercase tracking-wide">
                                            {d.tickerData!.sector}
                                        </td>
                                    ))}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Mobile Card View */}
            <div className="grid grid-cols-1 gap-6 md:hidden">
                {validData.map((d, i) => (
                    <Card key={d.tickerData!.symbol} className="glass-panel border-white/10">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <Link href={`/?q=${d.tickerData!.symbol}`} className="text-2xl font-bold text-white hover:text-emerald-400 transition-colors">
                                        {d.tickerData!.symbol}
                                    </Link>
                                    <div className="text-slate-400 text-sm">{d.tickerData!.sector}</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xl font-bold text-emerald-400">${d.tickerData!.price.toFixed(2)}</div>
                                    <div className="text-xs text-slate-500">Current Price</div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center py-2 border-b border-white/5">
                                    <span className="text-slate-400 text-sm">PEG Ratio</span>
                                    <span className={`font-mono ${i === bestPegIdx ? 'text-emerald-400 font-bold' : 'text-white'}`}>
                                        {d.metrics.pegRatio.toFixed(2)}x
                                    </span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-white/5">
                                    <span className="text-slate-400 text-sm">Graham Number</span>
                                    <span className={`font-mono ${i === bestGrahamIdx ? 'text-emerald-400 font-bold' : 'text-white'}`}>
                                        ${d.metrics.grahamNumber.toFixed(2)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-white/5">
                                    <span className="text-slate-400 text-sm">DCF Value</span>
                                    <span className={`font-mono ${i === bestDcfIdx ? 'text-emerald-400 font-bold' : 'text-white'}`}>
                                        ${d.metrics.dcfValue.toFixed(2)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-white/5">
                                    <span className="text-slate-400 text-sm">Owner Earnings</span>
                                    <span className={`font-mono ${i === bestOwnerEarningsIdx ? 'text-emerald-400 font-bold' : 'text-white'}`}>
                                        {(d.metrics.ownerEarningsYield * 100).toFixed(2)}%
                                    </span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-white/5">
                                    <span className="text-slate-400 text-sm">Growth Rate</span>
                                    <span className={`font-mono ${i === bestGrowthIdx ? 'text-emerald-400 font-bold' : 'text-white'}`}>
                                        {((d.tickerData!.earningsGrowth || d.tickerData!.revenueGrowth || 0) * 100).toFixed(1)}%
                                    </span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-white/5">
                                    <span className="text-slate-400 text-sm">Beta</span>
                                    <span className={`font-mono ${d.tickerData!.beta < 1 ? 'text-emerald-400' : 'text-amber-400'}`}>
                                        {d.tickerData!.beta?.toFixed(2) || 'N/A'}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
