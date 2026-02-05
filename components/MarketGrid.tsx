'use client';

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BondData, IndexData, StockSummary, CommodityData } from '@/services/marketData';

interface MarketGridProps {
    items: (BondData | IndexData | StockSummary | CommodityData)[];
    title: string;
}

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function MarketGrid({ items, title }: MarketGridProps) {
    const searchParams = useSearchParams();
    const currentTab = searchParams.get('tab') || 'stocks';

    return (
        <>
            <h2 className="mt-8 mb-6 text-2xl font-bold tracking-tight text-white">{title}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item) => (
                    <Link
                        key={item.symbol}
                        href={`/?tab=${currentTab}&ticker=${item.symbol}`}
                        className="block group"
                    >
                        <Card className="glass-panel text-white group-hover:scale-[1.02] transition-transform duration-200 cursor-pointer ring-0 bg-transparent border-transparent group-hover:border-emerald-500/30">
                            <CardContent className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="truncate">
                                        <div className="text-emerald-400 font-bold tracking-tight group-hover:text-emerald-300">{item.symbol}</div>
                                        <div className="text-white truncate font-medium text-lg mt-1" title={item.name}>{item.name}</div>
                                    </div>
                                    <Badge variant={item.change >= 0 ? "default" : "destructive"} className={`${item.change >= 0 ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"} border-none`}>
                                        {item.change >= 0 ? '+' : ''}{item.change.toFixed(2)}%
                                    </Badge>
                                </div>

                                <div className="flex items-end justify-between">
                                    <div>
                                        <div className="text-slate-400 text-xs uppercase tracking-wider font-semibold">
                                            {'yield' in item ? 'Current Yield' : 'Price'}
                                        </div>
                                        <div className="text-white text-3xl font-bold mt-1">
                                            {'yield' in item ? `${item.yield?.toFixed(2)}%` : item.price.toFixed(2)}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </>
    );
}
