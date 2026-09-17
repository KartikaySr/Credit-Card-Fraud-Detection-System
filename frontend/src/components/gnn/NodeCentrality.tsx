'use client';
import React, { useEffect, useState } from 'react';

export default function NodeCentrality() {
  const [nodes, setNodes] = useState<any[]>([]);

  useEffect(() => {
    const fetchGNN = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/v1/gnn/status');
        const json = await res.json();
        if (json.central_nodes) setNodes(json.central_nodes);
      } catch (err) {}
    };
    fetchGNN();
    const interval = setInterval(fetchGNN, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-card p-6 h-full min-h-[300px]">
      <h3 className="text-lg font-bold text-gray-200 mb-4">Eigenvector Centrality</h3>
      <p className="text-sm text-gray-400 mb-6">Top nodes by influence score.</p>
      
      <div className="space-y-4">
        {nodes.length === 0 && <div className="text-gray-500 text-sm">Loading...</div>}
        {nodes.map((node, i) => (
          <div key={i} className="flex flex-col gap-2 p-3 bg-white/5 rounded-lg border border-white/5 transition-all">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-gray-200">{node.id}</span>
              <span className="text-xs px-2 py-1 bg-black/40 rounded text-gray-400">{node.type}</span>
            </div>
            <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-1000"
                style={{ width: `${node.score * 100}%` }}
              ></div>
            </div>
            <div className="text-right text-xs font-mono text-cyan-400">{node.score.toFixed(3)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
