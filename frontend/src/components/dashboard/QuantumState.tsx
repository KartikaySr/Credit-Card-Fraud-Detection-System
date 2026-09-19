'use client';
import React, { useEffect, useState } from 'react';

export default function QuantumState() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/quantum/status`);
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
    <div className="grids-card p-6 min-h-[200px] flex items-center justify-center animate-pulse">
      <span className="text-gray-400">Booting QNN Co-Processor...</span>
    </div>
  );

  return (
    <div className="grids-card p-6 h-full">
      <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-yellow-200 mb-2 flex items-center gap-2">
        ⚛️ Quantum State
      </h3>
      <p className="text-sm text-gray-400 mb-4">{data.processor}</p>
      <div className="space-y-4">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-300">Qubits Active</span>
          <span className="font-mono text-gold-light">{data.metrics.qubits_active}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-300">Entanglement Coherence</span>
          <span className="font-mono text-emerald-400">{data.metrics.entanglement_coherence}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-300">Quantum Advantage</span>
          <span className="font-mono text-gray-200">{data.metrics.quantum_advantage}</span>
        </div>
      </div>
    </div>
  );
}
