'use client';
import React, { useEffect, useState } from 'react';

export default function EntanglementMatrix() {
  const [matrix, setMatrix] = useState<number[][]>([]);

  useEffect(() => {
    const fetchMatrix = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/quantum/status`);
        const data = await res.json();
        if (data.entanglement_matrix) setMatrix(data.entanglement_matrix);
      } catch (err) {}
    };
    fetchMatrix();
    const interval = setInterval(fetchMatrix, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-card p-6 h-[400px] flex flex-col relative overflow-hidden group">
      <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500 mb-2 z-10">
        Qubit Entanglement Matrix
      </h3>
      <p className="text-sm text-gray-400 mb-4 z-10">Live correlations across the 64-qubit array.</p>
      
      <div className="flex-1 grid grid-cols-8 grid-rows-8 gap-1 p-2 bg-black/40 rounded-xl border border-white/5 relative z-10 backdrop-blur-sm">
        {matrix.length > 0 ? matrix.flatMap((row, i) => row.map((val, j) => {
          const isHot = val > 0.8;
          const bg = isHot ? 'bg-pink-500' : val > 0.4 ? 'bg-purple-500' : 'bg-white/10';
          return (
            <div 
              key={`${i}-${j}`} 
              className={`rounded-sm ${bg} transition-all duration-1000`}
              style={{ opacity: isHot ? 1 : 0.2 + (val * 0.5) }}
            ></div>
          );
        })) : <div className="col-span-8 row-span-8 flex items-center justify-center text-gray-500">Loading Matrix...</div>}
      </div>
    </div>
  );
}
