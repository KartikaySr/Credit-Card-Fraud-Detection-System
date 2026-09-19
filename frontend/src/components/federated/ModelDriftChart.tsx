'use client';
import React, { useEffect, useState } from 'react';

export default function ModelDriftChart() {
  const [drift, setDrift] = useState<number[]>([0.1, 0.2, 0.3]);

  useEffect(() => {
    const fetchFed = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/federated/status`);
        const json = await res.json();
        if (json.drift_history) setDrift(json.drift_history);
      } catch (err) {}
    };
    fetchFed();
    const interval = setInterval(fetchFed, 4000);
    return () => clearInterval(interval);
  }, []);

  // Generate SVG path dynamically
  const width = 100;
  const height = 50;
  const step = width / (drift.length - 1 || 1);
  const maxD = Math.max(...drift, 0.5);
  
  const points = drift.map((val, i) => {
    const x = i * step;
    const y = height - ((val / maxD) * height * 0.8);
    return `${x},${y}`;
  });
  
  // Smooth curve through points (simplified)
  let dPath = `M 0,${height} `;
  if (points.length > 0) {
    dPath = `M ${points[0].replace(',', ' ')} `;
    for (let i = 1; i < points.length; i++) {
      const [prevX, prevY] = points[i-1].split(',').map(Number);
      const [currX, currY] = points[i].split(',').map(Number);
      const cX = (prevX + currX) / 2;
      dPath += `Q ${cX} ${prevY} ${currX} ${currY} `;
    }
  }

  const fillPath = `${dPath} L 100 50 L 0 50 Z`;

  return (
    <div className="grids-card p-6 h-[300px] flex flex-col relative overflow-hidden">
      <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-emerald-200 mb-2">
        Global vs Local Model Drift
      </h3>
      <p className="text-sm text-gray-400 mb-6">Weight divergence tracking across recent federation rounds.</p>
      
      <div className="flex-1 relative w-full h-full">
        <svg className="w-full h-full overflow-visible" viewBox="0 0 100 50" preserveAspectRatio="none">
          <line x1="0" y1="25" x2="100" y2="25" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
          
          <path 
            d={dPath} 
            fill="none" 
            stroke="#34d399" 
            strokeWidth="2"
            className="drop-shadow-[0_0_8px_rgba(52,211,153,0.5)] transition-all duration-1000"
          />
          <path 
            d={fillPath} 
            fill="url(#drift-gradient)" 
            className="transition-all duration-1000"
          />
          
          <defs>
            <linearGradient id="drift-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(52,211,153,0.2)" />
              <stop offset="100%" stopColor="rgba(52,211,153,0)" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}
