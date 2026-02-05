'use client';

import {
    Bar,
    CartesianGrid,
    ComposedChart,
    Legend,
    Line,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';

interface HistoricalValuationChartProps {
    data: {
        date: string;
        grahamNumber: number;
        price: number;
    }[];
}

export default function HistoricalValuationChart({ data }: HistoricalValuationChartProps) {
    if (!data || data.length === 0) return null;

    // Sort data chronologically just in case
    const sortedData = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Format years (e.g., '2023')
    const formattedData = sortedData.map(item => ({
        year: new Date(item.date).getFullYear().toString(),
        "Graham Value": parseFloat(item.grahamNumber.toFixed(2)),
        "Market Price": parseFloat(item.price.toFixed(2))
    }));

    return (
        <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={formattedData} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                    <XAxis
                        dataKey="year"
                        stroke="#94a3b8"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        stroke="#94a3b8"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#0f172a',
                            borderColor: 'rgba(255,255,255,0.1)',
                            borderRadius: '8px',
                            color: '#e2e8f0'
                        }}
                        itemStyle={{ color: '#e2e8f0' }}
                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    />
                    <Legend wrapperStyle={{ paddingTop: '10px' }} />
                    <Bar
                        dataKey="Graham Value"
                        fill="#10b981"
                        radius={[4, 4, 0, 0]}
                        barSize={40}
                        opacity={0.8}
                    />
                    <Line
                        type="monotone"
                        dataKey="Market Price"
                        stroke="#3b82f6"
                        strokeWidth={3}
                        dot={{ fill: '#3b82f6', r: 4 }}
                    />
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    );
}
