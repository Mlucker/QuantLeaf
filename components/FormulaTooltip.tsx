'use client';

import { Info } from 'lucide-react';
import { useState } from 'react';

interface FormulaTooltipProps {
    formula: string;
    description: string;
    inputs?: { label: string; value: string | number }[];
    children?: React.ReactNode;
}

export default function FormulaTooltip({ formula, description, inputs, children }: FormulaTooltipProps) {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <div
            className="relative inline-flex items-center group"
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
        >
            {children || <Info className="w-4 h-4 text-slate-500 hover:text-emerald-400 cursor-help transition-colors ml-2" />}

            {/* Tooltip Popup */}
            <div className={`
                absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 
                bg-slate-900 border border-slate-700 rounded-lg shadow-xl 
                p-4 z-50 transition-all duration-200 pointer-events-none
                ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
            `}>
                {/* Arrow */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-8 border-transparent border-t-slate-900" />

                <div className="space-y-3">
                    <div>
                        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Formula</div>
                        <code className="text-emerald-400 text-sm font-mono block bg-slate-950/50 p-1.5 rounded border border-emerald-500/20">
                            {formula}
                        </code>
                    </div>

                    <div className="text-slate-300 text-xs leading-relaxed">
                        {description}
                    </div>

                    {inputs && inputs.length > 0 && (
                        <div className="pt-2 border-t border-slate-800">
                            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Inputs Used</div>
                            <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                                {inputs.map((input, idx) => (
                                    <div key={idx} className="flex justify-between text-xs">
                                        <span className="text-slate-500">{input.label}:</span>
                                        <span className="text-slate-200 font-medium">{input.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
