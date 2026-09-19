import React from 'react';
import { Search, ShoppingCart, Bell, Palette } from 'lucide-react';

export default function TopNav() {
  return (
    <div className="h-20 border-b border-[var(--border-color)] bg-[var(--background)] px-8 flex items-center justify-between sticky top-0 z-20">
      
      {/* Left: Search Bar */}
      <div className="relative w-96">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={16} className="text-[var(--text-muted)]" />
        </div>
        <input
          type="text"
          className="bg-[var(--card-bg)] border border-[var(--border-color)] text-white text-sm rounded-full focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)] block w-full pl-10 p-2.5 placeholder-[var(--text-muted)] transition-all outline-none"
          placeholder="Search items, customers, or repairs..."
        />
      </div>

      {/* Right: Live Rates & Icons */}
      <div className="flex items-center gap-6">
        
        {/* Live Rates */}
        <div className="flex items-center gap-4 text-xs font-semibold tracking-wide">
          <span className="text-[var(--text-muted)]">LIVE RATES</span>
          <div className="flex items-center gap-1 text-[var(--gold-light)]">
            <span>24K</span>
            <span className="text-white">245.50</span>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
          </div>
          <div className="flex items-center gap-1 text-[var(--gold-light)]">
            <span>22K</span>
            <span className="text-white">225.10</span>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
          </div>
          <div className="flex items-center gap-1 text-[var(--gold-light)]">
            <span>18K</span>
            <span className="text-white">184.20</span>
            <svg className="w-3 h-3 text-[var(--status-red)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
          </div>
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-4 text-[var(--text-muted)]">
          <button className="hover:text-white transition-colors relative">
            <ShoppingCart size={20} />
          </button>
          <button className="hover:text-white transition-colors relative">
            <Bell size={20} />
            <span className="absolute top-0 right-0 w-2 h-2 bg-[var(--gold-light)] rounded-full border-2 border-[var(--background)]"></span>
          </button>
          <button className="hover:text-white transition-colors relative">
            <Palette size={20} />
          </button>
        </div>

      </div>
    </div>
  );
}
