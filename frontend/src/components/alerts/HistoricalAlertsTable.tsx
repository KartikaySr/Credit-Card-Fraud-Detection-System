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
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/alerts/status`, {
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        const data = await res.json();
        if (data.recent_alerts) setAlerts(data.recent_alerts);
      } catch (err) {
        // Fallback to mock data if backend is offline
        const today = new Date();
        const formatTime = (d: Date) => d.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
        setAlerts([
          { id: 'TXN-8472', amount: '$15,000.00', risk: 'High', score: '95.2', time: formatTime(new Date(today.getTime() - 15 * 60000)) },
          { id: 'TXN-9124', amount: '$8,500.00', risk: 'Medium', score: '88.7', time: formatTime(new Date(today.getTime() - 45 * 60000)) },
          { id: 'TXN-1058', amount: '$12,000.00', risk: 'High', score: '92.1', time: formatTime(new Date(today.getTime() - 120 * 60000)) },
          { id: 'TXN-3391', amount: '$2,450.00', risk: 'Low', score: '12.4', time: formatTime(new Date(today.getTime() - 180 * 60000)) },
          { id: 'TXN-8821', amount: '$45,000.00', risk: 'High', score: '99.8', time: formatTime(new Date(today.getTime() - 240 * 60000)) },
        ]);
      }
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
    <div className="grids-card p-6 h-[400px] flex flex-col tutorial-ledger">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h3 className="text-2xl font-bold tracking-wider nexus-glow-text">
          Historical Fraud Ledger
        </h3>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64 group">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-[var(--gold)] transition-colors" />
            <input 
              type="text" 
              placeholder="Search TXN ID or Amount..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black/20 border border-white/5 rounded-xl py-2.5 pl-9 pr-4 text-sm text-gray-200 focus:outline-none focus:border-[var(--gold)] focus:ring-1 focus:ring-[var(--gold)] transition-all duration-300"
            />
          </div>
          <div className="relative group">
            <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-[var(--gold)] transition-colors" />
            <select 
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="appearance-none bg-black/20 border border-white/5 rounded-xl py-2.5 pl-9 pr-10 text-sm text-gray-200 focus:outline-none focus:border-[var(--gold)] focus:ring-1 focus:ring-[var(--gold)] transition-all duration-300 cursor-pointer"
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
        <table className="w-full text-sm text-left border-separate border-spacing-y-2">
          <thead className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest sticky top-0 backdrop-blur-md z-10 bg-[var(--card-bg)]">
            <tr>
              <th className="px-4 py-3 font-semibold">Txn ID</th>
              <th className="px-4 py-3 font-semibold">Time</th>
              <th className="px-4 py-3 font-semibold">Amount</th>
              <th className="px-4 py-3 font-semibold">Risk Level</th>
              <th className="px-4 py-3 font-semibold">Score</th>
            </tr>
          </thead>
          <tbody>
            {alerts.length === 0 && <tr><td colSpan={5} className="text-center py-8 text-[var(--text-muted)] tracking-widest text-xs uppercase animate-pulse">Loading live ledger...</td></tr>}
            {filteredAlerts.length === 0 && alerts.length > 0 && (
              <tr><td colSpan={5} className="text-center py-8 text-[var(--text-muted)] tracking-widest text-xs uppercase">No transactions match your filters.</td></tr>
            )}
            {filteredAlerts.map((row, i) => (
              <tr key={i} className="group hover:bg-white-[0.02] transition-colors duration-300">
                <td className="px-4 py-4 font-mono text-gray-300 group-hover:text-white transition-colors">{row.id}</td>
                <td className="px-4 py-4 text-[var(--text-muted)]">{row.time}</td>
                <td className="px-4 py-4 font-bold text-gray-200 group-hover:text-gold transition-colors">{row.amount}</td>
                <td className="px-4 py-4">
                  <span className={`px-3 py-1.5 rounded-md text-[11px] font-bold tracking-wider border transition-all duration-300 ${
                    row.risk === 'High' ? 'bg-red-500/10 text-[#ff4a4a] border-red-500/20 shadow-[0_0_10px_rgba(255,74,74,0.15)] animate-pulse-slow' :
                    row.risk === 'Medium' ? 'bg-yellow-500/10 text-[var(--gold)] border-yellow-500/20 shadow-[0_0_10px_rgba(230,197,82,0.1)]' :
                    'bg-green-500/10 text-[#00f076] border-green-500/20'
                  }`}>
                    {row.risk}
                  </span>
                </td>
                <td className="px-4 py-4 text-[var(--text-muted)] font-mono">{row.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
