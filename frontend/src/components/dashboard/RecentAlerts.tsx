import React from 'react';

export default function RecentAlerts({ alerts }: { alerts: any[] | undefined }) {
  if (!alerts) return null;

  return (
    <div className="mt-8 mb-8 flex flex-col">
      <div className="grids-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-gold to-yellow-200 tracking-wide">
            Recent Alerts
          </h3>
          <div className="flex items-center space-x-4">
            <a href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/export/csv`} download="fraud_report.csv" className="px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-xs font-semibold text-gray-300 transition-colors">
              Export CSV
            </a>
            <div className="flex items-center space-x-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              <span className="text-xs text-gray-400 uppercase tracking-widest font-semibold">Live Feed</span>
            </div>
          </div>
        </div>

        <div className="glass-scroll overflow-x-auto overflow-y-auto max-h-[400px] rounded-lg border border-white/5">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="glass-table-header sticky top-0 z-10 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-300 tracking-wider">ID</th>
                <th className="px-6 py-4 font-semibold text-gray-300 tracking-wider">Amount</th>
                <th className="px-6 py-4 font-semibold text-gray-300 tracking-wider">Risk Score</th>
                <th className="px-6 py-4 font-semibold text-gray-300 tracking-wider">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {alerts.map((alert, i) => {
                const isHighRisk = alert.risk_score > 90;
                const isMediumRisk = alert.risk_score > 70 && alert.risk_score <= 90;
                
                let scoreColor = "text-emerald-400";
                let badgeBg = "bg-emerald-400/10 border-emerald-400/20";
                
                if (isHighRisk) {
                  scoreColor = "text-rose-400";
                  badgeBg = "bg-rose-400/10 border-rose-400/20";
                } else if (isMediumRisk) {
                  scoreColor = "text-amber-400";
                  badgeBg = "bg-amber-400/10 border-amber-400/20";
                }

                return (
                  <tr key={i} className="hover:bg-white/5 transition-all duration-300 ease-in-out group">
                    <td className="px-6 py-4 font-medium text-gray-200">{alert.id}</td>
                    <td className="px-6 py-4 text-gray-300">${alert.amount.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border shadow-sm backdrop-blur-md ${badgeBg} ${scoreColor}`}>
                        {alert.risk_score.toFixed(1)}/100
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400 group-hover:text-gray-300 transition-colors">
                      {new Date(alert.timestamp).toLocaleString(undefined, {
                        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
