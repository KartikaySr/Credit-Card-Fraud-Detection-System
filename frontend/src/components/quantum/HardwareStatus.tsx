'use client';
import React, { useEffect, useState } from 'react';
import { Activity, Thermometer, Zap } from 'lucide-react';

export default function HardwareStatus() {
  const [hw, setHw] = useState({ cryo_temp: 15.0, gate_fidelity: 99.9, t1_relaxation: 50.0 });

  useEffect(() => {
    const fetchHw = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/v1/quantum/status');
        const data = await res.json();
        if (data.hardware) setHw(data.hardware);
      } catch (err) {}
    };
    fetchHw();
    const interval = setInterval(fetchHw, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-card p-6 h-full flex flex-col">
      <h3 className="text-lg font-bold text-gray-200 mb-6">Hardware Telemetry</h3>
      
      <div className="flex-1 space-y-6">
        <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
              <Thermometer size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-400">Cryo-Temperature</p>
              <p className="text-xl font-mono text-gray-200">{hw.cryo_temp} mK</p>
            </div>
          </div>
          <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></div>
        </div>

        <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400">
              <Zap size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-400">Avg Gate Fidelity</p>
              <p className="text-xl font-mono text-gray-200">{hw.gate_fidelity}%</p>
            </div>
          </div>
          <div className="h-2 w-2 rounded-full bg-purple-500 animate-pulse"></div>
        </div>

        <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-pink-500/20 rounded-lg text-pink-400">
              <Activity size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-400">T1 Relaxation Time</p>
              <p className="text-xl font-mono text-gray-200">{hw.t1_relaxation} μs</p>
            </div>
          </div>
          <div className="h-2 w-2 rounded-full bg-pink-500 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
