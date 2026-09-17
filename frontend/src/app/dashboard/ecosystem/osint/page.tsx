'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Terminal, ShieldAlert, Wifi, Globe } from 'lucide-react';
import Link from 'next/link';

interface OSINTEvent {
  timestamp: string;
  source: string;
  compromised_identity: string;
  threat_level: string;
  breach_hash: string;
}

export default function OSINTPage() {
  const [events, setEvents] = useState<OSINTEvent[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-scroll terminal
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [events]);

  useEffect(() => {
    const eventSource = new EventSource('http://localhost:8000/api/v1/intelligence/darkweb');
    
    eventSource.onopen = () => {
      setIsConnected(true);
    };

    eventSource.onmessage = (e) => {
      try {
        const data: OSINTEvent = JSON.parse(e.data);
        setEvents(prev => [...prev, data].slice(-50)); // Keep last 50
      } catch (err) {}
    };

    eventSource.onerror = () => {
      setIsConnected(false);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard/ecosystem" className="text-gray-400 hover:text-white transition-colors">
          ← Back to Ecosystem
        </Link>
      </div>

      <header className="flex justify-between items-end border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Globe className="text-emerald-400 w-8 h-8" />
            <h1 className="text-3xl font-bold text-white">Dark Web OSINT Scanner</h1>
          </div>
          <p className="text-gray-400">Real-time scraping of Tor exit nodes and breach dumps.</p>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 bg-black/40 border border-white/10 rounded-full">
          <Wifi className={isConnected ? "text-emerald-400 animate-pulse" : "text-red-500"} size={16} />
          <span className="text-xs font-mono text-gray-300">
            {isConnected ? 'NODE_CONNECTED' : 'DISCONNECTED'}
          </span>
        </div>
      </header>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Terminal */}
        <div className="lg:col-span-2 glass-card rounded-2xl border border-white/10 flex flex-col h-[600px] overflow-hidden">
          <div className="bg-black/80 px-4 py-3 flex items-center gap-2 border-b border-white/5">
            <Terminal size={16} className="text-emerald-500" />
            <span className="font-mono text-xs text-gray-400">root@nexus-osint:~# tail -f /var/log/darkweb.log</span>
          </div>
          
          <div 
            ref={terminalRef}
            className="flex-1 bg-[#0a0a0a] p-4 overflow-y-auto font-mono text-xs md:text-sm space-y-2"
          >
            <div className="text-emerald-500/50">Initializing Tor circuit... [OK]</div>
            <div className="text-emerald-500/50">Bypassing exit node proxies... [OK]</div>
            <div className="text-emerald-500/50">Listening for compromised credentials...</div>
            <div className="my-4 border-b border-emerald-900/30"></div>
            
            {events.map((ev, i) => (
              <div key={i} className="flex gap-4 hover:bg-emerald-900/10 p-1 rounded transition-colors">
                <span className="text-gray-600 shrink-0">[{new Date(ev.timestamp).toLocaleTimeString()}]</span>
                <span className={`shrink-0 font-bold ${ev.threat_level === 'CRITICAL' ? 'text-red-500 animate-pulse' : ev.threat_level === 'HIGH' ? 'text-orange-400' : 'text-yellow-400'}`}>
                  [{ev.threat_level}]
                </span>
                <span className="text-emerald-400 shrink-0">[{ev.source}]</span>
                <span className="text-gray-300 truncate">Leak detected: <span className="text-white bg-red-900/30 px-1">{ev.compromised_identity}</span></span>
                <span className="text-gray-600 text-[10px] self-center shrink-0 hidden sm:block">HASH: {ev.breach_hash}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Analytics Panel */}
        <div className="space-y-6">
          <div className="glass-card p-6 rounded-2xl border border-white/10 bg-gradient-to-br from-red-500/10 to-transparent">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-red-400">Critical Exposures</p>
                <h3 className="text-4xl font-black text-white mt-2">
                  {events.filter(e => e.threat_level === 'CRITICAL').length}
                </h3>
              </div>
              <ShieldAlert className="text-red-500 w-8 h-8 opacity-50" />
            </div>
            <p className="text-xs text-gray-400 mt-4">Require immediate password reset protocols.</p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-white/10">
            <h3 className="font-bold text-white mb-4">Active Surveillance Targets</h3>
            <ul className="space-y-3">
              {["Pastebin Dumps", "Genesis Market", "Ransomware Blogs", "Telegram C2 Channels"].map((target, i) => (
                <li key={i} className="flex items-center justify-between text-sm">
                  <span className="text-gray-300 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                    {target}
                  </span>
                  <span className="text-emerald-500 font-mono text-xs">MONITORING</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
