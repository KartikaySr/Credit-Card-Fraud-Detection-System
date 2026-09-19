'use client';
import React from 'react';
import { ShieldCheck, BarChart2, AlertCircle, Settings2, Home, Cpu, Network, Zap, TrendingDown, LogOut, LayoutGrid, FileKey } from 'lucide-react';
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
    <aside className="w-[280px] h-[calc(100vh-2rem)] my-4 ml-4 nexus-glass flex flex-col transition-all duration-300 z-10">
      {/* Brand Header */}
      <div className="p-8 flex items-center justify-center border-b border-[var(--border-color)]">
        <h1 className="text-3xl font-bold tracking-[0.2em] nexus-glow-text" style={{ fontFamily: 'var(--font-serif)' }}>
          NEXUS
        </h1>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
        <SidebarItem href="/dashboard" icon={<Home size={18} />} label="Overview" active={pathname === '/dashboard'} />
        <SidebarItem href="/dashboard/alerts" icon={<AlertCircle size={18} />} label="Live Alerts" active={pathname === '/dashboard/alerts'} />
        <SidebarItem href="/dashboard/analytics" icon={<BarChart2 size={18} />} label="Model Analytics" active={pathname === '/dashboard/analytics'} />
        <SidebarItem href="/dashboard/ecosystem" icon={<LayoutGrid size={18} />} label="Module Ecosystem" active={pathname.startsWith('/dashboard/ecosystem')} />
        <SidebarItem href="/dashboard/audit" icon={<FileKey size={18} />} label="Audit Log" active={pathname === '/dashboard/audit'} />
        
        <div className="pt-6 pb-2 px-4">
          <p className="text-[10px] font-bold text-[var(--text-muted)] tracking-widest uppercase">Engine Modules</p>
        </div>
        
        <SidebarItem href="/dashboard/gnn" icon={<Network size={18} />} label="Graph Neural Nets" active={pathname === '/dashboard/gnn'} />
        <SidebarItem href="/dashboard/federated" icon={<ShieldCheck size={18} />} label="Federated Learning" active={pathname === '/dashboard/federated'} />
        <SidebarItem href="/dashboard/drift" icon={<TrendingDown size={18} />} label="Drift Monitor" active={pathname === '/dashboard/drift'} />
        <SidebarItem href="/dashboard/streaming" icon={<Zap size={18} />} label="Data Streams" active={pathname === '/dashboard/streaming'} />
        <SidebarItem href="/dashboard/quantum" icon={<Cpu size={18} />} label="Quantum Nodes" active={pathname === '/dashboard/quantum'} />
        
        <div className="pt-6 pb-2 px-4">
          <p className="text-[10px] font-bold text-[var(--text-muted)] tracking-widest uppercase">System</p>
        </div>
        <SidebarItem href="/dashboard/settings" icon={<Settings2 size={18} />} label="System Config" active={pathname === '/dashboard/settings'} />
      </div>

      {/* Profile / Logout Section (Bottom) */}
      <div className="p-4 mt-auto border-t border-[var(--border-color)]">
        <div className="flex items-center gap-3 px-2 py-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-800 to-gray-700 border border-[var(--border-color)] flex items-center justify-center text-white text-sm font-semibold group-hover:border-gold/50 transition-colors">
            K
          </div>
          <div className="flex flex-col flex-1 overflow-hidden">
            <span className="font-semibold text-sm text-white truncate">Kartikay</span>
            <span className="text-[11px] text-[var(--gold)] tracking-wide font-medium">ML Engineer</span>
          </div>
          <button onClick={(e) => { e.stopPropagation(); handleLogout(); }} className="text-[var(--text-muted)] hover:text-white transition-colors">
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}

function SidebarItem({
  icon, label, href, active = false
}: {
  icon: React.ReactNode; label: string; href: string; active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-300 relative group overflow-hidden ${
        active
          ? 'sidebar-active text-white'
          : 'text-[var(--text-muted)] hover:text-white hover:bg-white/5'
      }`}
    >
      {active && (
        <div className="absolute inset-0 bg-gradient-to-r from-[rgba(230,197,82,0.1)] to-transparent opacity-100" />
      )}
      <span className={`relative z-10 transition-colors duration-300 ${active ? 'text-gold drop-shadow-[0_0_8px_rgba(230,197,82,0.5)]' : 'group-hover:text-gold'}`}>
        {icon}
      </span>
      <span className="flex-1 relative z-10 tracking-wide">{label}</span>
      {active && (
        <div className="w-1.5 h-1.5 rounded-full bg-gold shadow-[0_0_10px_rgba(230,197,82,1)] relative z-10 animate-pulse-slow" />
      )}
    </Link>
  );
}
