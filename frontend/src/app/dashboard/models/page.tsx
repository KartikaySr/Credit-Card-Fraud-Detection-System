'use client';
import React, { useState, useEffect } from 'react';
import { FlaskConical, Play, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

const mockData = {
  lightgbm: {
    accuracy: 99.85,
    latency: 8.7,
    falsePositives: 42,
    flagged: 129
  },
  xgboost: {
    accuracy: 99.89,
    latency: 12.4,
    falsePositives: 18,
    flagged: 154
  }
};

export default function ABTestPage() {
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<any>(null);

  const startTest = () => {
    setRunning(true);
    setProgress(0);
    setResults(null);
    
    let current = 0;
    const interval = setInterval(() => {
      current += 5;
      setProgress(current);
      if (current >= 100) {
        clearInterval(interval);
        setRunning(false);
        setResults(mockData);
      }
    }, 150);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center gap-3">
          <FlaskConical className="w-8 h-8 text-blue-500" /> Model A/B Testing
        </h1>
        <p className="text-gray-400 mt-2">Run live traffic through multiple models in shadow mode to compare accuracy, precision, and latency.</p>
      </div>

      <div className="glass-card p-6 border border-white/10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h3 className="font-semibold text-lg">Live Shadow Test</h3>
            <p className="text-sm text-gray-400">Target: 10,000 synthetic live transactions</p>
          </div>
          <button 
            onClick={startTest}
            disabled={running}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 text-white font-semibold rounded-lg flex items-center gap-2 transition-colors"
          >
            {running ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Running...</> : <><Play className="w-4 h-4" /> Start A/B Test</>}
          </button>
        </div>
        
        {running && (
          <div className="mt-6 space-y-2">
            <div className="flex justify-between text-xs text-gray-400">
              <span>Pumping stream...</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-indigo-500 transition-all duration-150 ease-linear"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {results && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Model A */}
          <div className="glass-card p-6 border-t-4 border-t-emerald-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-full">CHAMPION</span>
            </div>
            <h2 className="text-xl font-bold mb-4">Model A: XGBoost_v2</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-white/5">
                <span className="text-gray-400">Accuracy</span>
                <span className="font-mono text-emerald-400 font-bold">{results.xgboost.accuracy}%</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-white/5">
                <span className="text-gray-400">Inference Latency</span>
                <span className="font-mono text-yellow-400">{results.xgboost.latency}ms</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-white/5">
                <span className="text-gray-400">False Positives</span>
                <span className="font-mono">{results.xgboost.falsePositives}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Total Flagged</span>
                <span className="font-mono">{results.xgboost.flagged}</span>
              </div>
            </div>
          </div>

          {/* Model B */}
          <div className="glass-card p-6 border-t-4 border-t-gray-500 opacity-80">
            <h2 className="text-xl font-bold mb-4">Model B: LightGBM_v4</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-white/5">
                <span className="text-gray-400">Accuracy</span>
                <span className="font-mono text-gray-300 font-bold">{results.lightgbm.accuracy}%</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-white/5">
                <span className="text-gray-400">Inference Latency</span>
                <span className="font-mono text-emerald-400">{results.lightgbm.latency}ms</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-white/5">
                <span className="text-gray-400">False Positives</span>
                <span className="font-mono text-rose-400">{results.lightgbm.falsePositives}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Total Flagged</span>
                <span className="font-mono">{results.lightgbm.flagged}</span>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-lg flex gap-3 text-sm text-rose-200">
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
              <p>Model B rejected due to 233% higher False Positive rate, despite faster inference latency.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
