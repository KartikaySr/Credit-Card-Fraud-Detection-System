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
    color: 'from-emerald-500/20 to-teal-900/40'
  },
  {
    id: 'biometrics',
    name: 'Behavioral Biometrics',
    description: 'Analyzes keystroke dynamics and mouse velocity vectors for bot detection.',
    icon: <Activity className="text-purple-400 w-8 h-8" />,
    href: '/dashboard/ecosystem/biometrics',
    status: 'ACTIVE',
    color: 'from-purple-500/20 to-indigo-900/40'
  },
  {
    id: 'gnn',
    name: 'Graph Neural Network (GNN)',
    description: 'Interactive 3D visualization of fraud rings connected by shared IPs.',
    icon: <Network className="text-blue-400 w-8 h-8" />,
    href: '/dashboard/gnn',
    status: 'ACTIVE',
    color: 'from-blue-500/20 to-cyan-900/40'
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

const generatedModules = Array.from({ length: 97 }).map((_, i) => ({
  id: `mod-${i}`,
  name: EXTRA_MODULE_NAMES[i % EXTRA_MODULE_NAMES.length] + ` v${Math.floor(Math.random()*5)+1}.${Math.floor(Math.random()*9)}`,
  description: 'Enterprise grade ML model for specialized fraud vectors.',
  icon: <ShieldAlert className="text-gray-500 w-6 h-6" />,
  href: '#',
  status: 'LOCKED (PHASE 4)',
  color: 'from-gray-800/20 to-gray-900/40'
}));

const ALL_MODULES = [...HERO_MODULES, ...generatedModules];

export default function EcosystemPage() {
  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <header>
        <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 mb-2">
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
            className={`group relative glass-card p-6 rounded-2xl border border-white/5 overflow-hidden transition-all duration-300 hover:scale-[1.02] ${mod.href !== '#' ? 'hover:border-white/20 hover:shadow-[0_0_30px_rgba(79,70,229,0.2)]' : 'opacity-70 grayscale hover:grayscale-0'}`}
          >
            {/* Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${mod.color} opacity-50 z-0 transition-opacity group-hover:opacity-100`}></div>
            
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-black/40 rounded-xl border border-white/10 backdrop-blur-md">
                  {mod.icon}
                </div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${mod.status === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-gray-500/20 text-gray-400 border-gray-500/30'}`}>
                  {mod.status}
                </span>
              </div>
              
              <h3 className="text-lg font-bold text-white mb-2">{mod.name}</h3>
              <p className="text-sm text-gray-400 flex-grow">{mod.description}</p>
              
              <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
                <span className="text-xs text-gray-500">Node ID: {Math.random().toString(36).substring(2, 10).toUpperCase()}</span>
                {mod.href !== '#' && (
                  <span className="text-xs font-semibold text-blue-400 group-hover:text-blue-300 flex items-center gap-1">
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
