'use client';
import React, { useEffect, useState } from 'react';

export default function HistoricalAlertsTable() {
  const [alerts, setAlerts] = useState<any[]>([]);
  
  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/v1/alerts/status');
        const data = await res.json();
        if (data.recent_alerts) setAlerts(data.recent_alerts);
      } catch (err) {}
    };
    
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-card p-6 h-[400px] flex flex-col">
      <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-400 mb-4">
        Historical Fraud Ledger
      </h3>
      
      <div className="flex-1 overflow-auto glass-scroll pr-2 relative">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-400 uppercase bg-black/40 sticky top-0 backdrop-blur-md z-10">
            <tr>
              <th className="px-4 py-3 rounded-tl-lg">Txn ID</th>
              <th className="px-4 py-3">Time</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Risk Level</th>
              <th className="px-4 py-3 rounded-tr-lg">Score</th>
            </tr>
          </thead>
          <tbody>
            {alerts.length === 0 && <tr><td colSpan={5} className="text-center py-4 text-gray-500">Loading...</td></tr>}
            {alerts.map((row, i) => (
              <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="px-4 py-3 font-mono text-gray-300">{row.id}</td>
                <td className="px-4 py-3 text-gray-400">{row.time}</td>
                <td className="px-4 py-3 font-semibold text-gray-200">{row.amount}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    row.risk === 'High' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                    row.risk === 'Medium' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                    'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}>
                    {row.risk}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-400">{row.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
