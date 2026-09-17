'use client';
import React, { useEffect, useState } from 'react';
import { Save } from 'lucide-react';

export default function SimulationControls() {
  const [speed, setSpeed] = useState(1);
  const [threshold, setThreshold] = useState(0.85);
  const [status, setStatus] = useState('');

  useEffect(() => {
    // Initial fetch
    const fetchSettings = async () => {
      try {
        // Assume alerts status also gives current threshold/speed roughly, but we can just let user override.
      } catch (err) {}
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setStatus('Saving...');
    try {
      const res = await fetch('http://localhost:8000/api/v1/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sim_speed: speed, risk_threshold: threshold })
      });
      if (res.ok) {
        setStatus('Saved');
        setTimeout(() => setStatus(''), 2000);
      } else {
        setStatus('Error');
      }
    } catch (err) {
      setStatus('Failed');
    }
  };

  return (
    <div className="glass-card p-6 col-span-1 md:col-span-2">
      <h3 className="text-xl font-bold text-gray-200 mb-6">Engine Controls</h3>
      
      <div className="space-y-8">
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm text-gray-400 font-semibold">Simulation Speed Multiplier</label>
            <span className="text-blue-400 font-mono">{speed}x</span>
          </div>
          <input 
            type="range" 
            min="0.1" 
            max="5" 
            step="0.1" 
            value={speed}
            onChange={(e) => setSpeed(parseFloat(e.target.value))}
            className="w-full accent-blue-500"
          />
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm text-gray-400 font-semibold">Global Risk Threshold</label>
            <span className="text-rose-400 font-mono">{threshold.toFixed(2)}</span>
          </div>
          <input 
            type="range" 
            min="0.5" 
            max="0.99" 
            step="0.01" 
            value={threshold}
            onChange={(e) => setThreshold(parseFloat(e.target.value))}
            className="w-full accent-rose-500"
          />
        </div>

        <button 
          onClick={handleSave}
          className="w-full py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white font-semibold transition-all flex items-center justify-center gap-2"
        >
          <Save size={18} />
          {status || 'Apply Global Settings'}
        </button>
      </div>
    </div>
  );
}
