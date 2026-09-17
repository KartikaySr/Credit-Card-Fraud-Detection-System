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

function MetricCard({ title, value, trend, trendColor = "text-[var(--text-muted)]" }: { title: string, value: string, trend: string, trendColor?: string }) {
  return (
    <div className="notion-card p-4">
      <div className="text-sm text-[var(--text-muted)] mb-1">{title}</div>
      <div className="text-2xl font-semibold mb-1">{value}</div>
      <div className={`text-xs ${trendColor} font-medium`}>{trend}</div>
    </div>
  );
}
