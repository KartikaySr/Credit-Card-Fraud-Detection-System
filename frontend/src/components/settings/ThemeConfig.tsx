'use client';
import React from 'react';
import { Monitor, Moon, Sun } from 'lucide-react';

export default function ThemeConfig() {
  return (
    <div className="glass-card p-6">
      <h3 className="text-xl font-bold text-gray-200 mb-6">Aesthetic Configuration</h3>
      
      <div className="grid grid-cols-3 gap-4">
        <button className="flex flex-col items-center justify-center gap-3 p-4 rounded-xl border border-blue-500/50 bg-blue-500/10 text-blue-400 transition-all hover:bg-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.15)]">
          <Moon size={24} />
          <span className="text-sm font-semibold">Web3 Dark</span>
        </button>

        <button className="flex flex-col items-center justify-center gap-3 p-4 rounded-xl border border-white/5 bg-white/5 text-gray-400 transition-all hover:bg-white/10 opacity-50 cursor-not-allowed">
          <Sun size={24} />
          <span className="text-sm font-semibold">Light Mode</span>
        </button>

        <button className="flex flex-col items-center justify-center gap-3 p-4 rounded-xl border border-white/5 bg-white/5 text-gray-400 transition-all hover:bg-white/10 opacity-50 cursor-not-allowed">
          <Monitor size={24} />
          <span className="text-sm font-semibold">System Match</span>
        </button>
      </div>
    </div>
  );
}
