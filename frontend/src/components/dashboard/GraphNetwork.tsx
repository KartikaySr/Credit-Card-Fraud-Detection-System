'use client';
import React, { useEffect, useState } from 'react';

export default function GraphNetwork() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/gnn/status`);
        const json = await res.json();
        setData(json);
      } catch (e) {
        console.error("Failed to fetch gnn status", e);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!data) return (
    <div className="grids-card p-6 min-h-[200px] flex items-center justify-center animate-pulse">
      <span className="text-gray-400">Loading Graph Topology...</span>
    </div>
  );

  return (
    <div className="grids-card p-6 border-l-4 border-gold">
      <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-yellow-200 mb-2 flex items-center gap-2">
        🕸️ Graph Neural Network
      </h3>
      <p className="text-sm text-gray-400 mb-4">Transaction Topology Analysis</p>
      <div className="space-y-4">
        <div className="flex justify-between items-center text-sm">
          <span>Network Size</span>
          <span className="font-semibold">{data.network_size.nodes.toLocaleString()} Nodes</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span>Transaction Edges</span>
          <span className="font-semibold">{data.network_size.edges.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-300">Anomalous Sub-graphs</span>
          <span className="font-mono text-rose-400">{data.anomalous_subgraphs_detected} Detected</span>
        </div>
        <div className="text-xs text-gray-400 pt-2 border-t border-white/5">
          GAT Attention Heads: {data.attention_heads_active}
        </div>
      </div>
    </div>
  );
}
