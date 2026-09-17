'use client';
import React, { useEffect, useState } from 'react';

export default function VelocityChart() {
  const [history, setHistory] = useState<number[]>(Array(20).fill(1000));
  const [current, setCurrent] = useState<number>(0);

  useEffect(() => {
    const fetchVelocity = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/v1/alerts/status');
        const data = await res.json();
        if (data.tps) setCurrent(data.tps);
        if (data.velocity_history) setHistory(data.velocity_history);
      } catch (err) {}
    };
    
    fetchVelocity();
    const interval = setInterval(fetchVelocity, 2000);
    return () => clearInterval(interval);
  }, []);

  const maxVal = Math.max(...history, 1500);

  return (
    <div className="glass-card p-6 h-[400px] flex flex-col relative overflow-hidden group">
      <div className="flex justify-between items-start z-10">
        <div>
          <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-400">
            Transaction Velocity
          </h3>
          <p className="text-sm text-gray-400">TPS (Transactions Per Second)</p>
        </div>
        <div className="text-3xl font-mono text-blue-400 animate-pulse">{current}</div>
      </div>
      
      <div className="flex-1 flex items-end gap-1 mt-6 z-10">
        {history.map((val, i) => {
          const height = (val / maxVal) * 100;
          return (
            <div 
              key={i} 
              className="flex-1 bg-gradient-to-t from-blue-600/50 to-indigo-400/80 rounded-t hover:opacity-80 transition-opacity"
              style={{ height: `${Math.max(10, height)}%`, transition: 'height 1s ease-in-out' }}
            ></div>
          );
        })}
      </div>
    </div>
  );
}
