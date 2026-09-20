'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Activity, ShieldAlert, Zap, Server, Terminal } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const EXTRA_MODULE_NAMES = [
  "Synthetic Identity Engine", "Quantum Crypto Analyzer", "Geo-Velocity Tracker", 
  "Device Fingerprinter", "IP Reputation Firewall", "LLM Injection Defender",
  "Card Testing Detector", "Account Takeover Shield", "SIM Swap Analyzer",
  "Voice Deepfake Detector", "Mule Account Graph", "Sanctions Screening Node",
  "Crypto AML Tracer", "Transaction Velocity Engine", "Peer-to-Peer Anomaly",
  "Social Engineering Scorer", "Malware Signature Matcher", "VPN/Proxy Unmasker"
];

const mockChartData = Array.from({ length: 24 }).map((_, i) => ({
  time: `${i}:00`,
  scans: Math.floor(Math.random() * 5000) + 1000,
  threats: Math.floor(Math.random() * 50) + 5
}));

export default function DynamicModulePage({ params }: { params: Promise<{ id: string }> }) {
  const [logs, setLogs] = useState<string[]>([]);
  const resolvedParams = React.use(params);
  const idString = resolvedParams.id;
  
  let moduleName = "Enterprise Security Module";
  let vMajor = 1;
  let vMinor = 0;
  let nodeHex = "UNKNOWN";

  if (idString && idString.startsWith('mod-')) {
    const i = parseInt(idString.replace('mod-', ''), 10);
    if (!isNaN(i)) {
      vMajor = (i * 7) % 5 + 1;
      vMinor = (i * 11) % 9;
      moduleName = EXTRA_MODULE_NAMES[i % EXTRA_MODULE_NAMES.length];
      nodeHex = ((i * 31337) ^ 0xDEADBEEF).toString(16).toUpperCase().substring(0, 8);
    }
  }

  const fullName = `${moduleName} v${vMajor}.${vMinor}`;

  useEffect(() => {
    const logMessages = [
      `Initializing ${moduleName} kernel...`,
      `Connecting to Node ID: ${nodeHex}...`,
      `Syncing distributed threat signatures...`,
      `Allocating ML tensors...`,
      `Monitoring inbound traffic stream...`,
      `Scanning payload vector... OK`,
      `Scanning payload vector... OK`,
      `Anomaly detected (confidence: 12%) - Ignored.`,
      `Scanning payload vector... OK`
    ];

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < logMessages.length) {
        setLogs(prev => [...prev, logMessages[currentIndex]]);
        currentIndex++;
      } else {
        setLogs(prev => {
          const newLogs = [...prev];
          if (newLogs.length > 15) newLogs.shift();
          newLogs.push(Math.random() > 0.9 ? `Anomaly detected (confidence: ${(Math.random()*20).toFixed(1)}%) - Ignored.` : `Scanning payload vector... OK`);
          return newLogs;
        });
      }
    }, 800);

    return () => clearInterval(interval);
  }, [moduleName, nodeHex]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <Link href="/dashboard/ecosystem" className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors mb-2 text-sm font-medium">
            <ArrowLeft className="w-4 h-4" /> Back to Ecosystem
          </Link>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            {fullName}
            <span className="text-[10px] font-bold px-2 py-1 rounded-full border bg-emerald-500/20 text-emerald-400 border-emerald-500/30 tracking-widest align-middle">
              ACTIVE
            </span>
          </h1>
          <p className="text-gray-400 mt-2">Node ID: {nodeHex} | Dedicated Enterprise Pipeline</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold transition-all shadow-lg shadow-indigo-900/50 flex items-center gap-2">
            <Zap className="w-4 h-4" /> Force Sync
          </button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="grids-card p-6 rounded-2xl border border-white/5 relative overflow-hidden group">
          <div className="absolute inset-0 bg-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-400 font-medium">Throughput</h3>
              <Activity className="text-indigo-400 w-5 h-5" />
            </div>
            <p className="text-3xl font-black text-white">24.5k <span className="text-sm font-normal text-gray-500">req/s</span></p>
          </div>
        </div>

        <div className="grids-card p-6 rounded-2xl border border-white/5 relative overflow-hidden group">
          <div className="absolute inset-0 bg-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-400 font-medium">Threats Blocked</h3>
              <ShieldAlert className="text-emerald-400 w-5 h-5" />
            </div>
            <p className="text-3xl font-black text-white">1,402 <span className="text-sm font-normal text-emerald-500/80">+12%</span></p>
          </div>
        </div>

        <div className="grids-card p-6 rounded-2xl border border-white/5 relative overflow-hidden group">
          <div className="absolute inset-0 bg-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-400 font-medium">Node Latency</h3>
              <Server className="text-amber-400 w-5 h-5" />
            </div>
            <p className="text-3xl font-black text-white">12 <span className="text-sm font-normal text-gray-500">ms</span></p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Chart */}
        <div className="lg:col-span-2 grids-card p-6 rounded-2xl border border-white/5">
          <h3 className="text-xl font-bold text-white mb-6">24h Pipeline Telemetry</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockChartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="time" stroke="#ffffff50" tick={{ fill: '#ffffff50', fontSize: 12 }} />
                <YAxis stroke="#ffffff50" tick={{ fill: '#ffffff50', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1d1e', border: '1px solid #ffffff10', borderRadius: '8px' }}
                  itemStyle={{ color: '#e4e6eb' }}
                />
                <Line type="monotone" dataKey="scans" stroke="#818cf8" strokeWidth={3} dot={false} activeDot={{ r: 6, fill: '#818cf8' }} />
                <Line type="monotone" dataKey="threats" stroke="#34d399" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Terminal / Live Logs */}
        <div className="grids-card rounded-2xl border border-white/5 bg-[#0a0a0c] overflow-hidden flex flex-col h-[400px]">
          <div className="px-4 py-3 border-b border-white/10 bg-white/5 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-gray-400" />
            <span className="text-xs font-mono text-gray-400 tracking-wider">LIVE NODE STDOUT</span>
          </div>
          <div className="p-4 font-mono text-xs text-emerald-400/80 flex-grow overflow-y-auto flex flex-col justify-end space-y-1">
            {logs.map((log, index) => (
              <div key={index} className="opacity-80 break-words">
                <span className="text-gray-500">[{new Date().toISOString().split('T')[1].substring(0, 8)}]</span> {log}
              </div>
            ))}
            <div className="animate-pulse">_</div>
          </div>
        </div>

      </div>
    </div>
  );
}
