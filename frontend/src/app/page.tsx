'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Fingerprint, Lock, Cpu, Sparkles, AlertTriangle } from 'lucide-react';

const DEMO_CREDENTIALS = { email: 'demo@nexus.ai', password: 'nexus2024' };

export default function LoginPage() {
  const router = useRouter();
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsAuthenticating(true);
    
    setTimeout(() => {
      const isValid = 
        (email === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password) ||
        email === '' || // Allow empty for demo convenience
        true; // Always allow for portfolio/demo mode
      
      if (isValid) {
        localStorage.setItem('nexus_session', JSON.stringify({ 
          token: 'NEXUS_DEMO_TOKEN_' + Date.now(),
          user: email || 'demo@nexus.ai',
          role: 'Enterprise Analyst',
          expires: Date.now() + 24 * 60 * 60 * 1000
        }));
        router.push('/dashboard');
      } else {
        setIsAuthenticating(false);
        setError('Invalid credentials. Try demo@nexus.ai / nexus2024');
      }
    }, 2000);
  };

  return (
    <div className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-[var(--background)] text-[var(--foreground)]">
      {/* Background Animated Orbs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[var(--status-green)]/10 rounded-full blur-[120px] mix-blend-screen animate-pulse pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[var(--highlight)]/5 rounded-full blur-[100px] mix-blend-screen animate-pulse pointer-events-none" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-900/10 rounded-full blur-[150px] mix-blend-screen pointer-events-none"></div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none mix-blend-overlay"></div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none"></div>

      <div className="z-10 w-full max-w-md p-8 relative">
        <div className="absolute inset-0 bg-[var(--sidebar-bg)]/80 backdrop-blur-2xl rounded-3xl border border-[var(--border-color)] shadow-2xl"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--status-green)]/5 via-transparent to-[var(--highlight)]/5 rounded-3xl"></div>
        
        <div className="relative z-20 flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-[var(--sidebar-hover)] border border-[var(--border-color)] flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(20,83,45,0.3)]">
            <Shield size={32} className="text-[var(--status-green)]" />
          </div>
          
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-400 mb-2">Nexus Fraud Engine</h1>
          <p className="text-sm text-[var(--text-muted)] mb-8 text-center flex items-center gap-2">
            <Cpu size={14} className="text-[var(--highlight)]" /> Quantum Secured Gateway
          </p>

          <form onSubmit={handleLogin} className="w-full space-y-5">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Agent ID</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--text-muted)]">
                  <Fingerprint size={16} />
                </div>
                <input 
                  type="text" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[var(--sidebar-hover)] border border-[var(--border-color)] rounded-xl py-3 pl-10 pr-4 text-white placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--highlight)] focus:ring-1 focus:ring-[var(--highlight)] transition-all"
                  placeholder="DEMO_MODE_ACTIVE"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Passkey</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--text-muted)]">
                  <Lock size={16} />
                </div>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[var(--sidebar-hover)] border border-[var(--border-color)] rounded-xl py-3 pl-10 pr-4 text-white placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--highlight)] focus:ring-1 focus:ring-[var(--highlight)] transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isAuthenticating}
              className="w-full py-3.5 mt-4 bg-[var(--status-green)] hover:bg-emerald-600 text-white font-semibold rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] flex items-center justify-center gap-2 overflow-hidden relative"
            >
              {isAuthenticating ? (
                <>
                  <Sparkles size={18} className="animate-pulse" />
                  <span>Verifying Neural Signature...</span>
                </>
              ) : (
                <>Initialize Session</>
              )}
            </button>
            
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-900/20 border border-red-500/20 rounded-lg">
                <AlertTriangle size={14} className="text-red-400 shrink-0" />
                <p className="text-xs text-red-400">{error}</p>
              </div>
            )}
          </form>

          <div className="mt-6 p-3 bg-[var(--sidebar-hover)] border border-[var(--border-color)] rounded-xl w-full">
            <p className="text-xs text-[var(--text-muted)] text-center font-mono">
              DEMO MODE ACTIVE<br />
              <span className="text-gray-300">demo@nexus.ai</span> · <span className="text-gray-300">nexus2024</span>
            </p>
          </div>

          <p className="text-xs text-[var(--text-muted)] mt-4 text-center opacity-70">
            Authorized Personnel Only. <br/> Interactions are monitored by the AI sub-routine.
          </p>
        </div>
      </div>
    </div>
  );
}
