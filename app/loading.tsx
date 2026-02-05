export default function Loading() {
    return (
        <div className="min-h-screen bg-slate-950 p-8 animate-pulse">
            <div className="max-w-[1600px] mx-auto space-y-8">
                {/* Header Skeleton */}
                <div className="flex justify-between items-center mb-12">
                    <div className="h-8 bg-slate-800 rounded w-48"></div>
                    <div className="h-10 bg-slate-800 rounded w-64"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-8">
                    {/* Card 1 Skeleton */}
                    <div className="h-[250px] bg-slate-900/50 rounded-xl border border-white/5 p-6">
                        <div className="h-6 bg-slate-800 rounded w-32 mb-4"></div>
                        <div className="h-10 bg-slate-800 rounded w-24 mb-2"></div>
                        <div className="h-6 bg-slate-800 rounded w-16"></div>
                        <div className="mt-8 space-y-4">
                            <div className="h-4 bg-slate-800 rounded w-full"></div>
                            <div className="h-4 bg-slate-800 rounded w-full"></div>
                            <div className="h-4 bg-slate-800 rounded w-full"></div>
                        </div>
                    </div>

                    {/* Card 2 Skeleton (Gauge) */}
                    <div className="h-[250px] bg-slate-900/50 rounded-xl border border-white/5 p-6 flex flex-col items-center justify-center">
                        <div className="w-32 h-32 rounded-full border-4 border-slate-800"></div>
                        <div className="h-6 bg-slate-800 rounded w-24 mt-4"></div>
                    </div>

                    {/* Card 3 Skeleton */}
                    <div className="h-[250px] bg-slate-900/50 rounded-xl border border-white/5 p-6">
                        <div className="h-6 bg-slate-800 rounded w-32 mb-4"></div>
                        <div className="h-8 bg-slate-800 rounded w-20 mb-4"></div>
                        <div className="h-2 bg-slate-800 rounded w-full mt-2"></div>
                    </div>

                    {/* Card 4 Skeleton */}
                    <div className="h-[250px] bg-slate-900/50 rounded-xl border border-white/5 p-6">
                        <div className="h-6 bg-slate-800 rounded w-32 mb-4"></div>
                        <div className="space-y-4">
                            <div className="h-5 bg-slate-800 rounded w-full"></div>
                            <div className="h-5 bg-slate-800 rounded w-full"></div>
                            <div className="h-5 bg-slate-800 rounded w-full"></div>
                            <div className="h-10 bg-slate-800 rounded w-full mt-2"></div>
                        </div>
                    </div>
                </div>

                {/* Bottom Wide Card Skeleton */}
                <div className="h-[300px] bg-slate-900/50 rounded-xl border border-white/5 p-6 mt-6">
                    <div className="h-6 bg-slate-800 rounded w-48 mb-6"></div>
                    <div className="space-y-4">
                        <div className="h-8 bg-slate-800 rounded w-full"></div>
                        <div className="h-8 bg-slate-800 rounded w-full"></div>
                        <div className="h-8 bg-slate-800 rounded w-full"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
