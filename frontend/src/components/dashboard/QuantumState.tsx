'use client';
import React, { useEffect, useState } from 'react';

export default function QuantumState() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/v1/quantum/status');
        const json = await res.json();
        setData(json);
      } catch (e) {
        console.error("Failed to fetch quantum status", e);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!data) return (
    <div className="notion-card p-6 bg-gradient-to-br from-[var(--card-bg)] to-[var(--sidebar-hover)] min-h-[200px] flex items-center justify-center animate-pulse">
      <span className="text-[var(--text-muted)]">Booting QNN Co-Processor...</span>
    </div>
  );

  return (
    <div className="notion-card p-6 bg-gradient-to-br from-[var(--card-bg)] to-[var(--sidebar-hover)]">
      <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">⚛️ Quantum State</h3>
      <p className="text-sm text-[var(--text-muted)] mb-4">{data.processor}</p>
      <div className="space-y-4">
        <div className="flex justify-between items-center text-sm">
          <span>Qubits Active</span>
          <span className="font-semibold text-[var(--highlight)]">{data.metrics.qubits_active}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span>Entanglement Coherence</span>
          <span className="font-semibold text-[var(--status-green)]">{data.metrics.entanglement_coherence}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span>Quantum Advantage</span>
          <span className="font-semibold">{data.metrics.quantum_advantage}</span>
        </div>
      </div>
    </div>
  );
}
