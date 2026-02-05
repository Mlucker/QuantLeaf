'use client';

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface HistoricalDataPoint {
    date: string;
    price: number;
}

interface PriceChartProps {
    data: HistoricalDataPoint[];
    color?: string; // Hex color code
    className?: string;
    height?: number | string;
}

export default function PriceChart({ data, color = "#10b981", className = "h-full w-full", height = "100%" }: PriceChartProps) {
    if (!data || data.length === 0) {
        return <div className={`flex items-center justify-center text-slate-500 text-sm ${className}`}>No chart data available</div>;
    }

    // Determine min/max for Y-axis scaling
    const prices = data.map(d => d.price);
    const minPrice = Math.min(...prices) * 0.98; // 2% buffer
    const maxPrice = Math.max(...prices) * 1.02;

    return (
        <div className={className}>
            <ResponsiveContainer width="100%" height={height as any}>
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                            <stop offset="95%" stopColor={color} stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <XAxis
                        dataKey="date"
                        hide={true}
                    />
                    <YAxis
                        domain={[minPrice, maxPrice]}
                        hide={true}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "rgba(15, 23, 42, 0.9)",
                            borderColor: "rgba(255,255,255,0.1)",
                            borderRadius: "8px",
                            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                            color: "#fff"
                        }}
                        itemStyle={{ color: color }}
                        labelStyle={{ color: "#94a3b8", marginBottom: "0.25rem" }}
                        formatter={(value: any) => [`$${Number(value).toFixed(2)}`, "Price"] as [string, string]}
                        labelFormatter={(label) => new Date(label).toLocaleDateString()}
                    />
                    <Area
                        type="monotone"
                        dataKey="price"
                        stroke={color}
                        fillOpacity={1}
                        fill="url(#colorPrice)"
                        strokeWidth={2}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
