'use client';
import React, { useEffect, useState } from 'react';

export default function FeatureHistogram() {
  const [hist, setHist] = useState<number[]>([]);

  useEffect(() => {
    const fetchStream = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/streaming/status`);
        const json = await res.json();
        if (json.feature_histogram) setHist(json.feature_histogram);
      } catch (err) {}
    };
    fetchStream();
    const interval = setInterval(fetchStream, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grids-card p-6 h-[300px] flex flex-col relative overflow-hidden">
      <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-emerald-200 mb-2">
        Feature V14 Distribution
      </h3>
      <p className="text-sm text-gray-400 mb-6">Real-time histogram of the most critical PCA component.</p>
      
      <div className="flex-1 flex items-end gap-1 px-4">
        {hist.map((val, i) => (
          <div 
            key={i} 
            className="flex-1 bg-gradient-to-t from-emerald-500/30 to-emerald-400/60 rounded-t hover:from-gold hover:to-gold-light transition-all duration-500"
            style={{ height: `${val}%` }}
          ></div>
        ))}
      </div>
    </div>
  );
}
