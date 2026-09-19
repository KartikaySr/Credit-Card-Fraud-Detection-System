import React from 'react';

interface KPIData {
  transactions_processed: number;
  fraud_detected: number;
  fraud_rate: number;
  avg_processing_time_ms: number;
  model_accuracy: number;
}

export default function KPIMetrics({ data }: { data: KPIData | null }) {
  if (!data) return <div className="animate-pulse h-24 bg-[var(--sidebar-hover)] rounded-md"></div>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
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
        value="$2.4M" 
        trend="+$340K" 
      />
    </div>
  );
}

function MetricCard({ title, value, trend, trendColor = "text-[var(--status-green)]" }: { title: string, value: string, trend: string, trendColor?: string }) {
  const isPositive = trend.includes('+') || trendColor.includes('green');
  return (
    <div className="grids-card p-6 flex flex-col justify-between">
      <div className="text-xs tracking-wider uppercase text-[var(--text-muted)] font-semibold mb-3">{title}</div>
      <div className="text-3xl font-bold mb-3">{value}</div>
      <div className="flex items-center gap-1 text-xs">
        {isPositive ? (
           <svg className="w-3 h-3 text-[var(--status-green)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
        ) : (
           <svg className="w-3 h-3 text-[var(--status-red)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
        )}
        <span className={`${trendColor} font-medium`}>{trend}</span>
        <span className="text-[var(--text-muted)] ml-1">vs last week</span>
      </div>
    </div>
  );
}
