'use client';
import React, { useEffect, useState } from 'react';

export default function EdgeHeatmap() {
  const [heatmap, setHeatmap] = useState<number[]>([]);

  useEffect(() => {
    const fetchGNN = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/gnn/status`);
        const json = await res.json();
        if (json.edge_heatmap) setHeatmap(json.edge_heatmap);
      } catch (err) {}
    };
    fetchGNN();
    const interval = setInterval(fetchGNN, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-card p-6 h-[300px] flex flex-col relative overflow-hidden">
      <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-500 mb-2">
        Anomalous Edge Heatmap
      </h3>
      <p className="text-sm text-gray-400 mb-6">Matrix of interaction frequencies highlighting unusual edge weights.</p>
      
      <div className="flex-1 grid grid-cols-6 grid-rows-4 gap-1 p-2 bg-black/20 rounded-xl border border-white/5">
        {heatmap.length === 0 && <div className="col-span-6 flex items-center justify-center text-gray-500">Loading...</div>}
        {heatmap.map((intensity, i) => {
          const isHot = intensity > 0.85;
          const bg = isHot ? 'bg-rose-500' : intensity > 0.5 ? 'bg-emerald-500' : 'bg-white/10';
          
          return (
            <div 
              key={i} 
              className={`rounded-sm ${bg} transition-all duration-1000 hover:scale-110 hover:shadow-[0_0_10px_rgba(255,255,255,0.5)]`}
              style={{ opacity: isHot ? 1 : 0.2 + (intensity * 0.5) }}
            ></div>
          );
        })}
      </div>
    </div>
  );
}
