'use client';
import React, { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';

export default function RoundTracker() {
  const [data, setData] = useState({ round: 42, updates: 14, stragglers: 2 });
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const fetchFed = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/v1/federated/status');
        const json = await res.json();
        setData({ round: json.current_round, updates: json.updates_received, stragglers: json.stragglers });
      } catch (err) {}
    };
    fetchFed();
    const interval = setInterval(fetchFed, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const pInterval = setInterval(() => {
      setProgress(p => (p + 2) % 100);
    }, 1000);
    return () => clearInterval(pInterval);
  }, []);

  return (
    <div className="glass-card p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-200">Current Round</h3>
          <p className="text-sm text-gray-400">Round {data.round} of 150</p>
        </div>
        <RefreshCw className="text-blue-400 animate-spin-slow" size={20} />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs text-gray-400 font-semibold uppercase tracking-wider">
          <span>Aggregation Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden border border-white/5">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-teal-400 transition-all duration-1000 ease-linear"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
      
      <div className="mt-6 pt-4 border-t border-white/10 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Local Updates Rx:</span>
          <span className="text-gray-200 font-mono">{data.updates} / 20</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Stragglers:</span>
          <span className="text-rose-400 font-mono">{data.stragglers}</span>
        </div>
      </div>
    </div>
  );
}
