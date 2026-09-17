"use client"

import React, { useState } from 'react';

export default function TransactionTester() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call for the mockup
    setTimeout(() => {
      setResult({
        is_fraud: Math.random() > 0.5,
        risk_score: Math.random() * 100,
        confidence_level: "High",
        processing_time_ms: 42.5
      });
      setLoading(false);
    }, 800);
  };

  return (
    <div className="mt-8 mb-16">
      <h3 className="text-lg font-semibold mb-4">Test Transaction</h3>
      
      <div className="notion-card p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-muted)] mb-1">Transaction ID</label>
                <input 
                  type="text" 
                  defaultValue={`TXN-${Date.now().toString().slice(-6)}`}
                  className="w-full bg-transparent border border-[var(--border-color)] rounded px-3 py-1.5 text-sm focus:outline-none focus:border-[var(--highlight)] transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-muted)] mb-1">Amount ($)</label>
                <input 
                  type="number" 
                  defaultValue="150.00"
                  className="w-full bg-transparent border border-[var(--border-color)] rounded px-3 py-1.5 text-sm focus:outline-none focus:border-[var(--highlight)] transition-colors"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-muted)] mb-1">Merchant ID</label>
                <input 
                  type="text" 
                  defaultValue="MERCH-001"
                  className="w-full bg-transparent border border-[var(--border-color)] rounded px-3 py-1.5 text-sm focus:outline-none focus:border-[var(--highlight)] transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-muted)] mb-1">User ID</label>
                <input 
                  type="text" 
                  defaultValue="USER-001"
                  className="w-full bg-transparent border border-[var(--border-color)] rounded px-3 py-1.5 text-sm focus:outline-none focus:border-[var(--highlight)] transition-colors"
                />
              </div>
            </div>
          </div>
          
          <div className="pt-2">
            <button 
              type="submit" 
              disabled={loading}
              className="bg-[var(--foreground)] text-[var(--background)] px-4 py-2 rounded text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? 'Analyzing...' : 'Test Transaction'}
            </button>
          </div>
        </form>

        {result && (
          <div className="mt-6 p-4 border border-[var(--border-color)] rounded bg-[var(--sidebar-hover)] animate-in fade-in zoom-in-95 duration-200">
            <h4 className="font-semibold mb-2">Analysis Result</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="block text-[var(--text-muted)]">Status</span>
                <span className={`font-semibold ${result.is_fraud ? 'text-[var(--status-red)]' : 'text-[var(--status-green)]'}`}>
                  {result.is_fraud ? 'FRAUD DETECTED' : 'LEGITIMATE'}
                </span>
              </div>
              <div>
                <span className="block text-[var(--text-muted)]">Risk Score</span>
                <span className="font-medium">{result.risk_score.toFixed(1)}/100</span>
              </div>
              <div>
                <span className="block text-[var(--text-muted)]">Confidence</span>
                <span className="font-medium">{result.confidence_level}</span>
              </div>
              <div>
                <span className="block text-[var(--text-muted)]">Processing Time</span>
                <span className="font-medium">{result.processing_time_ms}ms</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
