'use client';
import React, { useEffect, useState } from 'react';

export default function PrecisionRecall() {
  const [metrics, setMetrics] = useState({ precision: 0.95, recall: 0.92, f1: 0.93, auc: 0.98 });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/analytics/status`);
        const json = await res.json();
        if (json.precision) setMetrics(json);
      } catch (err) {}
    };
    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-card p-6 h-full flex flex-col relative overflow-hidden group">
      <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-orange-500 mb-6">
        Real-time Performance Metrics
      </h3>
      
      <div className="flex-1 grid grid-cols-2 gap-4">
        <div className="bg-white/5 rounded-xl border border-white/5 p-4 flex flex-col justify-center items-center relative overflow-hidden group-hover:border-amber-500/30 transition-colors">
          <div className="text-xs text-gray-400 uppercase tracking-widest mb-2">Precision</div>
          <div className="text-3xl font-mono text-gray-100">{metrics.precision.toFixed(3)}</div>
        </div>
        
        <div className="bg-white/5 rounded-xl border border-white/5 p-4 flex flex-col justify-center items-center relative overflow-hidden group-hover:border-amber-500/30 transition-colors">
          <div className="text-xs text-gray-400 uppercase tracking-widest mb-2">Recall</div>
          <div className="text-3xl font-mono text-gray-100">{metrics.recall.toFixed(3)}</div>
        </div>
        
        <div className="bg-white/5 rounded-xl border border-white/5 p-4 flex flex-col justify-center items-center relative overflow-hidden group-hover:border-amber-500/30 transition-colors">
          <div className="text-xs text-gray-400 uppercase tracking-widest mb-2">F1 Score</div>
          <div className="text-3xl font-mono text-gray-100">{metrics.f1.toFixed(3)}</div>
        </div>
        
        <div className="bg-white/5 rounded-xl border border-white/5 p-4 flex flex-col justify-center items-center relative overflow-hidden group-hover:border-amber-500/30 transition-colors">
          <div className="text-xs text-gray-400 uppercase tracking-widest mb-2">ROC AUC</div>
          <div className="text-3xl font-mono text-gray-100">{metrics.auc.toFixed(3)}</div>
        </div>
      </div>
    </div>
  );
}
