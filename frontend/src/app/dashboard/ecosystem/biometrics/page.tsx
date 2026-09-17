'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Activity, ShieldCheck, AlertTriangle, Fingerprint, MousePointer2 } from 'lucide-react';
import Link from 'next/link';

interface BiometricResult {
  bot_probability: number;
  keystroke_anomaly_score: number;
  mouse_velocity_variance: number;
  verdict: 'HUMAN' | 'BOT';
}

export default function BiometricsPage() {
  const [isTracking, setIsTracking] = useState(false);
  const [mouseEvents, setMouseEvents] = useState<number>(0);
  const [lastResult, setLastResult] = useState<BiometricResult | null>(null);
  const [history, setHistory] = useState<number[]>(Array(20).fill(0));
  
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isTracking) return;

    let eventCount = 0;
    const handleMouseMove = () => {
      eventCount++;
      setMouseEvents(prev => prev + 1);
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Send payload every 2 seconds
    const interval = setInterval(async () => {
      try {
        // Only send if there was actual movement to save requests
        if (eventCount > 0) {
          const res = await fetch('http://localhost:8000/api/v1/intelligence/biometrics', {
            method: 'POST',
          });
          const data: BiometricResult = await res.json();
          setLastResult(data);
          
          setHistory(prev => {
            const newHistory = [...prev.slice(1), data.bot_probability * 100];
            return newHistory;
          });
        }
        eventCount = 0; // reset
      } catch (err) {}
    }, 2000);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(interval);
    };
  }, [isTracking]);

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard/ecosystem" className="text-gray-400 hover:text-white transition-colors">
          ← Back to Ecosystem
        </Link>
      </div>

      <header className="flex justify-between items-end border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Activity className="text-purple-400 w-8 h-8" />
            <h1 className="text-3xl font-bold text-white">Behavioral Biometrics</h1>
          </div>
          <p className="text-gray-400">Continuous authentication via keystroke dynamics and mouse velocity tracking.</p>
        </div>
        <button 
          onClick={() => setIsTracking(!isTracking)}
          className={`px-6 py-2 rounded-full font-bold transition-all shadow-lg ${isTracking ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/20' : 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-600/20'}`}
        >
          {isTracking ? 'Stop Tracking' : 'Start Tracking Session'}
        </button>
      </header>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Tracker Arena */}
        <div className="lg:col-span-2 space-y-6">
          <div 
            ref={containerRef}
            className="glass-card h-[400px] rounded-2xl border border-white/10 relative overflow-hidden flex flex-col items-center justify-center cursor-crosshair group bg-[#0a0a0a]"
          >
            {/* Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
            
            {!isTracking ? (
              <div className="text-center z-10 p-8 glass-card rounded-2xl border border-white/5 bg-black/60">
                <MousePointer2 className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Tracking Inactive</h3>
                <p className="text-gray-400 max-w-sm text-sm">Click "Start Tracking Session" and move your mouse around this arena to generate behavioral payload vectors.</p>
              </div>
            ) : (
              <div className="text-center z-10 pointer-events-none">
                <div className="w-48 h-48 rounded-full border border-purple-500/30 flex items-center justify-center animate-[spin_4s_linear_infinite]">
                  <div className="w-32 h-32 rounded-full border border-blue-500/30 animate-[spin_3s_linear_infinite_reverse]"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-mono text-purple-400 font-bold bg-black/50 px-3 py-1 rounded">
                    CAPTURING VECTORS
                  </span>
                </div>
              </div>
            )}
            
            {/* Status indicators */}
            <div className="absolute bottom-4 left-4 font-mono text-xs text-gray-500">
              Captured Events: <span className="text-white">{mouseEvents}</span>
            </div>
          </div>

          {/* Real-time Chart Simulation */}
          <div className="glass-card h-[200px] rounded-2xl border border-white/10 p-6 flex flex-col">
            <h3 className="text-sm font-bold text-gray-300 mb-4">Bot Probability Timeline</h3>
            <div className="flex-1 flex items-end gap-1">
              {history.map((val, i) => (
                <div 
                  key={i} 
                  className={`flex-1 rounded-t-sm transition-all duration-300 ${val > 70 ? 'bg-red-500' : val > 40 ? 'bg-yellow-500' : 'bg-emerald-500'}`}
                  style={{ height: `${Math.max(5, val)}%` }}
                ></div>
              ))}
            </div>
          </div>
        </div>

        {/* Live Analysis Panel */}
        <div className="glass-card rounded-2xl border border-white/10 p-6 flex flex-col bg-black/40">
          <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
            <Fingerprint className="text-purple-400 w-6 h-6" />
            <h2 className="text-xl font-bold text-white">Live Inference</h2>
          </div>

          {!lastResult ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-500 text-sm">
              <Activity className="w-8 h-8 mb-2 opacity-50" />
              Waiting for telemetry...
            </div>
          ) : (
            <div className="space-y-6 animate-fade-in">
              <div className={`text-center p-6 rounded-xl border bg-black/50 backdrop-blur-md shadow-xl transition-colors duration-500
                ${lastResult.verdict === 'BOT' ? 'border-red-500/50 shadow-red-500/20' : 'border-emerald-500/50 shadow-emerald-500/20'}
              `}>
                <p className="text-sm text-gray-400 mb-2">Current Verdict</p>
                <h3 className={`text-4xl font-black tracking-widest ${lastResult.verdict === 'BOT' ? 'text-red-500' : 'text-emerald-500'}`}>
                  {lastResult.verdict}
                </h3>
              </div>

              <div className="space-y-4">
                <MetricRow 
                  label="Bot Probability" 
                  value={`${(lastResult.bot_probability * 100).toFixed(1)}%`} 
                  isWarning={lastResult.bot_probability > 0.7}
                />
                <MetricRow 
                  label="Keystroke Anomaly" 
                  value={lastResult.keystroke_anomaly_score.toFixed(1)} 
                  isWarning={lastResult.keystroke_anomaly_score > 75}
                />
                <MetricRow 
                  label="Mouse Velocity Variance" 
                  value={lastResult.mouse_velocity_variance.toFixed(1)} 
                  isWarning={lastResult.mouse_velocity_variance < 10} // Bots have low variance (too smooth)
                />
              </div>

              {lastResult.verdict === 'BOT' && (
                <div className="mt-4 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex gap-3">
                  <AlertTriangle className="shrink-0 w-4 h-4" />
                  <p>Non-human interaction patterns detected. Movement vectors lack typical human jitter. Step-up authentication recommended.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MetricRow({ label, value, isWarning }: { label: string, value: string, isWarning: boolean }) {
  return (
    <div className="flex justify-between items-center p-3 rounded-lg bg-white/5 border border-white/5">
      <span className="text-sm text-gray-400">{label}</span>
      <span className={`font-mono font-bold ${isWarning ? 'text-red-400' : 'text-white'}`}>{value}</span>
    </div>
  );
}
