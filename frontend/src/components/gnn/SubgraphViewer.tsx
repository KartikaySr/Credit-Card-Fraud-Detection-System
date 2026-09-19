'use client';
import React from 'react';
import dynamic from 'next/dynamic';

// Force graph requires client-side rendering only
const DynamicForceGraph = dynamic(() => import('./ForceGraph'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
    </div>
  )
});

export default function SubgraphViewer() {
  return (
    <div className="grids-card p-6 h-[500px] flex flex-col relative overflow-hidden group">
      <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-yellow-200 mb-2 z-10">
        Fraud Ring Topology
      </h3>
      <p className="text-sm text-gray-400 mb-4 z-10">Interactive D3 Force-Directed Graph of identified attack vectors. Scroll to zoom, drag to pan.</p>
      
      <div className="relative flex-1 w-full h-full flex items-center justify-center cursor-move">
        <DynamicForceGraph />
      </div>
    </div>
  );
}
