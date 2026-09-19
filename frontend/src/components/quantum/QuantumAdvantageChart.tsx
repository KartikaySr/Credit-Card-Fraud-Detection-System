'use client';
import React from 'react';

export default function QuantumAdvantageChart() {
  return (
    <div className="grids-card p-6 h-full min-h-[350px] flex flex-col relative overflow-hidden">
      <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-yellow-200 mb-2">
        Quantum vs Classical AUC Advantage
      </h3>
      <p className="text-sm text-gray-400 mb-6">Comparing performance of QNN vs LightGBM base models.</p>
      
      <div className="flex-1 relative w-full h-full mt-4">
        {/* Mock Line Chart Using SVG */}
        <svg className="w-full h-full overflow-visible" viewBox="0 0 100 50" preserveAspectRatio="none">
          {/* Grid lines */}
          <line x1="0" y1="25" x2="100" y2="25" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
          <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
          
          {/* Classical Model (Flat/Slightly increasing) */}
          <path 
            d="M 0 35 Q 25 32 50 30 T 100 28" 
            fill="none" 
            stroke="rgba(255,255,255,0.3)" 
            strokeWidth="1.5"
            strokeDasharray="4 2"
          />
          
          {/* Quantum Model (Sharp increase) */}
          <path 
            d="M 0 40 C 30 40, 40 10, 100 5" 
            fill="none" 
            stroke="url(#gradient)" 
            strokeWidth="2"
            className="drop-shadow-lg"
          />
          
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#e6c552" />
              <stop offset="100%" stopColor="#efcd55" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      
      <div className="flex gap-6 mt-4">
        <div className="flex items-center gap-2 text-sm">
          <div className="w-3 h-3 rounded-full bg-gold"></div>
          <span className="text-gray-300">Hybrid QNN (AUC 0.992)</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className="w-3 h-3 rounded-full border border-gray-400 border-dashed"></div>
          <span className="text-gray-500">Classical (AUC 0.978)</span>
        </div>
      </div>
    </div>
  );
}
