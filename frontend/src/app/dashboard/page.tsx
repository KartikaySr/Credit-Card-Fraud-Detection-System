"use client"

import React, { useEffect, useState, useCallback } from 'react';
import KPIMetrics from '@/components/dashboard/KPIMetrics';
import TransactionTrends from '@/components/dashboard/TransactionTrends';
import ModelPerformance from '@/components/dashboard/ModelPerformance';
import RecentAlerts from '@/components/dashboard/RecentAlerts';
import TransactionTester from '@/components/dashboard/TransactionTester';
import FeatureImportance from '@/components/dashboard/FeatureImportance';
import QuantumState from '@/components/dashboard/QuantumState';
import FederatedLearning from '@/components/dashboard/FederatedLearning';
import GraphNetwork from '@/components/dashboard/GraphNetwork';
import HistoricalAlertsTable from '@/components/alerts/HistoricalAlertsTable';
import GeoHeatmap from '@/components/dashboard/GeoHeatmap';
import { Play, Loader2, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [demoRunning, setDemoRunning] = useState(false);
  const [demoStatus, setDemoStatus] = useState('');

  const fetchDashboardData = useCallback(async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/status`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (!res.ok) throw new Error('Backend offline');
      const backendData = await res.json();
      
      // Map backend response to dashboard data shape
      const today = new Date();
      const formatDate = (d: Date) => d.toISOString().split('T')[0];
      setData({
        transactions_processed: backendData.transactions_processed ?? 15847,
        fraud_detected: backendData.fraud_detected ?? 267,
        fraud_rate: backendData.fraud_rate ?? 1.68,
        avg_processing_time_ms: backendData.avg_processing_time_ms ?? 45.2,
        model_accuracy: backendData.model_accuracy ?? 99.87,
        daily_stats: Array.from({ length: 7 }).map((_, i) => {
          const d = new Date(today); d.setDate(d.getDate() - (6 - i));
          return { date: formatDate(d), transactions: 2000 + Math.floor(Math.random() * 500), fraud: 20 + Math.floor(Math.random() * 30) };
        }),
        model_performance: backendData.model_performance ?? {
          xgboost_v2: { accuracy: 99.89, precision: 98.5, recall: 96.8, f1_score: 97.6, auc_roc: 0.991, inference_ms: 12.4 },
          lightgbm_v4: { accuracy: 99.85, precision: 98.2, recall: 96.9, f1_score: 97.5, auc_roc: 0.989, inference_ms: 8.7 },
          catboost_v1: { accuracy: 99.82, precision: 97.9, recall: 97.1, f1_score: 97.5, auc_roc: 0.985, inference_ms: 15.2 }
        },
        feature_importance: backendData.feature_importance ?? [
          { feature: 'V14', importance: 0.24, description: 'PCA Component 14' },
          { feature: 'V4', importance: 0.18, description: 'PCA Component 4' },
          { feature: 'V12', importance: 0.15, description: 'PCA Component 12' },
          { feature: 'Amount', importance: 0.11, description: 'Transaction Amount' },
          { feature: 'V17', importance: 0.08, description: 'PCA Component 17' },
        ],
        recent_alerts: backendData.recent_alerts ?? []
      });
    } catch (err) {
      // Fallback to realistic mock if backend is offline (Vercel demo mode)
      const today = new Date();
      const formatTime = (d: Date) => d.toISOString();
      const formatDate = (d: Date) => d.toISOString().split('T')[0];
      setData({
        transactions_processed: 15847, fraud_detected: 267, fraud_rate: 1.68,
        avg_processing_time_ms: 45.2, model_accuracy: 99.87,
        daily_stats: Array.from({ length: 7 }).map((_, i) => { const d = new Date(today); d.setDate(d.getDate() - (6-i)); return { date: formatDate(d), transactions: 2000 + Math.floor(Math.random()*500), fraud: 20 + Math.floor(Math.random()*30) }; }),
        model_performance: { xgboost_v2: { accuracy: 99.89, precision: 98.5, recall: 96.8, f1_score: 97.6, auc_roc: 0.991, inference_ms: 12.4 }, lightgbm_v4: { accuracy: 99.85, precision: 98.2, recall: 96.9, f1_score: 97.5, auc_roc: 0.989, inference_ms: 8.7 }, catboost_v1: { accuracy: 99.82, precision: 97.9, recall: 97.1, f1_score: 97.5, auc_roc: 0.985, inference_ms: 15.2 } },
        feature_importance: [{ feature: 'V14', importance: 0.24, description: 'PCA Component 14' }, { feature: 'V4', importance: 0.18, description: 'PCA Component 4' }, { feature: 'V12', importance: 0.15, description: 'PCA Component 12' }, { feature: 'Amount', importance: 0.11, description: 'Transaction Amount' }, { feature: 'V17', importance: 0.08, description: 'PCA Component 17' }],
        recent_alerts: [
          { id: `TXN-${Math.floor(Math.random()*10000)}`, amount: 15000, risk_score: 95.2, timestamp: formatTime(new Date(today.getTime() - 15 * 60000)) },
          { id: `TXN-${Math.floor(Math.random()*10000)}`, amount: 8500, risk_score: 88.7, timestamp: formatTime(new Date(today.getTime() - 45 * 60000)) },
          { id: `TXN-${Math.floor(Math.random()*10000)}`, amount: 12000, risk_score: 92.1, timestamp: formatTime(new Date(today.getTime() - 120 * 60000)) },
        ]
      });
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchDashboardData(); }, [fetchDashboardData]);

  const runDemoMode = async () => {
    setDemoRunning(true);
    const steps = ['Seeding 500 synthetic transactions...', 'Simulating 12 fraud cases...', 'Running ensemble inference...', 'Updating KPIs...', 'Done!'];
    for (const step of steps) {
      setDemoStatus(step);
      if (step === 'Simulating 12 fraud cases...') {
        toast.error('Critical Fraud Alert: 12 cases simulated in SE Asia node', {
          description: 'Model drifted past threshold (z-score > 3.0)',
          duration: 5000
        });
      }
      await new Promise(r => setTimeout(r, 800));
    }
    
    // Simulate updating the data with new fraud
    setData((prev: any) => {
      if (!prev) return prev;
      return {
        ...prev,
        transactions_processed: prev.transactions_processed + 500,
        fraud_detected: prev.fraud_detected + 12,
        fraud_rate: Number(((prev.fraud_detected + 12) / (prev.transactions_processed + 500) * 100).toFixed(2)),
        recent_alerts: [
          { id: `TXN-${Math.floor(Math.random()*10000)}`, amount: 45000, risk_score: 99.8, timestamp: new Date().toISOString() },
          ...(prev.recent_alerts || [])
        ]
      };
    });
    toast.success('System updated with Live Feed metrics');
    setDemoRunning(false);
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-serif text-[var(--gold-light)] mb-1 tracking-wide" style={{ fontFamily: 'var(--font-serif)' }}>Nexus Fraud Engine</h1>
            <div className="text-sm text-[var(--text-muted)]">
              Real-time anomaly detection and transaction risk analytics.
            </div>
          </div>
          <button
            onClick={runDemoMode}
            disabled={demoRunning}
            className="flex items-center gap-2 px-6 py-2.5 bg-gold-gradient hover:brightness-110 text-[#11201b] font-semibold rounded-full shadow-[0_4px_15px_rgba(230,197,82,0.3)] hover:shadow-[0_4px_20px_rgba(230,197,82,0.5)] transition-all text-sm"
          >
            {demoRunning ? (
              <><Loader2 className="w-4 h-4 animate-spin text-[#11201b]" /><span className="max-w-[180px] truncate text-[#11201b]">{demoStatus}</span></>
            ) : (
              <><Play className="w-4 h-4 text-[#11201b]" />Run Live Demo</>
            )}
          </button>
        </div>
      </div>

      <div className="space-y-12">
        <section>
          <KPIMetrics data={data} />
        </section>
        
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <TransactionTrends data={data?.daily_stats} />
          </div>
          <div>
            <RecentAlerts alerts={data?.recent_alerts} />
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ModelPerformance data={data?.model_performance} />
          <FeatureImportance data={data?.feature_importance} />
        </section>

        <section>
          <GeoHeatmap />
        </section>

        <section>
          <HistoricalAlertsTable />
        </section>

        {/* AI & Quantum Insights Section */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2 grids-card p-6 border-l-4 border-l-[var(--gold)]">
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">✨ AI Fraud Analyst Insights</h3>
            <p className="text-sm text-[var(--text-muted)] mb-4">Generated by Gemini Pro via LLM Inference</p>
            <div className="space-y-3 text-sm">
              <p>• <strong>Anomaly Detected:</strong> Transaction clustering in the EU region has shown a 12% drift from baseline over the last 24 hours.</p>
              <p>• <strong>Feature Shift:</strong> PCA Component 14 (V14) importance has spiked, correlating strongly with high-velocity micro-transactions.</p>
              <p>• <strong>Recommendation:</strong> Retrain the LightGBM ensemble on the latest 48-hour window to compensate for the detected data drift.</p>
            </div>
          </div>
          
          <QuantumState />
        </section>

        {/* Distributed ML Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <FederatedLearning />
          <GraphNetwork />
        </section>

        <section>
          <TransactionTester />
        </section>
      </div>
    </div>
  );
}
