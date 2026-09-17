'use client';
import React from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';

export default function LocalShap() {
  return (
    <div className="glass-card p-6">
      <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-amber-600 mb-2">
        Local SHAP Explanation
      </h3>
      <p className="text-sm text-gray-400 mb-6">Waterfall plot explaining why TXN-9021 was flagged as high risk (Score 99.1).</p>
      
      <div className="space-y-3 bg-black/20 p-6 rounded-xl border border-white/5 relative">
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/10 -translate-x-1/2"></div>
        
        {/* Base value */}
        <div className="flex justify-between items-center relative z-10 text-gray-500 text-sm">
          <span>Base Value: 0.05</span>
        </div>

        {/* Positive push (Fraud) */}
        <div className="flex items-center relative z-10">
          <div className="w-1/2 pr-4 text-right"></div>
          <div className="w-1/2 pl-4 flex items-center">
            <div className="w-32 h-6 bg-rose-500/20 border border-rose-500/50 flex items-center justify-start px-2 text-rose-400 text-xs font-mono shadow-[0_0_10px_rgba(244,63,94,0.2)]">
              +0.42 (V14)
              <ArrowRight size={12} className="ml-2" />
            </div>
          </div>
        </div>

        <div className="flex items-center relative z-10">
          <div className="w-1/2 pr-4 text-right"></div>
          <div className="w-1/2 pl-4 flex items-center">
            <div className="w-24 h-6 ml-32 bg-rose-500/20 border border-rose-500/50 flex items-center justify-start px-2 text-rose-400 text-xs font-mono">
              +0.21 (V4)
            </div>
          </div>
        </div>

        {/* Negative push (Clean) */}
        <div className="flex items-center relative z-10">
          <div className="w-1/2 pr-4 flex justify-end">
             <div className="w-16 h-6 -mr-[6.5rem] bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-end px-2 text-emerald-400 text-xs font-mono z-20">
              <ArrowLeft size={12} className="mr-2" />
              -0.12 (Amount)
            </div>
          </div>
          <div className="w-1/2 pl-4"></div>
        </div>

        {/* Final value */}
        <div className="flex justify-between items-center relative z-10 text-gray-200 font-bold mt-4 pt-4 border-t border-white/10">
          <span>Final Output: 0.991 (High Risk)</span>
        </div>
      </div>
    </div>
  );
}
