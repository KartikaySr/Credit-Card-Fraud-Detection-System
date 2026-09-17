'use client';
import React, { useState } from 'react';
import { Send } from 'lucide-react';

export default function TransactionInjector() {
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('');
  
  const inject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;
    
    setStatus('Injecting...');
    try {
      const res = await fetch('http://localhost:8000/api/v1/inject-transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: parseFloat(amount) })
      });
      if (res.ok) {
        setStatus('Payload Injected!');
        setTimeout(() => setStatus(''), 2000);
      } else {
        setStatus('Error');
      }
    } catch (err) {
      setStatus('Failed to connect');
    }
    
    setAmount('');
  };

  return (
    <div className="glass-card p-6 h-full flex flex-col relative overflow-hidden">
      <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-400 mb-2">
        Test Vector Injector
      </h3>
      <p className="text-sm text-gray-400 mb-6">Manually inject a transaction into the live stream.</p>
      
      <form onSubmit={inject} className="space-y-4 flex-1 flex flex-col justify-center relative z-10">
        <div>
          <label className="block text-xs font-semibold text-gray-400 mb-1 uppercase tracking-wider">Amount ($)</label>
          <input 
            type="number" 
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all backdrop-blur-sm"
            placeholder="e.g. 5000"
          />
        </div>
        <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-900/20">
          <Send size={16} />
          {status || 'Inject Payload'}
        </button>
      </form>
    </div>
  );
}
