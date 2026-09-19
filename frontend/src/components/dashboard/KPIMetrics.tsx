import React from 'react';
import { useCurrency } from '@/components/currency/CurrencyProvider';

interface KPIData {
  transactions_processed: number;
  fraud_detected: number;
  fraud_rate: number;
  avg_processing_time_ms: number;
  model_accuracy: number;
}

export default function KPIMetrics({ data }: { data: KPIData | null }) {
  const { formatCurrency } = useCurrency();

  if (!data) return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="nexus-glass p-6 h-[140px] animate-pulse flex flex-col justify-between">
          <div className="h-3 bg-white/5 rounded w-1/2"></div>
          <div className="h-10 bg-white/5 rounded w-3/4"></div>
          <div className="h-3 bg-white/5 rounded w-full mt-2"></div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
      <MetricCard 
        title="Total Transactions" 
        value={data.transactions_processed.toLocaleString()} 
        trend="+2.3%" 
      />
      <MetricCard 
        title="Fraud Detected" 
        value={data.fraud_detected.toLocaleString()} 
        trend={`${data.fraud_rate.toFixed(2)}%`}
        trendColor="text-[var(--status-red)]"
      />
      <MetricCard 
        title="Avg Response Time" 
        value={`${data.avg_processing_time_ms.toFixed(1)}ms`} 
        trend="-5.2ms"
        trendColor="text-[var(--status-green)]"
      />
      <MetricCard 
        title="Model Accuracy" 
        value={`${data.model_accuracy.toFixed(2)}%`} 
        trend="+0.03%" 
      />
      <MetricCard 
        title="Fraud Prevented" 
        value={formatCurrency(2400000, true)} 
        trend={`+${formatCurrency(340000, true)}`} 
      />
    </div>
  );
}

function MetricCard({ title, value, trend, trendColor = "text-[var(--status-green)]" }: { title: string, value: string, trend: string, trendColor?: string }) {
  const isPositive = trend.includes('+') || trendColor.includes('green');
  return (
    <div className="nexus-glass p-6 flex flex-col justify-between group cursor-default">
      <div className="text-[10px] tracking-widest uppercase text-[var(--text-muted)] font-bold mb-4 drop-shadow-sm">{title}</div>
      <div className="text-4xl font-black mb-3 nexus-glow-text tracking-tighter group-hover:scale-[1.02] transition-transform duration-300 origin-left">{value}</div>
      <div className="flex items-center gap-1.5 text-xs font-semibold">
        {isPositive ? (
           <svg className="w-3.5 h-3.5 text-[var(--status-green)] drop-shadow-[0_0_8px_rgba(0,240,118,0.6)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
        ) : (
           <svg className="w-3.5 h-3.5 text-[var(--status-red)] drop-shadow-[0_0_8px_rgba(255,74,74,0.6)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
        )}
        <span className={`${trendColor} drop-shadow-md`}>{trend}</span>
        <span className="text-[var(--text-muted)] ml-1 opacity-70 group-hover:opacity-100 transition-opacity">vs last week</span>
      </div>
    </div>
  );
}
