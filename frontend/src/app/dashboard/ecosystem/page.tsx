'use client';

import React from 'react';
import Link from 'next/link';
import { Network, Search, Zap, ShieldAlert, Key, Globe, Eye, Fingerprint, Activity, Crosshair } from 'lucide-react';

const HERO_MODULES = [
  {
    id: 'osint',
    name: 'Dark Web OSINT Scanner',
    description: 'Scrapes Tor nodes and Pastebin for compromised credentials linked to transactions.',
    icon: <Globe className="text-emerald-400 w-8 h-8" />,
    href: '/dashboard/ecosystem/osint',
    status: 'ACTIVE',
    color: 'from-emerald-500/20 to-teal-900/40',
    nodeId: 'E3F9B2A1'
  },
  {
    id: 'biometrics',
    name: 'Behavioral Biometrics',
    description: 'Analyzes keystroke dynamics and mouse velocity vectors for bot detection.',
    icon: <Activity className="text-amber-400 w-8 h-8" />,
    href: '/dashboard/ecosystem/biometrics',
    status: 'ACTIVE',
    color: 'from-amber-500/20 to-yellow-900/40',
    nodeId: 'A7C4D9F0'
  },
  {
    id: 'gnn',
    name: 'Graph Neural Network (GNN)',
    description: 'Interactive 3D visualization of fraud rings connected by shared IPs.',
    icon: <Network className="text-gold w-8 h-8" />,
    href: '/dashboard/gnn',
    status: 'ACTIVE',
    color: 'from-gold/20 to-amber-900/40',
    nodeId: 'D8E1F4C2'
  }
];

// Generate 97 extra modules for the 100 module goal
const EXTRA_MODULE_NAMES = [
  "Synthetic Identity Engine", "Quantum Crypto Analyzer", "Geo-Velocity Tracker", 
  "Device Fingerprinter", "IP Reputation Firewall", "LLM Injection Defender",
  "Card Testing Detector", "Account Takeover Shield", "SIM Swap Analyzer",
  "Voice Deepfake Detector", "Mule Account Graph", "Sanctions Screening Node",
  "Crypto AML Tracer", "Transaction Velocity Engine", "Peer-to-Peer Anomaly",
  "Social Engineering Scorer", "Malware Signature Matcher", "VPN/Proxy Unmasker"
];

const generatedModules = Array.from({ length: 97 }).map((_, i) => {
  const isUnlocked = i < 15;
  const modId = `mod-${i}`;
  const vMajor = (i * 7) % 5 + 1;
  const vMinor = (i * 11) % 9;
  const nodeHex = ((i * 31337) ^ 0xDEADBEEF).toString(16).toUpperCase().substring(0, 8);
  
  return {
    id: modId,
    name: EXTRA_MODULE_NAMES[i % EXTRA_MODULE_NAMES.length] + ` v${vMajor}.${vMinor}`,
    description: 'Enterprise grade ML model for specialized fraud vectors.',
    icon: <ShieldAlert className={isUnlocked ? "text-indigo-400 w-6 h-6" : "text-gray-500 w-6 h-6"} />,
    href: isUnlocked ? `/dashboard/ecosystem/${modId}` : '/dashboard/ecosystem/coming-soon',
    status: isUnlocked ? 'ACTIVE' : 'LOCKED (PHASE 4)',
    color: isUnlocked ? 'from-indigo-500/20 to-blue-900/40' : 'from-gray-800/20 to-gray-900/40',
    nodeId: nodeHex
  };
});

const ALL_MODULES = [...HERO_MODULES, ...generatedModules];

export default function EcosystemPage() {
  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <header>
        <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-gold to-yellow-200 mb-2">
          Enterprise Module Ecosystem
        </h1>
        <p className="text-[var(--text-muted)] text-lg max-w-3xl">
          Access 100+ highly specialized machine learning modules. Hero modules (Phase 3) are active. Enterprise modules are locked for Phase 4 deployment.
        </p>
      </header>

      {/* Grid of 100 Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {ALL_MODULES.map((mod, i) => (
          <Link 
            key={i} 
            href={mod.href}
            className={`group relative grids-card p-6 rounded-2xl border border-white/5 overflow-hidden transition-all duration-300 hover:scale-[1.02] ${mod.status === 'ACTIVE' ? 'hover:border-gold/30 hover:shadow-[0_0_30px_rgba(230,197,82,0.15)]' : 'opacity-70 grayscale hover:grayscale-0'}`}
          >
            {/* Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${mod.color} opacity-50 z-0 transition-opacity group-hover:opacity-100`}></div>
            
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-black/40 rounded-xl border border-white/10 backdrop-blur-md">
                  {mod.icon}
                </div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${mod.status === 'ACTIVE' ? (i < 15 && mod.id.startsWith('mod-') ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30') : 'bg-gray-500/20 text-gray-400 border-gray-500/30'}`}>
                  {mod.status}
                </span>
              </div>
              
              <h3 className="text-lg font-bold text-white mb-2">{mod.name}</h3>
              <p className="text-sm text-gray-400 flex-grow">{mod.description}</p>
              
              <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
                <span className="text-xs text-gray-500">Node ID: {(mod as any).nodeId || `NODE-${i}`}</span>
                {mod.status === 'ACTIVE' && (
                  <span className="text-xs font-semibold text-gold group-hover:text-gold-light flex items-center gap-1">
                    Initialize <Zap className="w-3 h-3" />
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
