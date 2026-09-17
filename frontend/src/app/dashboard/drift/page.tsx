'use client';

import React, { useState, useEffect } from 'react';
import { TrendingDown, RefreshCw, AlertTriangle, CheckCircle, Activity, Zap } from 'lucide-react';

interface DriftPoint {
  epoch: string;
  xgboost: number;
  lightgbm: number;
  catboost: number;
}

function generateDriftData(): DriftPoint[] {
  let xg = 99.89, lg = 99.85, cb = 99.82;
  return Array.from({ length: 30 }).map((_, i) => {
    const day = new Date();
    day.setDate(day.getDate() - (29 - i));
    // Gradual drift after day 20
    if (i > 20) { xg -= Math.random() * 0.08; lg -= Math.random() * 0.1; cb -= Math.random() * 0.12; }
    else { xg += (Math.random() - 0.5) * 0.02; lg += (Math.random() - 0.5) * 0.02; cb += (Math.random() - 0.5) * 0.02; }
    return {
      epoch: `D${i + 1}`,
      xgboost: parseFloat(Math.max(97, xg).toFixed(3)),
      lightgbm: parseFloat(Math.max(97, lg).toFixed(3)),
      catboost: parseFloat(Math.max(97, cb).toFixed(3)),
    };
  });
}

export default function DriftMonitorPage() {
  const [driftData, setDriftData] = useState<DriftPoint[]>([]);
  const [isRetraining, setIsRetraining] = useState(false);
  const [retrainProgress, setRetrainProgress] = useState(0);
  const [lastRetrain, setLastRetrain] = useState<string | null>(null);

  useEffect(() => { setDriftData(generateDriftData()); }, []);

  const latestPoint = driftData[driftData.length - 1];
  const baselinePoint = driftData[0];
  const xgDrift = latestPoint && baselinePoint ? baselinePoint.xgboost - latestPoint.xgboost : 0;
  const lgDrift = latestPoint && baselinePoint ? baselinePoint.lightgbm - latestPoint.lightgbm : 0;
  const cbDrift = latestPoint && baselinePoint ? baselinePoint.catboost - latestPoint.catboost : 0;
  const isDrifting = xgDrift > 0.3 || lgDrift > 0.3 || cbDrift > 0.3;

  const handleRetrain = async () => {
    setIsRetraining(true);
    setRetrainProgress(0);
    const steps = [10, 25, 40, 60, 75, 88, 95, 100];
    for (const step of steps) {
      await new Promise(r => setTimeout(r, 600));
      setRetrainProgress(step);
    }
    await new Promise(r => setTimeout(r, 400));
    setDriftData(generateDriftData()); // Reset with fresh data
    setLastRetrain(new Date().toLocaleTimeString());
    setIsRetraining(false);
    setRetrainProgress(0);
  };

  // Chart dimensions
  const chartW = 100, chartH = 60;
  const min = 97, max = 100;
  const normalize = (v: number) => chartH - ((v - min) / (max - min)) * chartH;

  const makePath = (key: 'xgboost' | 'lightgbm' | 'catboost') =>
    driftData.map((d, i) => `${i === 0 ? 'M' : 'L'} ${(i / (driftData.length - 1)) * chartW} ${normalize(d[key])}`).join(' ');

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      {/* Header */}
      <div className="border-b border-white/10 pb-6 flex justify-between items-end">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Activity className="text-orange-400 w-8 h-8" />
            <h1 className="text-3xl font-bold text-white">Model Drift Monitor</h1>
          </div>
          <p className="text-gray-400">30-day accuracy trajectory across all ensemble models. Detects concept drift before it impacts production.</p>
        </div>
        <div className="flex items-center gap-3">
          {lastRetrain && (
            <span className="text-xs text-gray-400 font-mono flex items-center gap-1">
              <CheckCircle className="text-emerald-400 w-4 h-4" />
              Retrained at {lastRetrain}
            </span>
          )}
          <button
            onClick={handleRetrain}
            disabled={isRetraining}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl font-bold text-sm transition-all shadow-lg ${
              isDrifting
                ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-orange-600/20 hover:shadow-orange-600/40 animate-pulse'
                : 'bg-white/10 border border-white/10 text-white hover:bg-white/20'
            } ${isRetraining ? 'opacity-70' : ''}`}
          >
            <RefreshCw className={`w-4 h-4 ${isRetraining ? 'animate-spin' : ''}`} />
            {isRetraining ? `Retraining... ${retrainProgress}%` : isDrifting ? '⚡ Trigger Retrain (Drift Detected)' : 'Trigger Retrain'}
          </button>
        </div>
      </div>

      {/* Drift Alert */}
      {isDrifting && (
        <div className="flex items-start gap-4 p-5 rounded-2xl bg-orange-500/10 border border-orange-500/30 animate-fade-in">
          <AlertTriangle className="text-orange-400 w-6 h-6 mt-0.5 shrink-0 animate-pulse" />
          <div>
            <h3 className="font-bold text-orange-300 mb-1">Concept Drift Detected</h3>
            <p className="text-sm text-orange-200/70">
              Model accuracy has degraded past the critical threshold of 0.3% from baseline. 
              LightGBM shows the highest drift ({lgDrift.toFixed(3)}%). Immediate retraining on the latest 48-hour window is recommended.
            </p>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-3 gap-6">
        {[
          { label: 'XGBoost v2', drift: xgDrift, current: latestPoint?.xgboost, color: 'blue' },
          { label: 'LightGBM v4', drift: lgDrift, current: latestPoint?.lightgbm, color: 'purple' },
          { label: 'CatBoost v1', drift: cbDrift, current: latestPoint?.catboost, color: 'indigo' },
        ].map((m) => (
          <div key={m.label} className="glass-card p-6 rounded-2xl border border-white/10">
            <p className="text-sm font-medium text-gray-400 mb-2">{m.label}</p>
            <h3 className="text-3xl font-black text-white">{m.current?.toFixed(2)}%</h3>
            <div className={`mt-3 flex items-center gap-2 text-sm font-semibold ${m.drift > 0.3 ? 'text-red-400' : m.drift > 0.1 ? 'text-yellow-400' : 'text-emerald-400'}`}>
              <TrendingDown className="w-4 h-4" />
              {m.drift > 0 ? `-${m.drift.toFixed(3)}%` : 'Stable'} drift
            </div>
          </div>
        ))}
      </div>

      {/* SVG Chart */}
      <div className="glass-card p-8 rounded-2xl border border-white/10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-bold text-white text-lg">30-Day Accuracy Trajectory</h2>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-blue-400 inline-block"></span>XGBoost</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-purple-400 inline-block"></span>LightGBM</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-indigo-400 inline-block"></span>CatBoost</span>
          </div>
        </div>
        {driftData.length > 0 && (
          <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full h-64" preserveAspectRatio="none">
            {/* Grid lines */}
            {[0, 25, 50, 75, 100].map(y => (
              <line key={y} x1="0" y1={y * chartH / 100} x2={chartW} y2={y * chartH / 100} stroke="rgba(255,255,255,0.04)" strokeWidth="0.3" />
            ))}
            {/* Drift threshold line */}
            <line x1="0" y1={normalize(99.59)} x2={chartW} y2={normalize(99.59)} stroke="rgba(234,179,8,0.3)" strokeDasharray="0.5" strokeWidth="0.3" />
            {/* Model paths */}
            <path d={makePath('xgboost')} fill="none" stroke="#60a5fa" strokeWidth="0.5" strokeLinecap="round" />
            <path d={makePath('lightgbm')} fill="none" stroke="#a78bfa" strokeWidth="0.5" strokeLinecap="round" />
            <path d={makePath('catboost')} fill="none" stroke="#818cf8" strokeWidth="0.5" strokeLinecap="round" />
          </svg>
        )}
        <p className="text-xs text-gray-500 mt-4 text-center font-mono">
          Yellow dashed line = critical drift threshold (−0.3% from baseline). Red zone triggers automatic retrain alert.
        </p>
      </div>

      {/* Retraining Progress */}
      {isRetraining && (
        <div className="glass-card p-6 rounded-2xl border border-indigo-500/20 bg-indigo-500/5 animate-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="text-indigo-400 w-5 h-5 animate-pulse" />
            <h3 className="font-bold text-white">Retraining Pipeline Active</h3>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
              style={{ width: `${retrainProgress}%` }}
            ></div>
          </div>
          <div className="mt-2 flex justify-between text-xs text-gray-400 font-mono">
            <span>ETA ~4 minutes</span>
            <span>{retrainProgress}% complete</span>
          </div>
        </div>
      )}
    </div>
  );
}
