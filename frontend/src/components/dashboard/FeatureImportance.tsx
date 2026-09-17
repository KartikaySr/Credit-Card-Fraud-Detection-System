import React from 'react';

export default function FeatureImportance({ data }: { data: any[] | undefined }) {
  if (!data) return null;

  return (
    <div className="mt-8 mb-8">
      <h3 className="text-lg font-semibold mb-4">Feature Importance (SHAP Values)</h3>
      <div className="notion-card p-6">
        <div className="space-y-4">
          {data.map((item, i) => (
            <div key={i} className="flex flex-col gap-1">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{item.feature} <span className="text-[var(--text-muted)] font-normal ml-2">— {item.description}</span></span>
                <span className="text-[var(--text-muted)]">{(item.importance * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-[var(--border-color)] h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-[var(--highlight)] h-full" 
                  style={{ width: `${item.importance * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
