"use client"

import React, { useState } from 'react';

export default function TransactionTester() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const form = e.target as HTMLFormElement;
      const txId = (form.elements.namedItem('txId') as HTMLInputElement).value;
      const amount = parseFloat((form.elements.namedItem('amount') as HTMLInputElement).value);
      const merchantId = (form.elements.namedItem('merchantId') as HTMLInputElement).value;
      const userId = (form.elements.namedItem('userId') as HTMLInputElement).value;

      const payload = {
        transaction_id: txId,
        amount: amount,
        merchant_id: merchantId,
        user_id: userId,
        transaction_type: "purchase"
      };

      const res = await fetch('http://localhost:8000/api/v1/detect-fraud', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setResult({ is_fraud: false, risk_score: 0, confidence_level: 'Error connecting to API', processing_time_ms: 0 });
    } finally {
      setLoading(false);
    }
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
                  name="txId"
                  defaultValue={`TXN-${Date.now().toString().slice(-6)}`}
                  className="w-full bg-transparent border border-[var(--border-color)] rounded px-3 py-1.5 text-sm focus:outline-none focus:border-[var(--highlight)] transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-muted)] mb-1">Amount ($)</label>
                <input 
                  type="number" 
                  name="amount"
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
                  name="merchantId"
                  defaultValue="MERCH-001"
                  className="w-full bg-transparent border border-[var(--border-color)] rounded px-3 py-1.5 text-sm focus:outline-none focus:border-[var(--highlight)] transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-muted)] mb-1">User ID</label>
                <input 
                  type="text" 
                  name="userId"
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
