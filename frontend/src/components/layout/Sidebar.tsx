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
    <aside className="w-[260px] h-full bg-[var(--sidebar-bg)] border-r border-[var(--border-color)] flex flex-col transition-colors duration-200">
      {/* Brand Header */}
      <div className="p-6 flex items-center">
        <h1 className="text-2xl font-bold tracking-wider" style={{ fontFamily: 'var(--font-serif)' }}>
          GRIDS
        </h1>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-8">
        <div>
          <SidebarItem href="/dashboard" icon={<Home size={18} />} label="Dashboard" active={pathname === '/dashboard'} />
          <SidebarItem href="/dashboard/alerts" icon={<AlertCircle size={18} />} label="Point of Sale" active={pathname === '/dashboard/alerts'} />
          <SidebarItem href="/dashboard/analytics" icon={<BarChart2 size={18} />} label="Customers" active={pathname === '/dashboard/analytics'} />
          <SidebarItem href="/dashboard/ecosystem" icon={<LayoutGrid size={18} />} label="Inventory" active={pathname.startsWith('/dashboard/ecosystem')} />
          <SidebarItem href="/dashboard/audit" icon={<FileKey size={18} />} label="Repairs" active={pathname === '/dashboard/audit'} />
          <SidebarItem href="/dashboard/gnn" icon={<Network size={18} />} label="HR & Payroll" active={pathname === '/dashboard/gnn'} />
          <SidebarItem href="/dashboard/federated" icon={<ShieldCheck size={18} />} label="Manufacturing" active={pathname === '/dashboard/federated'} />
          <SidebarItem href="/dashboard/drift" icon={<TrendingDown size={18} />} label="Memo Mgmt" active={pathname === '/dashboard/drift'} />
          <SidebarItem href="/dashboard/streaming" icon={<Zap size={18} />} label="Analytics & Targets" active={pathname === '/dashboard/streaming'} />
          <SidebarItem href="/dashboard/quantum" icon={<Cpu size={18} />} label="Integrations" active={pathname === '/dashboard/quantum'} />
          <SidebarItem href="/dashboard/settings" icon={<Settings2 size={18} />} label="Settings" active={pathname === '/dashboard/settings'} />
        </div>
      </div>

      {/* Profile / Logout Section (Bottom) */}
      <div className="p-4 mt-auto">
        <div className="flex items-center gap-3 px-2 py-3">
          <div className="w-10 h-10 rounded-full bg-gray-800 border border-[var(--border-color)] flex items-center justify-center text-white text-sm font-semibold">
            N
          </div>
          <div className="flex flex-col flex-1 overflow-hidden">
            <span className="font-semibold text-sm text-white truncate">Isabella Rossi</span>
            <span className="text-xs text-[var(--text-muted)]">Admin</span>
          </div>
          <button onClick={handleLogout} className="text-[var(--text-muted)] hover:text-white transition-colors">
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
      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-200 mb-1 ${
        active
          ? 'sidebar-active font-medium'
          : 'text-[var(--foreground)] hover:bg-white/5'
      }`}
    >
      <span className={active ? 'text-gold' : 'text-[var(--text-muted)]'}>{icon}</span>
      <span className="flex-1">{label}</span>
      {active && (
        <div className="w-1.5 h-1.5 rounded-full bg-[var(--gold-light)] ml-2 shadow-[0_0_8px_rgba(246,201,80,0.8)]" />
      )}
    </Link>
  );
}
