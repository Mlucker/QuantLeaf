'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface IntrinsicGaugeProps {
    currentPrice: number;
    grahamNumber: number;
    dcfValue: number;
}

export default function IntrinsicGauge({ currentPrice, grahamNumber, dcfValue }: IntrinsicGaugeProps) {
    // Average intrinsic value from models
    const intrinsicValue = (grahamNumber + dcfValue) / 2;
    const deviation = ((currentPrice - intrinsicValue) / intrinsicValue) * 100;

    // Color coding: UnderValued (Green), OverValued (Red)
    const isUndervalued = currentPrice < intrinsicValue;
    const colorClass = isUndervalued ? 'bg-emerald-500' : 'bg-rose-500';
    const textClass = isUndervalued ? 'text-emerald-400' : 'text-rose-400';

    // Calculate progress (clamped 0-100 for visual)
    const progress = Math.min(Math.max((isUndervalued ? (currentPrice / intrinsicValue) : (intrinsicValue / currentPrice)) * 100, 0), 100);

    return (
        <Card className="max-w-md mx-auto bg-slate-900 border-none ring-0 shadow-none w-full">
            <CardHeader className="pb-2">
                <CardTitle className="text-slate-400 text-sm font-semibold uppercase tracking-wider text-center">Intrinsic Value</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex justify-center items-end space-x-2 mb-4">
                    <div className="text-white text-3xl font-bold">${intrinsicValue.toFixed(2)}</div>
                    <div className="text-slate-500 text-sm mb-1">Target</div>
                </div>

                <div className="text-center mb-4">
                    <span className={`text-lg font-medium ${textClass}`}>
                        {currentPrice.toFixed(2)}
                    </span>
                    <span className="text-slate-400 ml-2 text-sm">
                        ({Math.abs(deviation).toFixed(1)}% {isUndervalued ? 'Undervalued' : 'Overvalued'})
                    </span>
                </div>

                <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
                    <div
                        className={`h-full ${colorClass} transition-all duration-1000 ease-out`}
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <div className="flex justify-between mt-3 text-xs text-slate-500">
                    <div>Graham: ${grahamNumber.toFixed(0)}</div>
                    <div>DCF: ${dcfValue.toFixed(0)}</div>
                </div>
            </CardContent>
        </Card>
    );
}
