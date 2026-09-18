'use client';
import React, { useEffect, useState, useMemo } from 'react';
import { Search, Filter } from 'lucide-react';

export default function HistoricalAlertsTable() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState('All');
  
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

  const filteredAlerts = useMemo(() => {
    return alerts.filter(alert => {
      const matchesSearch = alert.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            alert.amount.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRisk = riskFilter === 'All' || alert.risk === riskFilter;
      return matchesSearch && matchesRisk;
    });
  }, [alerts, searchTerm, riskFilter]);

  return (
    <div className="glass-card p-6 h-[500px] flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-400">
          Historical Fraud Ledger
        </h3>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search TXN ID or Amount..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-lg py-2 pl-9 pr-4 text-sm text-gray-300 focus:outline-none focus:border-indigo-500/50 transition-colors"
            />
          </div>
          <div className="relative">
            <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <select 
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="appearance-none bg-black/40 border border-white/10 rounded-lg py-2 pl-9 pr-8 text-sm text-gray-300 focus:outline-none focus:border-indigo-500/50 transition-colors cursor-pointer"
            >
              <option value="All">All Risks</option>
              <option value="High">High Risk</option>
              <option value="Medium">Medium Risk</option>
              <option value="Low">Low Risk</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto glass-scroll pr-2 relative">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-400 uppercase bg-black/60 sticky top-0 backdrop-blur-md z-10">
            <tr>
              <th className="px-4 py-3 rounded-tl-lg">Txn ID</th>
              <th className="px-4 py-3">Time</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Risk Level</th>
              <th className="px-4 py-3 rounded-tr-lg">Score</th>
            </tr>
          </thead>
          <tbody>
            {alerts.length === 0 && <tr><td colSpan={5} className="text-center py-8 text-gray-500">Loading live ledger...</td></tr>}
            {filteredAlerts.length === 0 && alerts.length > 0 && (
              <tr><td colSpan={5} className="text-center py-8 text-gray-500">No transactions match your filters.</td></tr>
            )}
            {filteredAlerts.map((row, i) => (
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
