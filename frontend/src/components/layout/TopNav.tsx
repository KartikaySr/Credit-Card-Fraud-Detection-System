"use client";

import React from 'react';
import { Search, ShoppingCart, Bell, HelpCircle } from 'lucide-react';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { useTutorial } from '@/components/tutorial/TutorialProvider';

export default function TopNav() {
  const { startTutorial } = useTutorial();

  return (
    <div className="h-20 border-b border-[var(--border-color)] bg-[var(--background)] px-8 flex items-center justify-between sticky top-0 z-20">
      
      {/* Left: Search Bar */}
      <div className="relative w-96 tutorial-search">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={16} className="text-[var(--text-muted)]" />
        </div>
        <input
          type="text"
          className="bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--foreground)] text-sm rounded-full focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)] block w-full pl-10 p-2.5 placeholder-[var(--text-muted)] transition-all outline-none"
          placeholder="Search transactions, alerts, or models..."
        />
      </div>

      {/* Right: Live Rates & Icons */}
      <div className="flex items-center gap-6">
        
        {/* Live Rates */}
        <div className="flex items-center gap-4 text-xs font-semibold tracking-wide tutorial-status hidden md:flex">
          <span className="text-[var(--text-muted)]">SYSTEM STATUS</span>
          <div className="flex items-center gap-1 text-[var(--status-green)]">
            <span className="w-2 h-2 rounded-full bg-[var(--status-green)] animate-pulse"></span>
            <span className="text-[var(--foreground)] ml-1">SECURE</span>
          </div>
          <div className="flex items-center gap-1 text-[var(--text-muted)] ml-2">
            <span>MODEL</span>
            <span className="text-[var(--foreground)]">XGBoost V2</span>
          </div>
          <div className="flex items-center gap-1 text-[var(--text-muted)] ml-2">
            <span>LATENCY</span>
            <span className="text-[var(--foreground)]">45ms</span>
          </div>
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-2 text-[var(--text-muted)]">
          <button 
            onClick={startTutorial}
            className="p-2 hover:text-[var(--gold)] hover:bg-[var(--card-hover)] rounded-full transition-colors relative tutorial-help"
            title="Start Tutorial"
          >
            <HelpCircle size={20} />
          </button>
          <button className="p-2 hover:text-[var(--foreground)] hover:bg-[var(--card-hover)] rounded-full transition-colors relative">
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[var(--gold-light)] rounded-full border-2 border-[var(--background)]"></span>
          </button>
          <ThemeToggle />
        </div>

      </div>
    </div>
  );
}
