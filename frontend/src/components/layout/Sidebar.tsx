'use client';
import React from 'react';
import { ShieldCheck, BarChart2, AlertCircle, Settings2, Home, Cpu, Network, Zap, TrendingDown, LogOut, LayoutGrid } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('nexus_session');
    router.push('/');
  };

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
          <SidebarItem href="/dashboard" icon={<Home size={18} />} label="Dashboard" active={pathname === '/dashboard'} />
          <SidebarItem href="/dashboard/alerts" icon={<AlertCircle size={18} />} label="Alerts & Transactions" active={pathname === '/dashboard/alerts'} />
          <SidebarItem href="/dashboard/analytics" icon={<BarChart2 size={18} />} label="AI Analytics (SHAP)" active={pathname === '/dashboard/analytics'} />
          <SidebarItem href="/dashboard/drift" icon={<TrendingDown size={18} />} label="Drift Monitor" active={pathname === '/dashboard/drift'} badge="MLOps" />
        </div>

        <div>
          <div className="px-3 text-xs font-bold text-[var(--text-muted)] mb-2 uppercase tracking-widest">
            Advanced Models
          </div>
          <SidebarItem href="/dashboard/ecosystem" icon={<LayoutGrid size={18} />} label="Module Ecosystem" active={pathname.startsWith('/dashboard/ecosystem')} />
          <SidebarItem href="/dashboard/quantum" icon={<Cpu size={18} />} label="Quantum QNN" active={pathname === '/dashboard/quantum'} />
          <SidebarItem href="/dashboard/federated" icon={<ShieldCheck size={18} />} label="Federated Learning" active={pathname === '/dashboard/federated'} />
          <SidebarItem href="/dashboard/gnn" icon={<Network size={18} />} label="Graph Neural Nets" active={pathname === '/dashboard/gnn'} />
          <SidebarItem href="/dashboard/streaming" icon={<Zap size={18} />} label="Live Streaming" active={pathname === '/dashboard/streaming'} />
        </div>

        <div>
          <div className="px-3 text-xs font-bold text-[var(--text-muted)] mb-2 uppercase tracking-widest">
            Configuration
          </div>
          <SidebarItem href="/dashboard/settings" icon={<Settings2 size={18} />} label="System Config" active={pathname === '/dashboard/settings'} />
        </div>
      </div>

      {/* Logout */}
      <div className="p-3 border-t border-[var(--border-color)]">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[var(--text-muted)] hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

function SidebarItem({
  icon, label, href, active = false, badge
}: {
  icon: React.ReactNode; label: string; href: string; active?: boolean; badge?: string;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2 mt-1 rounded-lg text-sm cursor-pointer transition-all duration-200 ${
        active
          ? 'bg-white/10 text-white shadow-sm border border-white/5 font-semibold backdrop-blur-md'
          : 'text-[var(--text-muted)] hover:bg-white/5 hover:text-gray-200'
      }`}
    >
      <span className={active ? 'text-blue-400' : ''}>{icon}</span>
      <span className="flex-1">{label}</span>
      {badge && (
        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/20">
          {badge}
        </span>
      )}
    </Link>
  );
}
