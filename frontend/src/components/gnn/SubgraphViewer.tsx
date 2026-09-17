'use client';
import React from 'react';

export default function SubgraphViewer() {
  return (
    <div className="glass-card p-6 h-[400px] flex flex-col relative overflow-hidden group">
      <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-500 mb-2 z-10">
        Fraud Ring Topology
      </h3>
      <p className="text-sm text-gray-400 mb-4 z-10">Identified dense sub-graphs indicating coordinated attacks.</p>
      
      <div className="relative flex-1 w-full h-full flex items-center justify-center">
        {/* Mock Network Nodes */}
        <div className="relative w-48 h-48 animate-[spin_30s_linear_infinite]">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-emerald-400 rounded-full shadow-[0_0_15px_#34d399]"></div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-cyan-400 rounded-full shadow-[0_0_10px_#22d3ee]"></div>
          <div className="absolute top-1/2 left-0 -translate-y-1/2 w-5 h-5 bg-rose-500 rounded-full shadow-[0_0_20px_#f43f5e] animate-pulse"></div>
          <div className="absolute top-1/2 right-0 -translate-y-1/2 w-3 h-3 bg-emerald-500 rounded-full"></div>
          
          {/* Edges */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-50">
            <line x1="50%" y1="0%" x2="0%" y2="50%" stroke="#34d399" strokeWidth="2" />
            <line x1="0%" y1="50%" x2="50%" y2="100%" stroke="#f43f5e" strokeWidth="2" strokeDasharray="4 2" />
            <line x1="50%" y1="100%" x2="100%" y2="50%" stroke="#22d3ee" strokeWidth="1" />
            <line x1="100%" y1="50%" x2="50%" y2="0%" stroke="#34d399" strokeWidth="1" />
            <line x1="50%" y1="0%" x2="50%" y2="100%" stroke="#34d399" strokeWidth="1" opacity="0.3" />
          </svg>
        </div>
      </div>
    </div>
  );
}
