'use client';

import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
            <Card className="max-w-md w-full glass-panel border border-red-500/20 bg-red-500/5">
                <CardHeader className="text-center pb-2">
                    <div className="mx-auto w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
                        <AlertCircle className="w-6 h-6 text-red-500" />
                    </div>
                    <CardTitle className="text-white text-xl">Something went wrong!</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                    <p className="text-slate-400 mb-6">
                        We encountered an unexpected error while generating your analysis.
                        Please check your connection and try again.
                    </p>
                    <button
                        onClick={
                            // Attempt to recover by trying to re-render the segment
                            () => reset()
                        }
                        className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-6 rounded-full transition-colors flex items-center justify-center mx-auto space-x-2"
                    >
                        <RefreshCw className="w-4 h-4" />
                        <span>Try Again</span>
                    </button>
                    {error.digest && (
                        <p className="mt-4 text-xs text-slate-600 font-mono">
                            Error ID: {error.digest}
                        </p>
                    )}
                </CardContent>
            </Card>
            <style jsx global>{`
                .glass-panel {
                    background: rgba(255, 255, 255, 0.03);
                    backdrop-filter: blur(10px);
                    -webkit-backdrop-filter: blur(10px);
                }
            `}</style>
        </div>
    );
}
