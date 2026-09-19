'use client';
import React, { useEffect, useState } from 'react';

export default function FederatedLearning() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/federated/status`);
        const json = await res.json();
        setData(json);
      } catch (e) {
        console.error("Failed to fetch federated status", e);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!data) return (
    <div className="notion-card p-6 min-h-[200px] flex items-center justify-center animate-pulse">
      <span className="text-[var(--text-muted)]">Connecting to Federated Network...</span>
    </div>
  );

  return (
    <div className="notion-card p-6 border-l-4 border-l-[var(--status-blue)]">
      <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">🌐 Federated Network</h3>
      <p className="text-sm text-[var(--text-muted)] mb-4">Decentralized Privacy-Preserving Training</p>
      <div className="space-y-4">
        <div className="flex justify-between items-center text-sm">
          <span>Global Training Round</span>
          <span className="font-semibold text-[var(--status-blue)]">Round {data.current_round}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span>Active Institutions</span>
          <span className="font-semibold">{data.participating_institutions.join(", ")}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span>Global Accuracy</span>
          <span className="font-semibold text-[var(--status-green)]">{data.global_accuracy}%</span>
        </div>
        <div className="text-xs text-[var(--text-muted)] pt-2 border-t border-[var(--border-color)]">
          {data.privacy_mode} Active
        </div>
      </div>
    </div>
  );
}
