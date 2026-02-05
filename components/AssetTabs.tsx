'use client';

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter, useSearchParams } from 'next/navigation';

export default function AssetTabs() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentTab = searchParams.get('tab') || 'stocks';

    const handleTabChange = (value: string) => {
        const params = new URLSearchParams(searchParams);
        params.set('tab', value);
        params.delete('ticker');
        router.push(`/?${params.toString()}`);
    };

    return (
        <div className="mb-8 flex justify-center">
            <Tabs value={currentTab} onValueChange={handleTabChange} className="w-full max-w-[600px]">
                <TabsList className="grid w-full grid-cols-4 bg-slate-900/50 backdrop-blur border border-white/5">
                    <TabsTrigger value="stocks">Stocks</TabsTrigger>
                    <TabsTrigger value="bonds">Bonds</TabsTrigger>
                    <TabsTrigger value="indices">Indices</TabsTrigger>
                    <TabsTrigger value="commodities">Market</TabsTrigger>
                </TabsList>
            </Tabs>
        </div>
    );
}
