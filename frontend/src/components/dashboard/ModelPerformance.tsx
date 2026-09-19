import React from 'react';

export default function ModelPerformance({ data }: { data: any | null }) {
  if (!data) return null;

  const models = Object.keys(data);

  return (
    <div className="mt-8 mb-8">
      <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-yellow-200 mb-4">Model Performance</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {models.map(model => (
          <div key={model} className="grids-card p-4">
            <h4 className="font-medium text-sm text-gold uppercase tracking-wider mb-4 border-b border-white/5 pb-2">{model}</h4>
            <div className="space-y-3">
              <MetricRow label="Accuracy" value={`${data[model].accuracy.toFixed(2)}%`} />
              <MetricRow label="F1 Score" value={`${data[model].f1_score.toFixed(2)}%`} />
              <MetricRow label="AUC ROC" value={data[model].auc_roc.toFixed(3)} />
              <MetricRow label="Inference Time (p95)" value={`${data[model].inference_ms.toFixed(1)}ms`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MetricRow({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-gray-400">{label}</span>
      <span className="font-mono text-gray-200">{value}</span>
    </div>
  );
}
