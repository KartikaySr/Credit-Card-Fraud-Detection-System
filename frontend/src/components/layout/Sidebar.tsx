'use client';
import React from 'react';
import { ShieldCheck, BarChart2, AlertCircle, Settings2, Home, Activity, Cpu, Network, Zap } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[260px] h-full bg-[var(--sidebar-bg)] border-r border-[var(--border-color)] flex flex-col transition-colors duration-200">
      {/* Workspace Header */}
      <div className="p-4 hover:bg-[var(--sidebar-hover)] cursor-pointer transition-colors flex items-center gap-3 border-b border-[var(--border-color)]">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-blue-500/30">
          K
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-sm truncate">Kartikay's Workspace</span>
          <span className="text-xs text-[var(--text-muted)]">Enterprise ML</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-6 space-y-6">
        <div>
          <div className="px-3 text-xs font-bold text-[var(--text-muted)] mb-2 uppercase tracking-widest">
            Overview
          </div>
          <SidebarItem href="/" icon={<Home size={18} />} label="Dashboard" active={pathname === '/'} />
          <SidebarItem href="/alerts" icon={<AlertCircle size={18} />} label="Alerts & Transactions" active={pathname === '/alerts'} />
          <SidebarItem href="/analytics" icon={<BarChart2 size={18} />} label="AI Analytics (SHAP)" active={pathname === '/analytics'} />
        </div>

        <div>
          <div className="px-3 text-xs font-bold text-[var(--text-muted)] mb-2 uppercase tracking-widest">
            Advanced Models
          </div>
          <SidebarItem href="/quantum" icon={<Cpu size={18} />} label="Quantum QNN" active={pathname === '/quantum'} />
          <SidebarItem href="/federated" icon={<ShieldCheck size={18} />} label="Federated Learning" active={pathname === '/federated'} />
          <SidebarItem href="/gnn" icon={<Network size={18} />} label="Graph Neural Nets" active={pathname === '/gnn'} />
          <SidebarItem href="/streaming" icon={<Zap size={18} />} label="Live Streaming" active={pathname === '/streaming'} />
        </div>

        <div>
          <div className="px-3 text-xs font-bold text-[var(--text-muted)] mb-2 uppercase tracking-widest">
            Configuration
          </div>
          <SidebarItem href="/settings" icon={<Settings2 size={18} />} label="System Config" active={pathname === '/settings'} />
        </div>
      </div>
    </aside>
  );
}

function SidebarItem({ icon, label, href, active = false }: { icon: React.ReactNode; label: string; href: string; active?: boolean }) {
  return (
    <Link href={href} className={`flex items-center gap-3 px-3 py-2 mt-1 rounded-lg text-sm cursor-pointer transition-all duration-200 ${active ? 'bg-white/10 text-white shadow-sm border border-white/5 font-semibold backdrop-blur-md' : 'text-[var(--text-muted)] hover:bg-white/5 hover:text-gray-200'}`}>
      <span className={active ? "text-blue-400" : ""}>{icon}</span>
      <span>{label}</span>
    </Link>
  );
}
