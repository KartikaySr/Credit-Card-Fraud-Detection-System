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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/inject-transaction`, {
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
    <div className="grids-card p-6 h-full flex flex-col relative overflow-hidden">
      <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-gold to-yellow-200 mb-2">
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
            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all backdrop-blur-sm"
            placeholder="e.g. 5000"
          />
        </div>
        <button type="submit" className="w-full bg-gold hover:bg-gold-light text-black font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-[0_0_15px_rgba(230,197,82,0.3)]">
          <Send size={16} />
          {status || 'Inject Payload'}
        </button>
      </form>
    </div>
  );
}
