'use client';
import React, { useEffect, useState } from 'react';

export default function LiveFeed() {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const fetchStream = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/v1/streaming/status');
        const json = await res.json();
        if (json.logs) setLogs(json.logs);
      } catch (err) {}
    };
    fetchStream();
    const interval = setInterval(fetchStream, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-card p-6 h-[300px] flex flex-col">
      <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-rose-500 mb-4">
        Streaming Event Log
      </h3>
      
      <div className="flex-1 bg-black/40 rounded-lg p-4 font-mono text-xs overflow-hidden border border-white/5 space-y-2 relative">
        {/* Fading gradient at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/80 to-transparent pointer-events-none"></div>
        
        {logs.length === 0 && <div className="text-gray-500">Connecting to stream...</div>}
        {logs.map((log, i) => (
          <div key={i} className={`truncate ${log.includes('ANOMALY') ? 'text-rose-400 font-bold' : 'text-emerald-400 opacity-70'}`}>
            {log}
          </div>
        ))}
      </div>
    </div>
  );
}
