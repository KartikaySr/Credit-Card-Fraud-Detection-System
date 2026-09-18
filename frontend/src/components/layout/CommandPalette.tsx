'use client';
import React, { useEffect, useState } from 'react';
import { Command } from 'cmdk';
import { useRouter } from 'next/navigation';
import { Search, Globe, Activity, Settings, ShieldAlert, PieChart, Sparkles } from 'lucide-react';

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  // Toggle the menu when ⌘K is pressed
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-start justify-center p-4 pt-[15vh]">
      <Command 
        className="w-full max-w-2xl bg-[#0f1115] border border-white/10 rounded-xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        <div className="flex items-center border-b border-white/10 px-4">
          <Search className="w-5 h-5 text-gray-500" />
          <Command.Input 
            placeholder="Type a command or search..." 
            className="flex-1 bg-transparent border-none outline-none text-white px-4 py-4 placeholder-gray-500 text-lg"
            autoFocus
          />
          <button onClick={() => setOpen(false)} className="text-xs text-gray-500 bg-white/5 px-2 py-1 rounded border border-white/10">ESC</button>
        </div>

        <Command.List className="max-h-[60vh] overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          <Command.Empty className="py-6 text-center text-sm text-gray-500">No results found.</Command.Empty>

          <Command.Group heading={<div className="px-2 py-1 text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Navigation</div>}>
            <Command.Item 
              onSelect={() => runCommand(() => router.push('/dashboard'))}
              className="flex items-center px-3 py-3 rounded-lg text-sm text-gray-300 hover:bg-white/5 hover:text-white cursor-pointer data-[selected=true]:bg-white/10 data-[selected=true]:text-white mb-1"
            >
              <Globe className="w-4 h-4 mr-3 text-blue-400" /> Main Dashboard
            </Command.Item>
            <Command.Item 
              onSelect={() => runCommand(() => router.push('/dashboard/analytics'))}
              className="flex items-center px-3 py-3 rounded-lg text-sm text-gray-300 hover:bg-white/5 hover:text-white cursor-pointer data-[selected=true]:bg-white/10 data-[selected=true]:text-white mb-1"
            >
              <PieChart className="w-4 h-4 mr-3 text-amber-500" /> AI Analytics & SHAP
            </Command.Item>
            <Command.Item 
              onSelect={() => runCommand(() => router.push('/dashboard/gnn'))}
              className="flex items-center px-3 py-3 rounded-lg text-sm text-gray-300 hover:bg-white/5 hover:text-white cursor-pointer data-[selected=true]:bg-white/10 data-[selected=true]:text-white mb-1"
            >
              <Activity className="w-4 h-4 mr-3 text-emerald-400" /> Graph Neural Networks
            </Command.Item>
            <Command.Item 
              onSelect={() => runCommand(() => router.push('/dashboard/alerts'))}
              className="flex items-center px-3 py-3 rounded-lg text-sm text-gray-300 hover:bg-white/5 hover:text-white cursor-pointer data-[selected=true]:bg-white/10 data-[selected=true]:text-white mb-1"
            >
              <ShieldAlert className="w-4 h-4 mr-3 text-rose-500" /> Fraud Alerts Ledger
            </Command.Item>
            <Command.Item 
              onSelect={() => runCommand(() => router.push('/dashboard/settings'))}
              className="flex items-center px-3 py-3 rounded-lg text-sm text-gray-300 hover:bg-white/5 hover:text-white cursor-pointer data-[selected=true]:bg-white/10 data-[selected=true]:text-white"
            >
              <Settings className="w-4 h-4 mr-3 text-gray-400" /> System Settings
            </Command.Item>
          </Command.Group>

          <Command.Group heading={<div className="px-2 py-1 text-xs text-gray-500 font-semibold uppercase tracking-wider mt-4 mb-1">Actions</div>}>
            <Command.Item 
              onSelect={() => runCommand(() => {
                const event = new CustomEvent('open-copilot');
                window.dispatchEvent(event);
              })}
              className="flex items-center px-3 py-3 rounded-lg text-sm text-gray-300 hover:bg-indigo-500/10 hover:text-indigo-300 cursor-pointer data-[selected=true]:bg-indigo-500/20 data-[selected=true]:text-indigo-200 mb-1"
            >
              <Sparkles className="w-4 h-4 mr-3 text-indigo-400" /> Ask AI Copilot
            </Command.Item>
          </Command.Group>
        </Command.List>
      </Command>
    </div>
  );
}
