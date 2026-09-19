'use client';
import React, { useEffect, useState } from 'react';
import { Database, HardDrive, Activity } from 'lucide-react';

export default function KafkaHealth() {
  const [health, setHealth] = useState({ cpu: 42, jvm_mem: 78, consumer_lag: 1.2 });

  useEffect(() => {
    const fetchStream = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/streaming/status`);
        const json = await res.json();
        if (json.kafka_health) setHealth(json.kafka_health);
      } catch (err) {}
    };
    fetchStream();
    const interval = setInterval(fetchStream, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grids-card p-6 h-full flex flex-col">
      <h3 className="text-lg font-bold text-gray-200 mb-6">Cluster Health</h3>
      
      <div className="flex-1 space-y-6">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-400 flex items-center gap-2"><Database size={16} /> Broker CPU</span>
            <span className="text-emerald-400 font-mono">{health.cpu}%</span>
          </div>
          <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-400 transition-all duration-1000" style={{ width: `${health.cpu}%` }}></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-400 flex items-center gap-2"><HardDrive size={16} /> JVM Memory</span>
            <span className="text-amber-400 font-mono">{health.jvm_mem}%</span>
          </div>
          <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
            <div className="h-full bg-amber-400 transition-all duration-1000" style={{ width: `${health.jvm_mem}%` }}></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-400 flex items-center gap-2"><Activity size={16} /> Consumer Lag</span>
            <span className="text-rose-400 font-mono">{health.consumer_lag}s</span>
          </div>
          <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
            <div className="h-full bg-rose-400 transition-all duration-1000" style={{ width: `${Math.min(100, health.consumer_lag * 30)}%` }}></div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between">
        <span className="text-xs text-gray-500 uppercase tracking-widest">Status</span>
        <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded text-xs font-bold uppercase">Healthy</span>
      </div>
    </div>
  );
}
