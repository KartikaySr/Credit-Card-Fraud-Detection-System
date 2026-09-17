'use client';
import React, { useEffect, useState } from 'react';

export default function GlobalFeatureImportance() {
  const [features, setFeatures] = useState<any[]>([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/v1/analytics/status');
        const json = await res.json();
        if (json.feature_importance) setFeatures(json.feature_importance);
      } catch (err) {}
    };
    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-card p-6 h-full min-h-[300px]">
      <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-orange-500 mb-2">
        Global Feature Importance
      </h3>
      <p className="text-sm text-gray-400 mb-6">SHAP (SHapley Additive exPlanations) values averaged over recent batch.</p>
      
      <div className="space-y-4">
        {features.length === 0 && <div className="text-gray-500 text-sm">Loading...</div>}
        {features.map((feat, i) => (
          <div key={i} className="flex flex-col gap-1">
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">{feat.name}</span>
              <span className="text-amber-400 font-mono">+{feat.value.toFixed(3)}</span>
            </div>
            <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 to-orange-400"
                style={{ width: `${feat.value * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
